"""
Service for calculating geometry specific to the Bhitti Yantra (Mural Instrument).
"""
from dataclasses import dataclass
from .registry import register_instrument

@dataclass
class BhittiYantraGeometry:
    plane: str
    arc: str
    arc_radius: float


class BhittiYantraCalculator:
    """
    Calculates the dimensions for the Bhitti Yantra.
    
    Astronomical Principle:
    The Bhitti Yantra is a transit instrument built on a vertical wall aligned exactly 
    in the North-South meridian plane. It features a semicircular graduated arc or quadrants. 
    It is used to measure the zenith distance and altitude of celestial bodies as they 
    transit the local meridian.
    """
    
    def __init__(self, latitude, radius=None):
        self.latitude = float(latitude)
        self.radius = 5.0 # We default to a reasonable scale, e.g., 5m

    def calculate(self):
        """
        Returns parameters for the transit scale.
        
        Rules:
        vertical plane instrument
        semicircular arc aligned north-south
        arc radius configurable
        """
        return BhittiYantraGeometry(
            plane="vertical",
            arc="semicircular north-south",
            arc_radius=self.radius
        )

@register_instrument('bhitti_yantra')
def calculate(latitude, longitude=0.0, radius=100.0):
    """
    Module level convenience calculator for the registry.
    Returns (angles_dict, orientation_dict).
    """
    calc = BhittiYantraCalculator(latitude, radius=radius)
    angles = calc.calculate().__dict__
    orientation = {"plane": "local_meridian"}
    return angles, orientation
