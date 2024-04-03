import boto3

def lambda_handler(event, context):
    cloudformation = boto3.client('cloudformation', region_name='us-east-1')

    if event['action'] == 'create':
        response = cloudformation.create_stack(
            StackName='wallet-serving',
            TemplateBody='s3://develop-e941e61a8157/service.yaml',
            Capabilities=['CAPABILITY_IAM'],
        )
    elif event['action'] == 'delete':
        response = cloudformation.delete_stack(
            StackName='wallet-serving',
        )
    
    return response
