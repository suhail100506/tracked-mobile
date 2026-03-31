"""
URL routes for the users module.

All endpoints here are mounted under /api/users/ by the project router.
"""
from django.urls import path

from .views import (
    LoginView,
    LogoutView,
    StudentProfileView,
    UserCreateView,
    UserDetailView,
    UserListView,
)

urlpatterns = [
    # Authentication routes (custom JWT login/logout flows).
    path("login/", LoginView.as_view(), name="user-login"),
    path("logout/", LogoutView.as_view(), name="user-logout"),
    # Admin user management routes.
    path("", UserListView.as_view(), name="user-list"),
    path("create/", UserCreateView.as_view(), name="user-create"),
    path("<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    # Student profile route for currently authenticated student.
    path("student/profile/", StudentProfileView.as_view(), name="student-profile"),
]
