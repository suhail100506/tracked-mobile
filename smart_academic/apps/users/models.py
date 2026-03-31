"""Data models for the users module."""

from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
	"""Custom authentication user model for role-based access control."""

	class Role(models.TextChoices):
		"""Supported platform roles."""

		ADMIN = "admin", "Admin"
		FACULTY = "faculty", "Faculty"
		STUDENT = "student", "Student"

	# Role controls authorization behavior across APIs and dashboards.
	role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)
	# Department stores the academic department (for example, CSE, ECE, MBA).
	department = models.CharField(max_length=120, blank=True)
	# Phone stores the user's contact number for profile and communication needs.
	phone = models.CharField(max_length=20, blank=True)
	# created_at stores the account creation timestamp.
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		"""Default ordering for user lists and admin views."""

		ordering = ["-created_at", "username"]

	def __str__(self) -> str:
		"""Readable representation of the user in admin/log output."""
		return f"{self.username} ({self.role})"

	@property
	def full_name(self) -> str:
		"""Return first+last name when available, otherwise username."""
		combined = f"{self.first_name} {self.last_name}".strip()
		return combined or self.username

	@property
	def is_admin_role(self) -> bool:
		"""True when the platform role is admin."""
		return self.role == self.Role.ADMIN

	@property
	def is_faculty(self) -> bool:
		"""True when the platform role is faculty."""
		return self.role == self.Role.FACULTY

	@property
	def is_student(self) -> bool:
		"""True when the platform role is student."""
		return self.role == self.Role.STUDENT
