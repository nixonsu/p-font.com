#This script allows the Django app to make migrations and combine static files into a root static folder before deployment
#Without combining static files into a central folder, ElasticBeanstalk cannot determine the static files for each app
#!/bin/bash

source /var/app/venv/*/bin/activate
cd /var/app/staging

python manage.py makemigrations
python manage.py migrate
python manage.py createfirstsuperuser
python manage.py collectstatic --noinput
