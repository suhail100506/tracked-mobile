"""Data models for the activities module."""

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


class Activity(models.Model):
	"""Activity table for student extracurricular and academic achievements."""

	class ActivityType(models.TextChoices):
		"""Allowed activity categories."""

		WORKSHOP = "workshop", "Workshop"
		INTERNSHIP = "internship", "Internship"
		SPORTS = "sports", "Sports"
		CERTIFICATION = "certification", "Certification"
		OTHER = "other", "Other"

	class Status(models.TextChoices):
		"""Approval workflow statuses for activities."""

		PENDING = "pending", "Pending"
		APPROVED = "approved", "Approved"
		REJECTED = "rejected", "Rejected"

	# student is a foreign key to CustomUser representing the activity owner.
	student = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="activities",
	)
	# activity_type stores category: workshop, internship, sports, certification, or other.
	activity_type = models.CharField(max_length=30, choices=ActivityType.choices)
	# title stores a concise activity name.
	title = models.CharField(max_length=200)
	# description stores detailed information about the activity.
	description = models.TextField()
	# date_of_activity stores when the activity occurred.
	date_of_activity = models.DateField()
	# points stores score/credit assigned for this activity.
	points = models.IntegerField(default=0)
	# status stores the approval state: pending, approved, or rejected.
	status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
	# approved_by is a nullable foreign key to CustomUser who reviewed the activity.
	approved_by = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.SET_NULL,
		related_name="approved_activities",
		null=True,
		blank=True,
	)
	# certificate stores optional proof document uploaded by student.
	certificate = models.FileField(upload_to="activity_certificates/", null=True, blank=True)
	# created_at stores when this activity row was created.
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		"""Default ordering for activity feeds and review queues."""

		ordering = ["-created_at"]

	def __str__(self) -> str:
		"""Return readable summary for admin/API debugging output."""
		return f"{self.student.username} - {self.title} ({self.status})"

	def clean(self) -> None:
		"""Ensure approved activities include a reviewer."""
		if self.status == self.Status.APPROVED and not self.approved_by:
			raise ValidationError("approved_by is required when status is approved.")

	@property
	def is_approved(self) -> bool:
		"""True when activity has approval status."""
		return self.status == self.Status.APPROVED

	@property
	def is_pending(self) -> bool:
		"""True when activity is waiting for review."""
		return self.status == self.Status.PENDING
