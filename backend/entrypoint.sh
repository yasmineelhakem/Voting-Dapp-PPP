#!/bin/sh\n\
echo "Waiting for database..."
sleep 5\n\
echo "Setting up database..."
# Check if the database is already initialized
if [ ! -d "/app/migrations" ]; then
    echo "Database not initialized, running migrations..."
    flask db init
    flask db migrate
fi

flask db upgrade
echo "Starting application..."

flask run 