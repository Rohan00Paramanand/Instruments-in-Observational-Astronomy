"""
Utility to safely generate or template SVG strings if rendering server-side.
"""

class SVGGenerator:
    """
    Generates inline SVG given geometry parameters.
    """
    @staticmethod
    def generate(geometry_data):
        return "<svg></svg>"
