#!/bin/bash

# Wait for the database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Run migrations
echo "Running database migrations..."
alembic upgrade head

# Seed the database
echo "Seeding the database..."
python -m app.db.seed_cli seed

# Start the FastAPI application
echo "Starting FastAPI application..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

echo "Database initialization complete!" 