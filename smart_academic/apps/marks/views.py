"""
API views for the marks module.

Exposes faculty upload endpoints and student/class marks analytics APIs.
"""
from decimal import Decimal

from django.db.models import Avg, F, Sum
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.permissions import IsAdminOrFacultyRole, IsKnownAcademicRole

from .models import Marks
from .serializers import MarksSerializer, MarksUploadSerializer


class MarksUploadView(APIView):
    """Allow faculty/admin users to upload or update student marks."""

    permission_classes = [IsAuthenticated, IsAdminOrFacultyRole]

    def post(self, request):
        """Create or update marks for a student-subject pair."""
        try:
            serializer = MarksUploadSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            data = serializer.validated_data
            marks_obj, _ = Marks.objects.update_or_create(
                student=data["student"],
                subject=data["subject"],
                defaults={
                    "internal_marks": data["internal_marks"],
                    "assignment_marks": data["assignment_marks"],
                    "lab_marks": data["lab_marks"],
                    "uploaded_by": request.user,
                },
            )

            return Response(
                {
                    "message": "Marks uploaded successfully.",
                    "record": MarksSerializer(marks_obj).data,
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as exc:
            return Response(
                {"error": "Failed to upload marks.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class StudentMarksView(APIView):
    """Return marks grouped by subject for a selected student."""

    permission_classes = [IsAuthenticated, IsKnownAcademicRole]

    def get(self, request, student_id):
        """Allow admin/faculty access or self-access for student users."""
        try:
            if request.user.role == "student" and request.user.id != student_id:
                return Response(
                    {"error": "Students can only view their own marks."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            rows = Marks.objects.filter(student_id=student_id).select_related("subject", "student")
            return Response(
                {
                    "student_id": student_id,
                    "records": MarksSerializer(rows, many=True).data,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as exc:
            return Response(
                {"error": "Unable to fetch student marks.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class TopperListView(APIView):
    """Return top-performing students ordered by combined marks totals."""

    permission_classes = [IsAuthenticated, IsAdminOrFacultyRole]

    def get(self, request):
        """Aggregate marks by student and return top performers."""
        try:
            limit = int(request.query_params.get("limit", 10))
            rows = (
                Marks.objects.values("student_id", "student__username", "student__first_name", "student__last_name")
                .annotate(total_score=Sum(F("internal_marks") + F("assignment_marks") + F("lab_marks")))
                .order_by("-total_score")[:limit]
            )

            result = []
            for item in rows:
                name = f"{item['student__first_name']} {item['student__last_name']}".strip() or item["student__username"]
                result.append(
                    {
                        "student_id": item["student_id"],
                        "student_name": name,
                        "total_score": float(item["total_score"] or 0),
                    }
                )

            return Response({"toppers": result}, status=status.HTTP_200_OK)
        except Exception as exc:
            return Response(
                {"error": "Unable to fetch toppers list.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ClassAverageView(APIView):
    """Return subject-wise class averages for each marks component."""

    permission_classes = [IsAuthenticated, IsAdminOrFacultyRole]

    def get(self, request):
        """Compute average marks per subject and overall average total."""
        try:
            rows = (
                Marks.objects.values("subject__id", "subject__code", "subject__name")
                .annotate(
                    internal_avg=Avg("internal_marks"),
                    assignment_avg=Avg("assignment_marks"),
                    lab_avg=Avg("lab_marks"),
                )
                .order_by("subject__code")
            )

            data = []
            for row in rows:
                total_avg = Decimal(row["internal_avg"] or 0) + Decimal(row["assignment_avg"] or 0) + Decimal(row["lab_avg"] or 0)
                data.append(
                    {
                        "subject_id": row["subject__id"],
                        "subject_code": row["subject__code"],
                        "subject_name": row["subject__name"],
                        "internal_average": round(float(row["internal_avg"] or 0), 2),
                        "assignment_average": round(float(row["assignment_avg"] or 0), 2),
                        "lab_average": round(float(row["lab_avg"] or 0), 2),
                        "total_average": round(float(total_avg), 2),
                    }
                )

            return Response({"subjects": data}, status=status.HTTP_200_OK)
        except Exception as exc:
            return Response(
                {"error": "Unable to calculate class averages.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )
