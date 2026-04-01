"""
Meridian service for handling offset calculations.
Supports switching between Ujjain and Greenwich prime meridians.
"""

class MeridianService:
    """
    Handles longitude conversions and time offsets based on selected prime meridian.
    """
    
    @staticmethod
    def adjust_longitude(longitude: float, meridian: str) -> float:
        """
        Adjusts longitude based on the prime meridian.
        Ujjain meridian subtracts 75.78, Greenwich remains unchanged.
        """
        if not isinstance(longitude, (int, float)):
            try:
                longitude = float(longitude)
            except (TypeError, ValueError):
                raise ValueError("Longitude must be a valid number.")
                
        meridian = str(meridian).strip().lower()
        
        if meridian == "ujjain":
            return longitude - 75.78
        elif meridian == "greenwich":
            return longitude
        else:
            raise ValueError("Invalid meridian. Must be 'ujjain' or 'greenwich'.")
