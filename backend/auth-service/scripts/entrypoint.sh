#!/bin/sh

echo "Waiting for the database to be available..."
until npx prisma db wait; do
  echo "Database is not ready yet. Retrying in 1 second..."
  sleep 1
done

echo "Applying database migrations..."
npx prisma migrate deploy || {
  echo "Migration failed. Exiting."
  exit 1
}

echo "Migrations applied successfully."
exec "$@"
