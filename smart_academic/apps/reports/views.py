"""
API views for the reports module.

Supports student PDF/Excel exports and faculty/department reporting APIs.
"""
from io import BytesIO

from django.db.models import Count
from django.http import HttpResponse
from openpyxl import Workbook
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.activities.models import Activity
from apps.attendance.models import Attendance, Subject
from apps.marks.models import Marks
from apps.users.models import CustomUser
from apps.users.permissions import IsAdminOrFacultyRole, IsKnownAcademicRole


class StudentReportView(APIView):
    """Generate a student report in PDF or Excel based on query parameter."""

    permission_classes = [IsAuthenticated, IsKnownAcademicRole]

    def get(self, request, student_id):
        """Return student report file in requested format: pdf or excel."""
        try:
            if request.user.role == "student" and request.user.id != student_id:
                return Response(
                    {"error": "Students can only download their own report."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            if request.user.role not in {"admin", "faculty", "student"}:
                return Response(
                    {"error": "Not authorized to access student reports."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            student = CustomUser.objects.get(id=student_id, role="student")
            output_format = request.query_params.get("format", "pdf").lower()

            attendance_count = Attendance.objects.filter(student=student).count()
            attendance_present = Attendance.objects.filter(student=student, status__in=["present", "late"]).count()
            attendance_pct = round((attendance_present / attendance_count) * 100, 2) if attendance_count else 0
            marks = Marks.objects.filter(student=student)
            activities = Activity.objects.filter(student=student)

            if output_format == "excel":
                workbook = Workbook()
                sheet = workbook.active
                sheet.title = "Student Report"
                sheet.append(["Student ID", student.id])
                sheet.append(["Student Name", student.full_name])
                sheet.append(["Department", student.department])
                sheet.append(["Attendance %", attendance_pct])
                sheet.append([])
                sheet.append(["Subject", "Internal", "Assignment", "Lab", "Total"])
                for row in marks:
                    sheet.append(
                        [
                            row.subject.code,
                            float(row.internal_marks),
                            float(row.assignment_marks),
                            float(row.lab_marks),
                            float(row.total_marks),
                        ]
                    )
                sheet.append([])
                sheet.append(["Activity", "Type", "Status", "Points"])
                for activity in activities:
                    sheet.append([activity.title, activity.activity_type, activity.status, activity.points])

                buffer = BytesIO()
                workbook.save(buffer)
                buffer.seek(0)
                response = HttpResponse(
                    buffer.getvalue(),
                    content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                )
                response["Content-Disposition"] = f'attachment; filename="student_{student_id}_report.xlsx"'
                return response

            if output_format == "pdf":
                buffer = BytesIO()
                pdf = canvas.Canvas(buffer, pagesize=A4)
                y = 800

                pdf.setFont("Helvetica-Bold", 14)
                pdf.drawString(40, y, "Student Report")
                y -= 30

                pdf.setFont("Helvetica", 11)
                pdf.drawString(40, y, f"Student ID: {student.id}")
                y -= 18
                pdf.drawString(40, y, f"Name: {student.full_name}")
                y -= 18
                pdf.drawString(40, y, f"Department: {student.department}")
                y -= 18
                pdf.drawString(40, y, f"Attendance Percentage: {attendance_pct}%")
                y -= 26

                pdf.setFont("Helvetica-Bold", 12)
                pdf.drawString(40, y, "Marks")
                y -= 20
                pdf.setFont("Helvetica", 10)
                for row in marks:
                    pdf.drawString(
                        40,
                        y,
                        f"{row.subject.code}: Internal {row.internal_marks}, Assignment {row.assignment_marks}, Lab {row.lab_marks}, Total {row.total_marks}",
                    )
                    y -= 16
                    if y < 80:
                        pdf.showPage()
                        y = 800

                y -= 10
                pdf.setFont("Helvetica-Bold", 12)
                pdf.drawString(40, y, "Activities")
                y -= 20
                pdf.setFont("Helvetica", 10)
                for activity in activities:
                    pdf.drawString(40, y, f"{activity.title} ({activity.activity_type}) - {activity.status}, Points: {activity.points}")
                    y -= 16
                    if y < 80:
                        pdf.showPage()
                        y = 800

                pdf.showPage()
                pdf.save()
                buffer.seek(0)
                response = HttpResponse(buffer.getvalue(), content_type="application/pdf")
                response["Content-Disposition"] = f'attachment; filename="student_{student_id}_report.pdf"'
                return response

            return Response(
                {"error": "Unsupported format. Use format=pdf or format=excel."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except CustomUser.DoesNotExist:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as exc:
            return Response(
                {"error": "Failed to generate student report.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class FacultyReportView(APIView):
    """Return faculty-level summary report as JSON."""

    permission_classes = [IsAuthenticated, IsAdminOrFacultyRole]

    def get(self, request, faculty_id):
        """Build summary metrics for a faculty member."""
        try:
            faculty = CustomUser.objects.get(id=faculty_id, role="faculty")
            subjects_count = Subject.objects.filter(faculty=faculty).count()
            attendance_marked = Attendance.objects.filter(marked_by=faculty).count()
            marks_uploaded = Marks.objects.filter(uploaded_by=faculty).count()
            approved_activities = Activity.objects.filter(approved_by=faculty).count()

            return Response(
                {
                    "faculty_id": faculty.id,
                    "faculty_name": faculty.full_name,
                    "department": faculty.department,
                    "subjects_count": subjects_count,
                    "attendance_marked": attendance_marked,
                    "marks_uploaded": marks_uploaded,
                    "approved_activities": approved_activities,
                },
                status=status.HTTP_200_OK,
            )
        except CustomUser.DoesNotExist:
            return Response({"error": "Faculty not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as exc:
            return Response(
                {"error": "Failed to generate faculty report.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class DepartmentReportView(APIView):
    """Return department-level aggregated report as JSON."""

    permission_classes = [IsAuthenticated, IsAdminOrFacultyRole]

    def get(self, request):
        """Aggregate student/faculty/subject counts per department."""
        try:
            rows = (
                CustomUser.objects.values("department")
                .annotate(total_users=Count("id"))
                .order_by("department")
            )

            data = []
            for row in rows:
                department = row["department"]
                data.append(
                    {
                        "department": department,
                        "total_users": row["total_users"],
                        "students": CustomUser.objects.filter(department=department, role="student").count(),
                        "faculty": CustomUser.objects.filter(department=department, role="faculty").count(),
                        "subjects": Subject.objects.filter(department=department).count(),
                    }
                )

            return Response({"departments": data}, status=status.HTTP_200_OK)
        except Exception as exc:
            return Response(
                {"error": "Failed to generate department report.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )
