"""
Django application configuration for the activities module.
"""
from django.apps import AppConfig


class ActivitiesConfig(AppConfig):
    """Registers the activities app and its metadata with Django."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.activities"
