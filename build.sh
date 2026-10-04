#!/usr/bin/env bash
# build.sh — Render build script
# Render calls this automatically before starting the web service.
set -o errexit  # Exit on any error

pip install --upgrade pip
pip install -r requirements.txt

# Collect all static files into staticfiles/ (served by WhiteNoise)
python manage.py collectstatic --no-input

# Run database migrations
python manage.py migrate
