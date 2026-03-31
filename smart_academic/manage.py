"""
Entry-point script for Django administrative commands.

This file allows developers to run project management commands such as:
- python manage.py runserver
- python manage.py makemigrations
- python manage.py migrate
"""
import os
import sys


def main() -> None:
    """Set the default Django settings module and execute management commands."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "smart_academic.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Django is not installed or not available in the current environment."
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
