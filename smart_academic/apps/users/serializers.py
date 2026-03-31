"""
Serializers for the users module.

This file contains serializers for user listing, creation, and login payload
validation used by authentication and user-management APIs.
"""
from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
	"""Full serializer exposing all CustomUser model fields."""

	class Meta:
		model = CustomUser
		fields = "__all__"
		read_only_fields = ("id", "created_at", "last_login", "date_joined")
		extra_kwargs = {
			"password": {"write_only": True},
		}


class UserCreateSerializer(serializers.ModelSerializer):
	"""Serializer dedicated to user creation with secure password hashing."""

	password = serializers.CharField(write_only=True, min_length=8)

	class Meta:
		model = CustomUser
		fields = (
			"id",
			"username",
			"email",
			"first_name",
			"last_name",
			"password",
			"role",
			"department",
			"phone",
			"is_active",
			"created_at",
		)
		read_only_fields = ("id", "created_at")

	def create(self, validated_data):
		"""Create users with set_password to store a hashed password."""
		raw_password = validated_data.pop("password")
		user = CustomUser(**validated_data)
		user.set_password(raw_password)
		user.save()
		return user


class LoginSerializer(serializers.Serializer):
	"""Validates credentials used by the custom login endpoint."""

	username = serializers.CharField(required=True)
	password = serializers.CharField(required=True, write_only=True)

	def validate(self, attrs):
		"""Authenticate username/password before token generation."""
		user = authenticate(username=attrs.get("username"), password=attrs.get("password"))
		if not user:
			raise serializers.ValidationError("Invalid username or password.")
		if not user.is_active:
			raise serializers.ValidationError("User account is disabled.")
		attrs["user"] = user
		return attrs
