from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import HealthStats, Workout
from .serializers import UserSerializer, HealthStatsSerializer, WorkoutSerializer

from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()

# class RegisterView(APIView):
#     def post(self, request):
#         data = request.data
#         user = User.objects.create_user(
#             username=data["username"],
#             email=data["email"],
#             password=data["password"],
#         )
#         return Response(UserSerializer(user).data)
class RegisterView(APIView):
    def post(self, request):
        data = request.data
        if User.objects.filter(email=data["email"]).exists():
            raise ValidationError({"error": "Email is already registered."})
        user = User.objects.create_user(
            username=data["username"],
            email=data["email"],
            password=data["password"],
        )
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

# class LoginView(APIView):
#     def post(self, request):
#         user = User.objects.get(email=request.data["email"])
#         if not user.check_password(request.data["password"]):
#             return Response({"error": "Invalid credentials"}, status=400)
#         refresh = RefreshToken.for_user(user)
#         return Response({
#             "access": str(refresh.access_token),
#             "refresh": str(refresh),
#             "user": UserSerializer(user).data,
#         })
class LoginView(APIView):
    def post(self, request):
        try:
            user = User.objects.get(email=request.data["email"])
        except User.DoesNotExist:
            raise AuthenticationFailed("Invalid credentials")
        
        if not user.check_password(request.data["password"]):
            raise AuthenticationFailed("Invalid credentials")
        
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data,
        })

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

# class HealthStatsView(generics.RetrieveUpdateAPIView):
#     queryset = HealthStats.objects.all()
#     serializer_class = HealthStatsSerializer
#     permission_classes = [IsAuthenticated]
class HealthStatsView(generics.RetrieveUpdateAPIView):
    queryset = HealthStats.objects.all()
    serializer_class = HealthStatsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return HealthStats.objects.get(user=self.request.user)

# class WorkoutView(generics.ListCreateAPIView):
#     serializer_class = WorkoutSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Workout.objects.filter(user=self.request.user)
class WorkoutView(generics.ListCreateAPIView):
    serializer_class = WorkoutSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Workout.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WorkoutDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WorkoutSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Workout.objects.filter(user=self.request.user)
