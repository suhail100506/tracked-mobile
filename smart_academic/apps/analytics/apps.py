"""
Django application configuration for the analytics module.
"""
from django.apps import AppConfig


class AnalyticsConfig(AppConfig):
    """Registers the analytics app and its metadata with Django."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.analytics"
