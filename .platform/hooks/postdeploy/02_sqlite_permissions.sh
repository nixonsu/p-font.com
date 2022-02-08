#This script enables read/write permissions for dbsqlite3 used by Django
#!/bin/bash

cd /var/app/current

sudo chmod a+w db.sqlite3
