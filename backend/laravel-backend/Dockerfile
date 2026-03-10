FROM php:8.4-apache

RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git libonig-dev libpng-dev libpq-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip bcmath gd

# Install composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy app and install deps
COPY . /var/www/html
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80
CMD ["apache2-foreground"]
