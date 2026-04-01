from django import forms

class InstrumentCalculationForm(forms.Form):
    INSTRUMENT_CHOICES = [
        ('samrat_yantra', 'Samrat Yantra'),
        ('nadi_valaya_yantra', 'Nadi Valaya Yantra'),
        ('bhitti_yantra', 'Bhitti Yantra'),
    ]
    
    MERIDIAN_CHOICES = [
        ('ujjain', 'Ujjain'),
        ('greenwich', 'Greenwich'),
    ]
    
    latitude = forms.FloatField(required=True, min_value=-90.0, max_value=90.0)
    longitude = forms.FloatField(required=True, min_value=-180.0, max_value=180.0)
    instrument = forms.ChoiceField(choices=INSTRUMENT_CHOICES, required=True)
    meridian = forms.ChoiceField(choices=MERIDIAN_CHOICES, required=True)
