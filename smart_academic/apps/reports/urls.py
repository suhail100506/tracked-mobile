"""
URL routes for the reports module.

All endpoints here are mounted under /api/reports/ by the root router.
"""
from django.urls import path

from .views import DepartmentReportView, FacultyReportView, StudentReportView

urlpatterns = [
    # Student downloadable report endpoint (supports pdf and excel format query).
    path("student/<int:student_id>/", StudentReportView.as_view(), name="report-student"),
    # Faculty summary report endpoint.
    path("faculty/<int:faculty_id>/", FacultyReportView.as_view(), name="report-faculty"),
    # Department-level report endpoint.
    path("department/", DepartmentReportView.as_view(), name="report-department"),
]
