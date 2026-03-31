"""
Custom permission classes used across all application modules.

These classes enforce role-based access control for Admin, Faculty, and Student
users while keeping view-level permission declarations readable.
"""
from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    """Allows access only to authenticated users with the admin role."""

    def has_permission(self, request, view) -> bool:
        return bool(request.user and request.user.is_authenticated and request.user.role == "admin")


class IsFacultyRole(BasePermission):
    """Allows access only to authenticated users with the faculty role."""

    def has_permission(self, request, view) -> bool:
        return bool(request.user and request.user.is_authenticated and request.user.role == "faculty")


class IsStudentRole(BasePermission):
    """Allows access only to authenticated users with the student role."""

    def has_permission(self, request, view) -> bool:
        return bool(request.user and request.user.is_authenticated and request.user.role == "student")


class IsAdminOrFacultyRole(BasePermission):
    """Allows access to authenticated users with admin or faculty role."""

    def has_permission(self, request, view) -> bool:
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in {"admin", "faculty"}


class IsKnownAcademicRole(BasePermission):
    """Allows access to authenticated users with any supported role."""

    def has_permission(self, request, view) -> bool:
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in {"admin", "faculty", "student"}


class IsAdminOrSelf(BasePermission):
    """Allows object-level access to admins or the user owning the object."""

    def has_object_permission(self, request, view, obj) -> bool:
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role == "admin" or obj.id == request.user.id


class IsAdminFacultyOrSelfStudent(BasePermission):
    """Allows admins, faculty, or a student accessing their own resource."""

    def has_permission(self, request, view) -> bool:
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj) -> bool:
        if request.user.role in {"admin", "faculty"}:
            return True
        return request.user.role == "student" and obj.id == request.user.id
