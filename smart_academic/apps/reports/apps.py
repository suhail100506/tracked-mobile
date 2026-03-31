"""
Django application configuration for the reports module.
"""
from django.apps import AppConfig


class ReportsConfig(AppConfig):
    """Registers the reports app and its metadata with Django."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.reports"
