# production environment
FROM node:16

WORKDIR /app

# Instala psql
USER root
RUN apt-get update && apt-get install -y postgresql-client

# Copia del código fuente
COPY . .
RUN npm install

# Hacer el script ejecutable
RUN chmod +x wait-for-postgres.sh

# Asegúrate de que las variables de entorno se pasen correctamente
ARG CODE
ARG POSTGRES_DB
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_HOST
ARG AWS_S3_BUCKET_NAME
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_DEFAULT_REGION
ARG AWS_REGION

# Creación del archivo .env
RUN echo "CODE=${CODE}" >> .env \
 && echo "POSTGRES_DB=${POSTGRES_DB}" >> .env \
 && echo "POSTGRES_USER=${POSTGRES_USER}" >> .env \
 && echo "POSTGRES_PASSWORD=${POSTGRES_PASSWORD}" >> .env \
 && echo "AWS_S3_BUCKET_NAME=${AWS_S3_BUCKET_NAME}" >> .env \
 && echo "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" >> .env \
 && echo "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" >> .env \
 && echo "AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}" >> .env \
 && echo "AWS_REGION=${AWS_REGION}" >> .env

# Exponer el puerto
EXPOSE 8080

# Configurar el script como punto de entrada
ENTRYPOINT ["/app/wait-for-postgres.sh"]