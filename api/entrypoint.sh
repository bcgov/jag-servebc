#!/bin/sh
set -e

echo "Running database migrations..."
sequelize-cli db:migrate

echo "Starting application..."
exec node src/index.js
