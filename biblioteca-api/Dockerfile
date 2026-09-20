# Usa a imagem oficial do PHP
FROM php:8.4-cli

# Instala as dependências necessárias do PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev unzip \
    && docker-php-ext-install pdo pdo_pgsql

# Define a pasta de trabalho dentro do contêiner
WORKDIR /app

# Comando padrão para iniciar o servidor do Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]