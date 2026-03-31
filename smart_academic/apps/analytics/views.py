"""
API views for the analytics module.

Provides cross-module analytics derived from attendance and marks datasets.
"""
from collections import defaultdict

from django.db.models import Avg, Count
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.attendance.models import Attendance
from apps.marks.models import Marks
from apps.users.models import CustomUser
from apps.users.permissions import IsAdminOrFacultyRole


def _student_attendance_percentage(student_id: int) -> float:
    """Calculate overall attendance percentage for a student."""
    total = Attendance.objects.filter(student_id=student_id).count()
    attended = Attendance.objects.filter(student_id=student_id, status__in=["present", "late"]).count()
    return round((attended / total) * 100, 2) if total else 0.0


def _student_total_marks(student_id: int) -> float:
    """Calculate cumulative marks total across all subjects for a student."""
    rows = Marks.objects.filter(student_id=student_id)
    return round(sum(float(row.total_marks) for row in rows), 2)


class AttendanceMarksCorrelationView(APIView):
    """Return student-level attendance and marks pairs for correlation analysis."""

    permission_classes = [IsAuthenticated, IsAdminOrFacultyRole]

    def get(self, request):
        """Build correlation input data where each row maps attendance to marks."""
        try:
            students = CustomUser.objects.filter(role="student")
            data = []
            for student in students:
                data.append(
                    {
                        "student_id": student.id,
                        "student_name": student.full_name,
                        "department": student.department,
                        "attendance_percentage": _student_attendance_percentage(student.id),
                        "total_marks": _student_total_marks(student.id),
                    }
                )

            return Response({"correlation_data": data}, status=status.HTTP_200_OK)
        except Exception as exc:
            return Response(
                {"error": "Unable to generate correlation data.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class TopPerformersAnalyticsView(APIView):
    """Return top 10 students by total accumulated marks."""

    permission_classes = [IsAuthenticated, IsAdminOrFacultyRole]

    def get(self, request):
        """Sort students by total marks and return the highest performers."""
        try:
            students = list(CustomUser.objects.filter(role="student"))
            ranked = []
            for student in students:
                ranked.append(
                    {
                        "student_id": student.id,
                        "student_name": student.full_name,
                        "department": student.department,
                        "total_marks": _student_total_marks(student.id),
                    }
                )

            ranked.sort(key=lambda item: item["total_marks"], reverse=True)
            return Response({"top_performers": ranked[:10]}, status=status.HTTP_200_OK)
        except Exception as exc:
            return Response(
                {"error": "Unable to fetch top performers.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class SlowLearnersView(APIView):
    """Return students performing below class average marks."""

    permission_classes = [IsAuthenticated, IsAdminOrFacultyRole]

    def get(self, request):
        """Compare each student's total against the cohort average total."""
        try:
            students = list(CustomUser.objects.filter(role="student"))
            totals = [
                {
                    "student": student,
                    "total": _student_total_marks(student.id),
                }
                for student in students
            ]

            cohort_average = round(sum(item["total"] for item in totals) / len(totals), 2) if totals else 0
            slow = [
                {
                    "student_id": item["student"].id,
                    "student_name": item["student"].full_name,
                    "department": item["student"].department,
                    "total_marks": item["total"],
                }
                for item in totals
                if item["total"] < cohort_average
            ]

            return Response(
                {
                    "class_average_total_marks": cohort_average,
                    "slow_learners": slow,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as exc:
            return Response(
                {"error": "Unable to fetch slow learners.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class AtRiskStudentsView(APIView):
    """Return students with both low attendance and low marks."""

    permission_classes = [IsAuthenticated, IsAdminOrFacultyRole]

    def get(self, request):
        """Identify students at risk using attendance and marks thresholds."""
        try:
            attendance_threshold = float(request.query_params.get("attendance_threshold", 75))
            students = list(CustomUser.objects.filter(role="student"))

            totals = [_student_total_marks(student.id) for student in students]
            marks_threshold = round(sum(totals) / len(totals), 2) if totals else 0

            risk_rows = []
            for student in students:
                attendance_pct = _student_attendance_percentage(student.id)
                total_marks = _student_total_marks(student.id)
                if attendance_pct < attendance_threshold and total_marks < marks_threshold:
                    risk_rows.append(
                        {
                            "student_id": student.id,
                            "student_name": student.full_name,
                            "department": student.department,
                            "attendance_percentage": attendance_pct,
                            "total_marks": total_marks,
                        }
                    )

            return Response(
                {
                    "attendance_threshold": attendance_threshold,
                    "marks_threshold": marks_threshold,
                    "at_risk_students": risk_rows,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as exc:
            return Response(
                {"error": "Unable to fetch at-risk students.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class DepartmentSummaryView(APIView):
    """Return department-wise student count and performance summaries."""

    permission_classes = [IsAuthenticated, IsAdminOrFacultyRole]

    def get(self, request):
        """Compile department-level statistics from users, marks, and attendance."""
        try:
            departments = (
                CustomUser.objects.filter(role="student")
                .values("department")
                .annotate(student_count=Count("id"))
                .order_by("department")
            )

            output = []
            for row in departments:
                department = row["department"]
                students = CustomUser.objects.filter(role="student", department=department)
                student_ids = list(students.values_list("id", flat=True))

                attendance_values = [_student_attendance_percentage(student_id) for student_id in student_ids]

                marks_rows = Marks.objects.filter(student_id__in=student_ids)
                marks_total = [float(item.total_marks) for item in marks_rows]

                output.append(
                    {
                        "department": department,
                        "student_count": row["student_count"],
                        "average_attendance": round(sum(attendance_values) / len(attendance_values), 2) if attendance_values else 0,
                        "average_marks": round(sum(marks_total) / len(marks_total), 2) if marks_total else 0,
                    }
                )

            return Response({"department_summary": output}, status=status.HTTP_200_OK)
        except Exception as exc:
            return Response(
                {"error": "Unable to generate department summary.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )
