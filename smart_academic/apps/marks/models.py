"""Data models for the marks module."""

from decimal import Decimal

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Marks(models.Model):
	"""Marks table storing one student's marks for one subject."""

	# student is a foreign key to CustomUser representing the evaluated student.
	student = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="marks_records",
	)
	# subject is a foreign key to Subject for which marks are stored.
	subject = models.ForeignKey(
		"attendance.Subject",
		on_delete=models.CASCADE,
		related_name="marks_records",
	)
	# internal_marks stores internal exam score with maximum allowed value 30.
	internal_marks = models.DecimalField(
		max_digits=5,
		decimal_places=2,
		validators=[MinValueValidator(0), MaxValueValidator(30)],
	)
	# assignment_marks stores assignment score with maximum allowed value 10.
	assignment_marks = models.DecimalField(
		max_digits=5,
		decimal_places=2,
		validators=[MinValueValidator(0), MaxValueValidator(10)],
	)
	# lab_marks stores lab score with maximum allowed value 10.
	lab_marks = models.DecimalField(
		max_digits=5,
		decimal_places=2,
		validators=[MinValueValidator(0), MaxValueValidator(10)],
	)
	# uploaded_by is a foreign key to CustomUser (faculty) who uploaded marks.
	uploaded_by = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="uploaded_marks_records",
	)
	# created_at stores the creation timestamp of this marks entry.
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		"""Default ordering and duplicate prevention for marks entries."""

		ordering = ["-created_at"]
		constraints = [
			models.UniqueConstraint(
				fields=["student", "subject"],
				name="unique_marks_per_student_subject",
			)
		]

	def __str__(self) -> str:
		"""Return a readable label used in admin and logs."""
		return f"{self.student.username} - {self.subject.code} ({self.total_marks}/50)"

	@property
	def total_marks(self) -> Decimal:
		"""Compute total marks out of 50 from all mark components."""
		return (
			(self.internal_marks or Decimal("0"))
			+ (self.assignment_marks or Decimal("0"))
			+ (self.lab_marks or Decimal("0"))
		)

	@property
	def average_marks(self) -> Decimal:
		"""Compute the average across internal, assignment, and lab components."""
		return (self.total_marks / Decimal("3")).quantize(Decimal("0.01"))

	@property
	def percentage(self) -> Decimal:
		"""Return percentage assuming total_marks is out of 50."""
		return ((self.total_marks / Decimal("50")) * Decimal("100")).quantize(Decimal("0.01"))
