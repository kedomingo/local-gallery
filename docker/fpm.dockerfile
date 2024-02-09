
  # We need the exact PHP version the web image is using because the composer.lock file specifies that
FROM php:8.1-fpm

RUN apt-get update \
    && apt-get install -y libpng-dev libfreetype6-dev libjpeg62-turbo-dev

RUN docker-php-ext-configure gd --with-freetype=/usr/include/ --with-jpeg=/usr/include/

RUN docker-php-ext-install -j$(nproc) gd


EXPOSE 8080