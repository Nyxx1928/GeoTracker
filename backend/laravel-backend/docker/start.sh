#!/bin/bash
set -e

echo "==> Running Laravel startup tasks..."

# Ensure Apache loads only one MPM; some base images re-enable event by default
if command -v a2dismod >/dev/null 2>&1; then
	a2dismod mpm_event >/dev/null 2>&1 || true
	a2dismod mpm_worker >/dev/null 2>&1 || true
	a2enmod mpm_prefork >/dev/null 2>&1 || true
fi

# Cache config, routes, and views for performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations automatically
php artisan migrate --force

echo "==> Starting Apache..."
exec apache2-foreground
