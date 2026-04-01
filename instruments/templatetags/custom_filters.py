from django import template

register = template.Library()

@register.filter
def replace_underscore(value):
    if isinstance(value, str):
        return value.replace('_', ' ')
    elif isinstance(value, (list, tuple)):
        return ", ".join(str(v).replace('_', ' ') for v in value)
    return value
