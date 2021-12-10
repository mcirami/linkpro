FROM laravelphp/vapor:php80

RUN docker-php-ext-install exif

COPY . /var/task
