"""
Serializers for the attendance module.

This file defines serializers for attendance marking and read operations.
"""
from rest_framework import serializers

from .models import Attendance, Subject


class SubjectSerializer(serializers.ModelSerializer):
	"""Serializer for subject metadata displayed in attendance responses."""

	class Meta:
		model = Subject
		fields = "__all__"


class AttendanceSerializer(serializers.ModelSerializer):
	"""Serializer for attendance rows with read-only nested context fields."""

	student_name = serializers.CharField(source="student.full_name", read_only=True)
	subject_code = serializers.CharField(source="subject.code", read_only=True)

	class Meta:
		model = Attendance
		fields = "__all__"


class AttendanceRecordInputSerializer(serializers.Serializer):
	"""Input schema for each attendance record in bulk mark requests."""

	student = serializers.IntegerField(required=True)
	subject = serializers.IntegerField(required=True)
	date = serializers.DateField(required=True)
	status = serializers.ChoiceField(choices=Attendance.Status.choices, required=True)


class BulkAttendanceMarkSerializer(serializers.Serializer):
	"""Wrapper serializer for bulk attendance payloads."""

	records = AttendanceRecordInputSerializer(many=True, required=True)
