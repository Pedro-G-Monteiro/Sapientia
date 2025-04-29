#!/bin/sh
set -e

# Executa as migrações do Prisma
echo "Running database migrations..."
npx prisma migrate deploy

# Inicia a aplicação
echo "Starting the application..."
exec "$@"