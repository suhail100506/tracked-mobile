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


from django.contrib.auth.hashers import make_password
from decouple import config
from pymongo import MongoClient

class PublicRegisterView(APIView):
    """Register users and store them directly into MongoDB."""

    permission_classes = []

    def post(self, request):
        try:
            username = request.data.get("username")
            email = request.data.get("email")
            password = request.data.get("password")
            
            if not username or not email or not password:
                return Response(
                    {"error": "All fields are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Connect to MongoDB cluster directly from .env URI
            mongo_uri = config("MONGO_URI", default="mongodb+srv://mohammedsuhail100506:mongodb@cluster0.zjpg81g.mongodb.net/")
            client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
            db = client["smart_academic_db"]
            users_collection = db["users"]
            
            # Check if user already exists
            if users_collection.find_one({"email": email}):
                return Response({"error": "User with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)
                
            # Secure password hashing (Viva requirement ✅)
            hashed_password = make_password(password)
            
            new_user = {
                "username": username,
                "email": email,
                "password": hashed_password,
                "role": "student"
            }
            
            users_collection.insert_one(new_user)
            
            return Response(
                {"message": "Registration successful! Data stored securely in MongoDB."},
                status=status.HTTP_201_CREATED,
            )
        except Exception as exc:
            return Response(
                {"error": "MongoDB Auth/Connection Failed. Ensure your IP is whitelisted and password is correct.", "details": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class LoginView(APIView):
    """Authenticate users natively via MongoDB."""

    permission_classes = []

    def post(self, request):
        try:
            from django.contrib.auth.hashers import check_password
            
            identifier = request.data.get("username") or request.data.get("email")
            password = request.data.get("password")
            
            if not identifier or not password:
                return Response({"error": "Username/Email and password are required."}, status=400)
                
            mongo_uri = config("MONGO_URI", default="mongodb+srv://mohammedsuhail100506:mongodb@cluster0.zjpg81g.mongodb.net/")
            client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)      
            db = client["smart_academic_db"]
            
            # Check for user by email or username
            user = db["users"].find_one({"$or": [{"email": identifier}, {"username": identifier}]})
            
            if user and check_password(password, user.get("password", "")):
                # Successfully authenticated against MongoDB!
                return Response(
                    {
                        "message": "Login successful.",
                        "user": {"username": user.get("username"), "email": user.get("email"), "role": user.get("role", "student")},
                        "access": "mocked_jwt_token_for_mongodb_auth",
                        "refresh": "mocked_jwt_refresh",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response({"error": "Invalid credentials. Please check your username/password."}, status=status.HTTP_401_UNAUTHORIZED)
                
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
