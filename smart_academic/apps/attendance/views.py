"""
API views for the attendance module.

Contains faculty/admin/student attendance endpoints including bulk marking,
percentage analytics, and shortage reporting.
"""
from collections import defaultdict

from django.db.models import Count, Q
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.models import CustomUser
from apps.users.permissions import IsAdminOrFacultyRole, IsKnownAcademicRole

from .models import Attendance
from .serializers import AttendanceSerializer, BulkAttendanceMarkSerializer


class MarkAttendanceView(APIView):
    """Allow faculty/admin users to mark attendance in bulk."""

    permission_classes = [IsAuthenticated, IsAdminOrFacultyRole]

    def post(self, request):
        """Create or update attendance records from a bulk payload."""
        try:
            serializer = BulkAttendanceMarkSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            processed_rows = []
            for row in serializer.validated_data["records"]:
                attendance_obj, _ = Attendance.objects.update_or_create(
                    student_id=row["student"],
                    subject_id=row["subject"],
                    date=row["date"],
                    defaults={
                        "status": row["status"],
                        "marked_by": request.user,
                    },
                )
                processed_rows.append(attendance_obj)

            return Response(
                {
                    "message": "Attendance marked successfully.",
                    "count": len(processed_rows),
                    "records": AttendanceSerializer(processed_rows, many=True).data,
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as exc:
            return Response(
                {"error": "Failed to mark attendance.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class StudentAttendanceView(APIView):
    """Return attendance records grouped by subject for a student."""

    permission_classes = [IsAuthenticated, IsKnownAcademicRole]

    def get(self, request, student_id):
        """Fetch attendance rows and group them by subject for readability."""
        try:
            if request.user.role == "student" and request.user.id != student_id:
                return Response(
                    {"error": "Students can only view their own attendance."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            if request.user.role not in {"admin", "faculty", "student"}:
                return Response(
                    {"error": "You are not authorized to access attendance data."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            queryset = Attendance.objects.filter(student_id=student_id).select_related("subject", "student")
            grouped = defaultdict(list)
            for entry in queryset:
                grouped[entry.subject.code].append(AttendanceSerializer(entry).data)

            return Response(
                {
                    "student_id": student_id,
                    "subjects": grouped,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as exc:
            return Response(
                {"error": "Unable to fetch student attendance.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class AttendancePercentageView(APIView):
    """Return attendance percentage per subject for a student."""

    permission_classes = [IsAuthenticated, IsKnownAcademicRole]

    def get(self, request, student_id):
        """Compute per-subject attendance percentage using present+late as attended."""
        try:
            if request.user.role == "student" and request.user.id != student_id:
                return Response(
                    {"error": "Students can only view their own attendance percentage."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            rows = (
                Attendance.objects.filter(student_id=student_id)
                .values("subject__id", "subject__code", "subject__name")
                .annotate(
                    total_classes=Count("id"),
                    attended_classes=Count("id", filter=Q(status__in=["present", "late"])),
                )
            )

            result = []
            for row in rows:
                total = row["total_classes"] or 0
                attended = row["attended_classes"] or 0
                percentage = round((attended / total) * 100, 2) if total else 0
                result.append(
                    {
                        "subject_id": row["subject__id"],
                        "subject_code": row["subject__code"],
                        "subject_name": row["subject__name"],
                        "attendance_percentage": percentage,
                    }
                )

            return Response({"student_id": student_id, "percentages": result}, status=status.HTTP_200_OK)
        except Exception as exc:
            return Response(
                {"error": "Unable to calculate attendance percentage.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class AttendanceShortageView(APIView):
    """List students whose overall attendance is below a threshold."""

    permission_classes = [IsAuthenticated, IsAdminOrFacultyRole]

    def get(self, request):
        """Calculate overall attendance percentage and return shortage students."""
        try:
            threshold = float(request.query_params.get("threshold", 75))
            students = CustomUser.objects.filter(role="student")

            shortage_list = []
            for student in students:
                total = Attendance.objects.filter(student=student).count()
                attended = Attendance.objects.filter(student=student, status__in=["present", "late"]).count()
                percentage = round((attended / total) * 100, 2) if total else 0
                if percentage < threshold:
                    shortage_list.append(
                        {
                            "student_id": student.id,
                            "student_name": student.full_name,
                            "department": student.department,
                            "attendance_percentage": percentage,
                        }
                    )

            return Response(
                {
                    "threshold": threshold,
                    "count": len(shortage_list),
                    "students": shortage_list,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as exc:
            return Response(
                {"error": "Unable to generate shortage list.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )
