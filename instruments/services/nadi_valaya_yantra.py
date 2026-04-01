"""
Service for calculating geometry specific to the Nadi Valaya Yantra (Equatorial Dial).
"""
from dataclasses import dataclass
from .registry import register_instrument

@dataclass
class NadiValayaYantraGeometry:
    dial_tilt: float
    radius: float


class NadiValayaYantraCalculator:
    """
    Calculates the dimensions for the Nadi Valaya Yantra.
    
    Astronomical Principle:
    The Nadi Valaya Yantra consists of twin dials facing exactly North and South. 
    The plane of the dials is parallel to the Earth's equator. 
    Therefore, the tilt (or angle) of this equatorial plane from the vertical 
    is equal to 90 degrees minus the latitude of the location.
    """
    
    def __init__(self, latitude, radius=None):
        self.latitude = float(latitude)
        self.radius = 5.0 # Default 5 meters

    def calculate(self):
        """
        Calculates the fundamental dimensions of the equatorial dials.
        
        Rules:
        dial tilt = 90 - latitude
        radius default = 5m
        """
        tilt = 90.0 - self.latitude
            
        return NadiValayaYantraGeometry(
            dial_tilt=tilt,
            radius=self.radius
        )

@register_instrument('nadi_valaya_yantra')
def calculate(latitude, longitude=0.0, radius=100.0):
    """
    Module level convenience calculator for the registry.
    Returns (angles_dict, orientation_dict).
    """
    calc = NadiValayaYantraCalculator(latitude, radius=radius)
    angles = calc.calculate().__dict__
    orientation = {"faces": ["north", "south"], "plane": "equatorial"}
    return angles, orientation
