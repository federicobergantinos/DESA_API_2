# Nombre de la imagen
CONTAINER_NAME=wallet-serving
IMAGE_NAME=wallet-image

# Docker
docker-build:
	docker build -t $(IMAGE_NAME) ../backend/

docker-run-backend:
	docker run --env-file .env --name $(CONTAINER_NAME) -it --rm -p 8080:8080 $(IMAGE_NAME)

docker-run-ddbb:
	docker run --name daidb -e POSTGRES_PASSWORD=base1234 -e POSTGRES_DB=daidb -p 5432:5432 -d postgres

docker-run:
	docker-compose up --build

docker-ngrok:
	docker run -it -e NGROK_AUTHTOKEN=${NGROK_AUTHTOKEN} ngrok/ngrok:latest http 192.168.1.112:8080


.PHONY: docker-run-ddbb docker-run-backend docker-build docker-run
