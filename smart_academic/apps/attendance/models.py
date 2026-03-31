"""Data models for the attendance module."""

from django.conf import settings
from django.db import models


class Subject(models.Model):
    """Subject table containing course and faculty mapping."""

    # name stores the full subject title (for example, Data Structures).
    name = models.CharField(max_length=150)
    # code stores a unique short identifier (for example, CS201).
    code = models.CharField(max_length=30, unique=True)
    # faculty is a foreign key to CustomUser and represents the teaching faculty.
    faculty = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="subjects_taught",
    )
    # department stores which department the subject belongs to.
    department = models.CharField(max_length=120)

    class Meta:
        """Default ordering for subjects."""

        ordering = ["department", "code", "name"]

    def __str__(self) -> str:
        """Return a readable subject label."""
        return f"{self.code} - {self.name}"


class Attendance(models.Model):
    """Attendance table storing one student's status per subject and date."""

    class Status(models.TextChoices):
        """Allowed attendance status values."""

        PRESENT = "present", "Present"
        ABSENT = "absent", "Absent"
        LATE = "late", "Late"

    # student is a foreign key to CustomUser and points to the attending student.
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="attendance_records",
    )
    # subject is a foreign key to Subject for which attendance is marked.
    subject = models.ForeignKey(
        "attendance.Subject",
        on_delete=models.CASCADE,
        related_name="attendance_records",
    )
    # date stores the specific class date for this attendance entry.
    date = models.DateField()
    # status stores attendance state: present, absent, or late.
    status = models.CharField(max_length=20, choices=Status.choices)
    # marked_by is a foreign key to CustomUser (faculty) who marked attendance.
    marked_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="marked_attendance_records",
    )
    # created_at stores when this row was created.
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        """Ordering and duplicate protection for attendance records."""

        ordering = ["-date", "-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["student", "subject", "date"],
                name="unique_attendance_per_student_subject_date",
            )
        ]

    def __str__(self) -> str:
        """Return a compact readable attendance summary."""
        return f"{self.student.username} - {self.subject.code} - {self.date} ({self.status})"

    @property
    def is_present(self) -> bool:
        """True when status should count as present for percentage calculations."""
        return self.status in {self.Status.PRESENT, self.Status.LATE}
