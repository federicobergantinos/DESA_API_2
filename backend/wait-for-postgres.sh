#!/bin/sh

echo $POSTGRES_PASSWORD
echo $POSTGRES_HOST
echo $POSTGRES_USER
echo $POSTGRES_DB
echo $POSTGRES_PORT

until PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -p "$POSTGRES_PORT" -c '\q'; do
  echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "Postgres is up - executing command"
exec node index.js
