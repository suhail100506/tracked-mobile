"""
URL routes for the analytics module.

All endpoints here are mounted under /api/analytics/ by the root router.
"""
from django.urls import path

from .views import (
    AtRiskStudentsView,
    AttendanceMarksCorrelationView,
    DepartmentSummaryView,
    SlowLearnersView,
    TopPerformersAnalyticsView,
)

urlpatterns = [
    # Attendance versus marks correlation data endpoint.
    path("correlation/", AttendanceMarksCorrelationView.as_view(), name="analytics-correlation"),
    # Top 10 performers endpoint.
    path("top-performers/", TopPerformersAnalyticsView.as_view(), name="analytics-top-performers"),
    # Below-average performance endpoint.
    path("slow-learners/", SlowLearnersView.as_view(), name="analytics-slow-learners"),
    # Low attendance plus low marks endpoint.
    path("at-risk/", AtRiskStudentsView.as_view(), name="analytics-at-risk"),
    # Department-wise summary endpoint.
    path("department-summary/", DepartmentSummaryView.as_view(), name="analytics-department-summary"),
]
