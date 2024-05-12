# Nombre de la imagen
PROJECT=wallet-serving
IMAGE_NAME=$(PROJECT)-image
CONTAINER_NAME=$(PROJECT)-container
AWS_ACCOUNT_ID=137318283310
AWS_REGION=us-east-1


# IAM ROles
assume-role:
	aws sts assume-role --role-arn "arn:aws:iam::137318283310:role/LabRole" --role-session-name AWSCLI-Session

# Docker
docker-build:
	docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(PROJECT):latest ../backend/ --push

docker-run:
	docker run --env-file ../backend/.env --name $(CONTAINER_NAME) -it --rm -p 8080:8080 $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(PROJECT):latest 

docker-pull:
	docker pull $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(PROJECT):latest

docker-run-wallet:
	make ecr-login && make docker-pull && make docker-run

docker-stop:
	docker stop $(CONTAINER_NAME)

docker-rm:
	docker rm $(CONTAINER_NAME)

docker-rmi:
	docker rmi $(IMAGE_NAME)
	
docker-compose-build-service:
	docker-compose -f ../backend/docker-compose.yml build $(PROJECT)

docker-compose-up:
	docker-compose -f ../backend/docker-compose.yml up -d

docker-compose-down:
	docker-compose -f ../backend/docker-compose.yml down

docker-clean: docker-stop docker-rm docker-rmi

docker-rebuild: docker-clean docker-build docker-run

docker-shell:
	docker exec -it $(CONTAINER_NAME) /bin/sh

# AWS ECR
ecr-create-repo:
	aws ecr create-repository --repository-name $(PROJECT) --region $(AWS_REGION)

ecr-login:
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com

ecr-tag-image: 
	docker tag $(IMAGE_NAME):latest $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(PROJECT):latest

ecr-delete-image:
	aws ecr batch-delete-image --repository-name $(PROJECT) --image-ids imageTag=latest --region $(AWS_REGION)

ecr-push-image:
	docker push $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(PROJECT):latest

ecr: 
	make docker-build && make ecr-login && make ecr-tag-image && make ecr-push-image

# AWS Cloudformation
cloudformation-create-stack-infra:
	bash create_stack.sh InfraBase

cloudformation-delete-stack-infra:
	aws cloudformation delete-stack --stack-name InfraBase --region $(AWS_REGION)
	
cloudformation-create-stack-service:
	bash create_stack.sh $(PROJECT)

cloudformation-delete-stack-service:
	aws cloudformation delete-stack --stack-name $(PROJECT) --region $(AWS_REGION)

cloudformation-create-stack-db:
	bash create_stack.sh $(PROJECT)-db
	
cloudformation-delete-stack-db:
	aws cloudformation delete-stack --stack-name $(PROJECT)-db --region $(AWS_REGION)

cloudformation-create-stack-ec2:
	bash create_stack.sh $(PROJECT)-ec2
	
cloudformation-delete-stack-ec2:
	aws cloudformation delete-stack --stack-name $(PROJECT)-ec2 --region $(AWS_REGION)
		

.PHONY: docker-build docker-run docker-stop docker-rm docker-rmi docker-clean docker-rebuild docker-shell docker-compose-up docker-compose-down docker-run-wallet
.PHONY: ecr-create-repo ecr-login ecr-tag-image ecr-push-image ecr 
.PHONY: cloudformation-create-stack cloudformation-delete-stack cloudformation-create-stack-service cloudformation-delete-stack-service cloudformation-create-stack-db cloudformation-delete-stack-db cloudformation-create-stack-ec2 cloudformation-delete-stack-ec2
.PHONY: assume-role
