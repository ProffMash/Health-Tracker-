from rest_framework import serializers
from .models import User, HealthStats, Workout

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'height', 'weight', 'age', 'gender']

# class HealthStatsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = HealthStats
#         fields = '__all__'

# class WorkoutSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Workout
#         fields = '__all__'
class HealthStatsSerializer(serializers.ModelSerializer):
    user = UserSerializer()  #nest user data here
    class Meta:
        model = HealthStats
        fields = ['user', 'steps', 'calories', 'water', 'sleep']

class WorkoutSerializer(serializers.ModelSerializer):
    user = UserSerializer()  #nest user data here as well
    class Meta:
        model = Workout
        fields = ['user', 'type', 'duration', 'intensity', 'notes', 'date']

