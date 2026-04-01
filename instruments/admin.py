"""
Admin configuration for the instruments app models.
"""

from django.contrib import admin
from .models import UserProfile

# Register your models here.
admin.site.register(UserProfile)