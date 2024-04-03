#!/bin/bash

echo "Iniciando la lectura del archivo .env.local..."

# Lee cada línea del archivo .env.local
while IFS='=' read -r key value
do
  # Omite líneas vacías y comentarios
  [[ -z "$key" || "$key" =~ ^# ]] && continue
  # Exporta la variable de entorno
  echo "Exportando: $key=$value"
  export "$key=$value"
done < .env.local
