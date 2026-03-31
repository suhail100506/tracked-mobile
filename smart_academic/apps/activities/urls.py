"""
URL routes for the activities module.

All endpoints here are mounted under /api/activities/ by the root router.
"""
from django.urls import path

from .views import AddActivityView, ApproveActivityView, PendingActivitiesView, StudentActivitiesView

urlpatterns = [
    # Student activity submission endpoint.
    path("add/", AddActivityView.as_view(), name="activity-add"),
    # Admin/faculty activity approval endpoint.
    path("approve/<int:activity_id>/", ApproveActivityView.as_view(), name="activity-approve"),
    # Student activity history endpoint.
    path("student/<int:student_id>/", StudentActivitiesView.as_view(), name="activity-student"),
    # Pending activities queue endpoint.
    path("pending/", PendingActivitiesView.as_view(), name="activity-pending"),
]
