"""
DRF-style or custom API views to perform calculations and return JSON.
"""

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from ..services.geometry_engine import GeometryEngine
from ..forms import InstrumentCalculationForm

@csrf_exempt
@require_POST
def api_calculate_view(request):
    """
    API endpoint for instrument calculation.
    Expects JSON payload with latitude, longitude, instrument, and meridian.
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)
        
    form = InstrumentCalculationForm(data)
    if form.is_valid():
        try:
            result = GeometryEngine.calculate_instrument_geometry(
                latitude=form.cleaned_data['latitude'],
                longitude=form.cleaned_data['longitude'],
                meridian=form.cleaned_data['meridian'],
                instrument=form.cleaned_data['instrument']
            )
            return JsonResponse({
                "status": "success", 
                "data": result.__dict__
            })
        except ValueError as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    else:
        return JsonResponse({"status": "error", "errors": form.errors}, status=400)
