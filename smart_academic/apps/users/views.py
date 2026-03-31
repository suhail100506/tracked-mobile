"""
API views for the users module.

This module provides authentication and role-aware user management endpoints.
"""
from rest_framework import status
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser
from .permissions import IsAdminRole, IsAdminOrSelf, IsStudentRole
from .serializers import LoginSerializer, UserCreateSerializer, UserSerializer


class LoginView(APIView):
    """Authenticate users and return JWT access/refresh tokens."""

    permission_classes = []

    def post(self, request):
        """Validate credentials and issue a fresh token pair."""
        try:
            serializer = LoginSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "Login successful.",
                    "user": UserSerializer(user).data,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_200_OK,
            )
        except Exception as exc:
            return Response(
                {"error": "Login failed.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class LogoutView(APIView):
    """Invalidate refresh token when blacklist support is enabled."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Best-effort logout endpoint compatible with JWT blacklist mode."""
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            token = RefreshToken(refresh_token)
            try:
                token.blacklist()
            except Exception:
                # Blacklisting is optional and may be disabled in current setup.
                pass

            return Response({"message": "Logout successful."}, status=status.HTTP_200_OK)
        except Exception as exc:
            return Response(
                {"error": "Logout failed.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class UserListView(ListAPIView):
    """List all users. Accessible only to admin users."""

    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]


class UserCreateView(CreateAPIView):
    """Create new users. Accessible only to admin users."""

    serializer_class = UserCreateSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]

    def create(self, request, *args, **kwargs):
        """Wrap create behavior with explicit error handling for API clients."""
        try:
            return super().create(request, *args, **kwargs)
        except Exception as exc:
            return Response(
                {"error": "User creation failed.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class UserDetailView(RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a user account by id."""

    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminOrSelf]

    def retrieve(self, request, *args, **kwargs):
        """Return user details with consistent exception handling."""
        try:
            return super().retrieve(request, *args, **kwargs)
        except Exception as exc:
            return Response(
                {"error": "Unable to retrieve user.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def update(self, request, *args, **kwargs):
        """Update user details while preserving error transparency."""
        try:
            return super().update(request, *args, **kwargs)
        except Exception as exc:
            return Response(
                {"error": "Unable to update user.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def destroy(self, request, *args, **kwargs):
        """Delete user account with explicit error payloads."""
        try:
            return super().destroy(request, *args, **kwargs)
        except Exception as exc:
            return Response(
                {"error": "Unable to delete user.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class StudentProfileView(APIView):
    """Return the currently authenticated student's profile details."""

    permission_classes = [IsAuthenticated, IsStudentRole]

    def get(self, request):
        """Fetch profile information for the logged-in student account."""
        try:
            serializer = UserSerializer(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as exc:
            return Response(
                {"error": "Unable to load student profile.", "details": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )
