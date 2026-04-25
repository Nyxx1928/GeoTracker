#!/bin/bash
set -e

echo "==> Running Laravel startup tasks..."

if [ ! -f .env ] && [ -f .env.example ]; then
	cp .env.example .env
fi

php artisan key:generate --force --no-interaction || true

# Ensure Apache loads only one MPM; some base images re-enable event by default
if command -v a2dismod >/dev/null 2>&1; then
	a2dismod mpm_event >/dev/null 2>&1 || true
	a2dismod mpm_worker >/dev/null 2>&1 || true
	a2enmod mpm_prefork >/dev/null 2>&1 || true
fi

# Clear any stale cached config baked into the image, then rebuild from env
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Run database migrations automatically with retries while DB becomes ready
ATTEMPTS=20
for i in $(seq 1 $ATTEMPTS); do
	if php artisan migrate --force; then
		break
	fi
	echo "Migration attempt ${i}/${ATTEMPTS} failed, retrying in 3s..."
	sleep 3
	if [ "$i" -eq "$ATTEMPTS" ]; then
		echo "Migrations failed after ${ATTEMPTS} attempts"
		exit 1
	fi
done

# Seed the database (idempotent)
php artisan db:seed --force || true

echo "==> Starting Apache..."
exec apache2-foreground
