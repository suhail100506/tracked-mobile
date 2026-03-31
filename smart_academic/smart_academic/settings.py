"""
Django settings for Smart Academic Activity & Attendance Analytics System.

This module centralizes runtime settings for:
- Installed applications and middleware
- MySQL database connectivity via environment variables
- JWT-based API authentication
- CORS policy for frontend integration
- Static file configuration
"""
from pathlib import Path
from datetime import timedelta

from decouple import config, Csv

# Base directory of the Django project (smart_academic/ root folder)
BASE_DIR = Path(__file__).resolve().parent.parent

# Security settings: never expose SECRET_KEY and disable DEBUG in production
SECRET_KEY = config("SECRET_KEY", default="django-insecure-change-this-secret-key")
DEBUG = config("DEBUG", default=True, cast=bool)
ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="127.0.0.1,localhost", cast=Csv())

# Core + third-party + local app registration
INSTALLED_APPS = [
    # Django core apps required for admin, auth, sessions, and static assets
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party apps providing API support, JWT auth, and CORS handling
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    # Project apps for business features
    "apps.users",
    "apps.attendance",
    "apps.marks",
    "apps.activities",
    "apps.analytics",
    "apps.reports",
]

# Middleware order matters: CORS middleware should be early for preflight handling
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# Root URL configuration file for project-wide routing
ROOT_URLCONF = "smart_academic.urls"

# Template settings kept minimal because frontend is currently static HTML pages
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# WSGI application entrypoint for deployment servers (Gunicorn/uWSGI/etc.)
WSGI_APPLICATION = "smart_academic.wsgi.application"

# MySQL database settings loaded from .env variables for portability and security
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": config("DB_NAME", default="smart_academic_db"),
        "USER": config("DB_USER", default="root"),
        "PASSWORD": config("DB_PASSWORD", default=""),
        "HOST": config("DB_HOST", default="127.0.0.1"),
        "PORT": config("DB_PORT", default="3306"),
        "OPTIONS": {
            # Ensure proper UTF-8 support for multilingual academic content
            "charset": "utf8mb4",
        },
    }
}

# Default password checks for baseline account security
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization defaults
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Static files served from /static/ URL and collected into the project static folder
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "static"

# Primary key strategy for Django models
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Use the project-specific custom user model for authentication and relations.
AUTH_USER_MODEL = "users.CustomUser"

# Django REST Framework global settings with JWT as the primary auth mechanism
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

# JWT token lifetimes and behavior configuration
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# CORS policy allows configured frontend origins to call API endpoints
CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS",
    default="http://127.0.0.1:5500,http://localhost:5500",
    cast=Csv(),
)

# Allow credentials if frontend uses cookies/sessions later in the roadmap
CORS_ALLOW_CREDENTIALS = True
