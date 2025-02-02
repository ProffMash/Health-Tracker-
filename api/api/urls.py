from django.urls import path
from .views import RegisterView, LoginView, UserProfileView, HealthStatsView, WorkoutView, WorkoutDetailView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", UserProfileView.as_view(), name="profile"),
    path("health-stats/", HealthStatsView.as_view(), name="health-stats"),
    path("workouts/", WorkoutView.as_view(), name="workouts"),
    path("workouts/<int:pk>/", WorkoutDetailView.as_view(), name="workout-detail"),
]