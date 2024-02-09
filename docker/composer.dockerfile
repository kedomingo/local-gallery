
  # We need the exact PHP version the web image is using because the composer.lock file specifies that
FROM php:8.1-fpm

RUN apt-get update && apt-get install -y \
        libzip-dev \
        zip \
  && docker-php-ext-install zip

WORKDIR /app

RUN curl -sS https://getcomposer.org/installer | php -- \
--install-dir=/app --filename=composer.phar