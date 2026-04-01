"""
Geometry engine for computing generic astronomical properties.
Calculates angles, radii, and basic structural components based on lat/lon.
"""

from dataclasses import dataclass
from typing import Dict, Any

from .meridian_service import MeridianService
from .registry import INSTRUMENT_REGISTRY

# Important to import these so that the decorators are executed
from . import samrat_yantra
from . import nadi_valaya_yantra
from . import bhitti_yantra

@dataclass
class GeometryResult:
    instrument: str
    latitude: float
    longitude: float
    angles: Dict[str, Any]
    dimensions: Dict[str, Any]
    orientation: Dict[str, Any]


class GeometryEngine:
    """
    Abstract geometric operations for instrument calculation.
    """
    
    @staticmethod
    def calculate_instrument_geometry(latitude: float, longitude: float, meridian: str, instrument: str) -> GeometryResult:
        """
        Main computing logic: normalizes coordinates, adjusts meridian, calls specific yantra calculators, 
        and returns a structured GeometryResult.
        """
        try:
            lat = float(latitude)
            lon = float(longitude)
        except (TypeError, ValueError):
            raise ValueError("Latitude and longitude must be numeric attributes.")
            
        if not -90.0 <= lat <= 90.0:
            raise ValueError("Latitude bounds exceeded. Must be between -90 and 90.")
            
        if not -180.0 <= lon <= 180.0:
            raise ValueError("Longitude bounds exceeded. Must be between -180 and 180.")
            
        adjusted_lon = MeridianService.adjust_longitude(lon, meridian)
        
        instrument_key = str(instrument).strip().lower()
        lookup_key = instrument_key.replace("_yantra", "")
        radius = 100.0 # Baseline radius for mathematical scaling
        
        if lookup_key not in INSTRUMENT_REGISTRY:
            raise ValueError(f"Unknown instrument type: {instrument}")
            
        angles, orientation = INSTRUMENT_REGISTRY[lookup_key](latitude=lat, longitude=adjusted_lon, radius=radius)
            
        return GeometryResult(
            instrument=instrument_key,
            latitude=lat,
            longitude=adjusted_lon,
            angles=angles,
            dimensions={"base_radius": radius},
            orientation=orientation
        )

    @staticmethod
    def calculate_gnomon_angle(latitude):
        """
        Calculates the angle of the gnomon based on latitude.
        """
        return float(latitude)
