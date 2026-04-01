from django.urls import path
from . import views
from .api import calculate_views

app_name = 'instruments'

urlpatterns = [
    path('', views.home_page, name='home'),
    path('calculate/', views.instrument_calculation_view, name='calculate'),
    path('api/calculate/', calculate_views.api_calculate_view, name='api_calculate'),
    path('api/search/', views.search_location_proxy_view, name='search_location'),
    path('about/', views.about_page, name='about'),
    path('register/', views.register_view, name='register'),
]
