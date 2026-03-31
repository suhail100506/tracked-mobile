"""
Serializers for the marks module.

Contains serializers for marks upload and analytics-friendly read responses.
"""
from rest_framework import serializers

from .models import Marks


class MarksSerializer(serializers.ModelSerializer):
	"""Serializer exposing marks data and computed aggregate properties."""

	total_marks = serializers.DecimalField(max_digits=6, decimal_places=2, read_only=True)
	average_marks = serializers.DecimalField(max_digits=6, decimal_places=2, read_only=True)
	student_name = serializers.CharField(source="student.full_name", read_only=True)
	subject_code = serializers.CharField(source="subject.code", read_only=True)

	class Meta:
		model = Marks
		fields = "__all__"


class MarksUploadSerializer(serializers.ModelSerializer):
	"""Serializer used for faculty-driven marks create/update operations."""

	class Meta:
		model = Marks
		fields = (
			"student",
			"subject",
			"internal_marks",
			"assignment_marks",
			"lab_marks",
		)
