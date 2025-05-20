#!/bin/sh

echo "Waiting for the database to be available..."
until pg_isready -h auth-db -p 5432 -U "$AUTH_DB_USER"; do
  echo "Database is not ready yet. Retrying in 1 second..."
  sleep 1
done

echo "Applying dev migrations..."
npx prisma migrate dev --skip-seed || {
  echo "Migration failed. Exiting..."
  exit 1
}

echo "Starting development server..."
exec npm run dev
