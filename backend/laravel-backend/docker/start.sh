#!/bin/bash
set -e

echo "==> Running Laravel startup tasks..."

# Cache config, routes, and views for performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations automatically
php artisan migrate --force

echo "==> Starting Apache..."
exec apache2-foreground
