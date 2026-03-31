"""
Serializers for the activities module.

Includes serializers for student submissions and approval workflows.
"""
from rest_framework import serializers

from .models import Activity


class ActivitySerializer(serializers.ModelSerializer):
	"""Primary serializer for activity read/write operations."""

	student_name = serializers.CharField(source="student.full_name", read_only=True)
	approved_by_name = serializers.CharField(source="approved_by.full_name", read_only=True)

	class Meta:
		model = Activity
		fields = "__all__"
		read_only_fields = ("id", "student", "approved_by", "created_at")


class ActivityApprovalSerializer(serializers.ModelSerializer):
	"""Serializer used by admin/faculty users to approve or reject activities."""

	class Meta:
		model = Activity
		fields = ("status", "points")
