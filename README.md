# Digital Reconstruction of Classical Indian Astronomical Instruments

A Django-based academic web platform to calculate and visualize classical Indian astronomical instruments (Yantras) based on geographical coordinates.

## Features
- Interactive location selection (Leaflet)
- Calculation engines for Yantras (Samrat, Nadi Valaya, Bhitti)
- 3D visualizations (Three.js)

## Installation
1. Clone the repository and navigate into it.
2. Initialize virtual environment: `python -m venv venv`
3. Activate virtual environment.
4. Install dependencies: `pip install -r requirements.txt`

## Development Setup
By default, the project runs on the `development.py` settings using SQLite.
1. Run migrations: `python manage.py migrate`
2. Start the development server: `python manage.py runserver`
3. View at `http://127.0.0.1:8000/`

## Production Deployment
For production, the project switches to `production.py` which requires PostgreSQL, strict security contexts, and static file manifests.

**Required Environment Variables:**
- `DJANGO_SETTINGS_MODULE=config.settings.production`
- `SECRET_KEY=your_secret_key`
- `DEBUG=False`
- `ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com`
- `POSTGRES_DB=your_db_name`
- `POSTGRES_USER=your_db_user`
- `POSTGRES_PASSWORD=your_db_password`
- `POSTGRES_HOST=localhost`
- `POSTGRES_PORT=5432`

**Deployment Steps:**
1. Collect static files: `python manage.py collectstatic --noinput`
2. Run database migrations: `python manage.py migrate`
3. Serve the application using a WSGI server like Gunicorn:
   `gunicorn config.wsgi:application --bind 0.0.0.0:8000`

## Adding a New Yantra

The platform computation engine uses a dynamic registry pattern, ensuring clean separation of concerns without modifying core logic when scaling.

To add a new Yantra:
1. Create a new service calculator file in `instruments/services/` (e.g. `new_yantra.py`).
2. Implement a `calculate(latitude, longitude, radius)` function returning a tuple containing `(angles_dict, orientation_dict)`.
3. Import your module in `instruments/services/geometry_engine.py`.
4. Register your instrument in the `instrument_registry` dictionary, mapping a short key (without `_yantra`) to your `calculate` module function.
5. Add the instrument entry to `INSTRUMENT_CHOICES` in `instruments/forms.py` and the frontend `<select>` dropdown inside `index.html`. 
6. (Optional) Add frontend Three.js conditionals to `instrument_viewer.js` to define specific rendering geometry limits.
