"""
URL routes for the marks module.

All endpoints here are mounted under /api/marks/ by the root router.
"""
from django.urls import path

from .views import ClassAverageView, MarksUploadView, StudentMarksView, TopperListView

urlpatterns = [
    # Faculty/admin marks upload endpoint.
    path("upload/", MarksUploadView.as_view(), name="marks-upload"),
    # Student marks retrieval endpoint.
    path("student/<int:student_id>/", StudentMarksView.as_view(), name="marks-student"),
    # Top performers endpoint.
    path("topper/", TopperListView.as_view(), name="marks-topper"),
    # Subject-wise class average endpoint.
    path("average/", ClassAverageView.as_view(), name="marks-average"),
]
