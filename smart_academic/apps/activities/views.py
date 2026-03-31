"""
API views for the activities module.

Provides student activity submission and admin/faculty approval workflows.
"""
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.permissions import IsAdminOrFacultyRole, IsKnownAcademicRole, IsStudentRole

from .models import Activity
from .serializers import ActivityApprovalSerializer, ActivitySerializer


class AddActivityView(APIView):
    """Allow students to submit activity records."""

    permission_classes = [IsAuthenticated, IsStudentRole]

    def post(self, request):
        """Create an activity entry owned by the authenticated student."""
        try:
            serializer = ActivitySerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            activity = serializer.save(student=request.user)
            return Response(
                {
                    "message": "Activity added successfully.",
                    "activity": ActivitySerializer(activity).data,
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as exc:
            return Response(
                {"error": "Failed to add activity.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ApproveActivityView(APIView):
    """Allow admin/faculty to approve or reject submitted activities."""

    permission_classes = [IsAuthenticated, IsAdminOrFacultyRole]

    def put(self, request, activity_id):
        """Update activity status and assign points during approval workflow."""
        try:
            activity = Activity.objects.get(id=activity_id)
            serializer = ActivityApprovalSerializer(activity, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            updated_activity = serializer.save(approved_by=request.user)
            return Response(
                {
                    "message": "Activity reviewed successfully.",
                    "activity": ActivitySerializer(updated_activity).data,
                },
                status=status.HTTP_200_OK,
            )
        except Activity.DoesNotExist:
            return Response({"error": "Activity not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as exc:
            return Response(
                {"error": "Failed to review activity.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class StudentActivitiesView(APIView):
    """List activities submitted by a specific student."""

    permission_classes = [IsAuthenticated, IsKnownAcademicRole]

    def get(self, request, student_id):
        """Allow admin/faculty access or self-access for student users."""
        try:
            if request.user.role == "student" and request.user.id != student_id:
                return Response(
                    {"error": "Students can only view their own activities."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            queryset = Activity.objects.filter(student_id=student_id)
            return Response(
                {
                    "student_id": student_id,
                    "activities": ActivitySerializer(queryset, many=True).data,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as exc:
            return Response(
                {"error": "Unable to fetch student activities.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class PendingActivitiesView(APIView):
    """List all activities waiting for approval."""

    permission_classes = [IsAuthenticated, IsAdminOrFacultyRole]

    def get(self, request):
        """Fetch pending activities for review queues."""
        try:
            queryset = Activity.objects.filter(status=Activity.Status.PENDING)
            return Response(
                {
                    "count": queryset.count(),
                    "activities": ActivitySerializer(queryset, many=True).data,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as exc:
            return Response(
                {"error": "Unable to fetch pending activities.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )
