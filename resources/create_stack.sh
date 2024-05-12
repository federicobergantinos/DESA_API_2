#!/bin/bash

# Nombre del stack (pasado como argumento)
STACK_NAME="$1"

# Región de AWS
AWS_REGION="us-east-1"  # Cambia esto por tu región

# Comando para crear el stack
CREATE_STACK_CMD="aws cloudformation create-stack --stack-name $STACK_NAME --template-body file://../resources/$1.yaml --capabilities CAPABILITY_IAM --region $AWS_REGION"

# Comando para eliminar el stack
DELETE_STACK_CMD="aws cloudformation delete-stack --stack-name $STACK_NAME --region $AWS_REGION"

# Función para verificar si el stack existe
stack_exists() {
    local stack_name="$1"
    local region="$2"
    aws cloudformation describe-stacks --stack-name "$stack_name" --region "$region" >/dev/null 2>&1
}

# Eliminar stack si existe
if stack_exists "$STACK_NAME" "$AWS_REGION"; then
    echo "Eliminando el stack existente: $STACK_NAME"
    $DELETE_STACK_CMD
    echo "Esperando a que se elimine el stack..."
    aws cloudformation wait stack-delete-complete --stack-name "$STACK_NAME" --region "$AWS_REGION"
    echo "El stack ha sido eliminado exitosamente."
fi

# Crear stack
echo "Creando el stack: $STACK_NAME"
$CREATE_STACK_CMD
echo "Esperando a que se complete la creación del stack..."
aws cloudformation wait stack-create-complete --stack-name "$STACK_NAME" --region "$AWS_REGION"
echo "El stack ha sido creado exitosamente."
