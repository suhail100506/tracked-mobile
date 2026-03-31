"""
Django application configuration for the users module.
"""
from django.apps import AppConfig


class UsersConfig(AppConfig):
    """Registers the users app and its metadata with Django."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.users"
