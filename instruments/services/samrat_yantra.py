"""
Service for calculating geometry specific to the Samrat Yantra (Equinoctial Sundial).
"""
import math
from dataclasses import dataclass
from .registry import register_instrument

@dataclass
class SamratYantraGeometry:
    gnomon_angle: float
    gnomon_base: float
    gnomon_height: float
    hypotenuse_angle: float


class SamratYantraCalculator:
    """
    Calculates the dimensions for the Samrat Yantra.
    
    Astronomical Principle:
    The Samrat Yantra is basically a colossal sundial. Its main component is a giant right-angled 
    triangular gnomon (the wall that casts the shadow) aligned perfectly along the local meridian. 
    The hypotenuse of this triangle points exactly toward the celestial pole (Pole Star). 
    Because of this, the angle the hypotenuse makes with the base (ground) is equal to 
    the latitude of the location.
    """
    
    def __init__(self, latitude, radius=None):
        self.latitude = float(latitude)
        # We don't necessarily use the passed radius if we rely on the 10m default height
        self.height = 10.0 # Default 10 meters

    def calculate(self):
        """
        Calculates the fundamental dimensions of the gnomon.
        
        Rules:
        hypotenuse_angle = latitude
        base = height / tan(latitude)
        """
        # Convert latitude from degrees to radians for math functions
        lat_rad = math.radians(self.latitude)
        
        # Guard against division by zero at the equator (lat=0)
        # At equator, the gnomon base would theoretically be infinite
        if self.latitude == 0.0:
            base = None
        else:
            base = self.height / math.tan(lat_rad)
            
        return SamratYantraGeometry(
            gnomon_angle=self.latitude,
            gnomon_base=abs(base) if base is not None else None,  # Handle negative latitudes gracefully
            gnomon_height=self.height,
            hypotenuse_angle=self.latitude
        )

@register_instrument('samrat_yantra')
def calculate(latitude, longitude=0.0, radius=100.0):
    """
    Module level convenience calculator for the registry.
    Returns (angles_dict, orientation_dict).
    """
    calc = SamratYantraCalculator(latitude, radius=radius)
    angles = calc.calculate().__dict__
    orientation = {"axis": "celestial_pole", "faces": "equatorial"}
    return angles, orientation
