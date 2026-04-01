from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.http import JsonResponse
import json
import urllib.request
import urllib.error
import urllib.parse
from .forms import InstrumentCalculationForm
from .services.geometry_engine import GeometryEngine
from .models import UserProfile

def home_page(request):
    initial = {}
    if request.user.is_authenticated:
        try:
            profile = request.user.userprofile
            if profile.last_latitude is not None:
                initial['latitude'] = profile.last_latitude
            if profile.last_longitude is not None:
                initial['longitude'] = profile.last_longitude
        except Exception:
            pass
            
    form = InstrumentCalculationForm(initial=initial)
    return render(request, 'index.html', {'form': form})

def instrument_calculation_view(request):
    form = InstrumentCalculationForm(request.GET or None)
    context = {'form': form, 'result': None, 'error': None}
    
    if form.is_valid():
        request.session['latitude'] = float(form.cleaned_data['latitude'])
        request.session['longitude'] = float(form.cleaned_data['longitude'])
        
        if request.user.is_authenticated:
            try:
                profile, _ = UserProfile.objects.get_or_create(user=request.user)
                profile.last_latitude = form.cleaned_data['latitude']
                profile.last_longitude = form.cleaned_data['longitude']
                profile.save()
            except Exception:
                pass
                
        try:
            result = GeometryEngine.calculate_instrument_geometry(
                latitude=form.cleaned_data['latitude'],
                longitude=form.cleaned_data['longitude'],
                meridian=form.cleaned_data['meridian'],
                instrument=form.cleaned_data['instrument']
            )
            context['result'] = result.__dict__
        except ValueError as e:
            context['error'] = str(e)
    
    return render(request, 'instrument_result.html', context)

def about_page(request):
    return render(request, 'about.html')

def register_view(request):
    if request.user.is_authenticated:
        return redirect('instruments:home')
    
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('instruments:home')
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})

def search_location_proxy_view(request):
    query = request.GET.get('q', '').strip()
    if not query:
        return JsonResponse({'status': 'error', 'message': 'No query provided'}, status=400)
        
    try:
        # Construct the Nominatim URL
        encoded_query = urllib.parse.quote(query)
        url = f"https://nominatim.openstreetmap.org/search?format=json&q={encoded_query}&limit=1"
        
        # Create a request with a User-Agent
        req = urllib.request.Request(
            url, 
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 AstronomyApp/1.0',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        )
        
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            return JsonResponse({'status': 'success', 'data': data})
            
    except urllib.error.URLError as e:
        return JsonResponse({'status': 'error', 'message': f'Search failed: {str(e)}'}, status=502)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': 'An unexpected error occurred'}, status=500)
