"""
Django application configuration for the attendance module.
"""
from django.apps import AppConfig


class AttendanceConfig(AppConfig):
    """Registers the attendance app and its metadata with Django."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.attendance"
