"""
WSGI config for Smart Academic Activity & Attendance Analytics System.

This module exposes the WSGI callable used by production web servers.
"""
import os

from django.core.wsgi import get_wsgi_application

# Set default settings module for WSGI runtime.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "smart_academic.settings")

# Application callable used by WSGI servers.
application = get_wsgi_application()
