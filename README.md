# Instruments in Observational Astronomy: Digital Yantras

![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)

A comprehensive Django-based academic web platform dedicated to the digital reconstruction, calculation, and visualization of classical Indian astronomical instruments known as **Yantras**.

This project provides a unique interface for understanding traditional observational astronomy by simulating these historical instruments based on real global geographical coordinates.

---

## ✨ Features

- **Interactive Global Map Integration**: Powered by Leaflet and OpenStreetMap's Nominatim API, allowing user-friendly location searches and pinpoint accuracy anywhere in the world.
- **Precision Calculation Engine**: Accurate mathematical modeling tailored for specific Yantras, including:
  - **Samrat Yantra** (Equinoctial Sundial)
  - **Nadi Valaya Yantra** (Hemispherical Sundial)
  - **Bhitti Yantra** (Transit Instrument)
- **3D Renderings & Visualizations**: Real-time rendering of instrument geometry using Three.js, accurately customized to the requested latitude and longitude.
- **User Authentication & Session Management**: Secure user registration and login systems, complete with session persistence to save user map coordinates across page loads seamlessly.
- **Django Modular Architecture**: Built with scalability in mind, utilizing a registry pattern that separates computation logic from the UI rendering process.

---

## 🛠️ Technology Stack

- **Backend Framework**: Django 4.0+
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Frontend / UI**: HTML5, Vanilla CSS, JavaScript
- **Mapping**: Leaflet.js
- **3D Graphics**: Three.js

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- PostgreSQL (for production environments)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rohan00Paramanand/Instruments-in-Observational-Astronomy.git
   cd Instruments-in-Observational-Astronomy
   ```

2. **Create and activate a virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install the dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

5. **Start the development server**
   ```bash
   python manage.py runserver
   ```
   *The application will quickly be accessible at `http://127.0.0.1:8000/`.*

---

## ⚙️ Project Execution Flow

For those aiming to understand the underlying logic, here is the basic Request-Response lifecycle:
1. **User Interaction**: A given location and a specific Yantra are selected via the UI map. 
2. **Routing**: `instruments/urls.py` captures the request and ships it to the corresponding view.
3. **View Logic**: `calculate_views.py` processes the request, extracting coordinates.
4. **Service Engines**: The registry selects the appropriate calculation logic (e.g., `samrat_yantra.py`) in `instruments/services/` to generate mathematical data: angles and dimensions based solely on latitude and longitude parameters.
5. **Template Rendering**: The processed contexts are sent back to `instrument_result.html` where Three.js visually maps the calculated geometry on-screen.

---

## 🏗️ Adding a New Yantra

The mathematical computation engine is engineered using a dynamic registry pattern, ensuring clean separation of concerns without modifying core logic when scaling.

To add a new mathematical Yantra:
1. Create a new service calculator file in `instruments/services/` (e.g., `new_yantra.py`).
2. Implement a `calculate(latitude, longitude, radius)` function returning a tuple containing `(angles_dict, orientation_dict)`.
3. Import your module in `instruments/services/geometry_engine.py`.
4. Register your instrument in the `instrument_registry` dictionary, mapping a short key (like `'new_yantra'`) to your `calculate` module function.
5. Add the instrument entry to `INSTRUMENT_CHOICES` in `instruments/forms.py` and updating the frontend `<select>` dropdown inside `index.html`.
6. *(Optional)* Add mapping definitions to `instrument_viewer.js` to render specific 3D geometries.

---

## 🛡️ Production Deployment

For production environments, the project relies on `production.py` which requires an array of strict security contexts and database setups.

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

**Standard production workflow:**
```bash
python manage.py collectstatic --noinput
python manage.py migrate
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```
