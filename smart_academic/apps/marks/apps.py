"""
Django application configuration for the marks module.
"""
from django.apps import AppConfig


class MarksConfig(AppConfig):
    """Registers the marks app and its metadata with Django."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.marks"
