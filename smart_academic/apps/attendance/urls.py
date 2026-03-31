"""
URL routes for the attendance module.

All endpoints here are mounted under /api/attendance/ by the root router.
"""
from django.urls import path

from .views import (
    AttendancePercentageView,
    AttendanceShortageView,
    MarkAttendanceView,
    StudentAttendanceView,
)

urlpatterns = [
    # Faculty/admin bulk attendance marking endpoint.
    path("mark/", MarkAttendanceView.as_view(), name="attendance-mark"),
    # Attendance retrieval for a specific student.
    path("student/<int:student_id>/", StudentAttendanceView.as_view(), name="attendance-student"),
    # Per-subject attendance percentage for one student.
    path("percentage/<int:student_id>/", AttendancePercentageView.as_view(), name="attendance-percentage"),
    # Students below the configured attendance threshold (default 75%).
    path("shortage/", AttendanceShortageView.as_view(), name="attendance-shortage"),
]
