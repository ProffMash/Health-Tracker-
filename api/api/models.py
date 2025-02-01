from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    height = models.CharField(max_length=10, blank=True, null=True)
    weight = models.CharField(max_length=10, blank=True, null=True)
    age = models.CharField(max_length=5, blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)

    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',  # Prevents clash with default reverse accessor
        blank=True,
        help_text='The groups this user belongs to.',
        related_query_name='user'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions_set',  # Prevents clash with default reverse accessor
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='user'
    )

class HealthStats(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    steps = models.IntegerField(default=0)
    calories = models.IntegerField(default=0)
    water = models.IntegerField(default=0)
    sleep = models.IntegerField(default=0)

class Workout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="workouts")
    type = models.CharField(max_length=50)
    duration = models.CharField(max_length=20)
    intensity = models.CharField(max_length=20)
    notes = models.TextField(blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)
