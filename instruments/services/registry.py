"""
Registry for astronomical instrument calculators.
Allows instrument calculators to automatically register themselves.
"""

from typing import Callable, Any

INSTRUMENT_REGISTRY = {}

def register_instrument(name: str):
    """
    Decorator to register a calculation function for an instrument.
    Usage:
        @register_instrument('samrat_yantra')
        def calculate(...):
            ...
    """
    def decorator(func: Callable) -> Callable:
        # Strip the suffix for standard registry naming consistency
        clean_name = name.replace('_yantra', '')
        INSTRUMENT_REGISTRY[clean_name] = func
        return func
    return decorator
