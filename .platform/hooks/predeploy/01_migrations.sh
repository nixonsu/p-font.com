#!/bin/bash

source /var/app/venv/*/bin/activate
cd /var/app/staging

sudo chmod a+w db.sqlite3
python manage.py makemigrations
python manage.py migrate
python manage.py createfirstsuperuser
python manage.py collectstatic --noinput
