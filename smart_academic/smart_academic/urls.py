"""
Root URL configuration for Smart Academic Activity & Attendance Analytics System.

This file wires all app-level routes and exposes JWT token endpoints.
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Django admin panel for superuser administration tasks
    path("admin/", admin.site.urls),
    # JWT endpoints for login and token refresh flows
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # Application endpoints grouped by domain module
    path("api/users/", include("apps.users.urls")),
    path("api/attendance/", include("apps.attendance.urls")),
    path("api/marks/", include("apps.marks.urls")),
    path("api/activities/", include("apps.activities.urls")),
    path("api/analytics/", include("apps.analytics.urls")),
    path("api/reports/", include("apps.reports.urls")),
]
