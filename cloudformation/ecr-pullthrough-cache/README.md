# ECR Pullthrough Cache - CloudFormation Template

This CloudFormation template creates an ECR pullthrough cache rule to integrate with Echo registry.

[![Launch Stack](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=echo-pull-through-cache&templateURL=https://echohq-cloudformation-stacks.s3.us-east-1.amazonaws.com/ecr-pullthrough-cache.yaml)

## Prerequisites

- Echo's AWS Account ID (provided by Echo team)
- AWS CLI configured with appropriate credentials
- IAM permissions to create CloudFormation stacks with CAPABILITY_NAMED_IAM

## Parameters

| Parameter | Description | Required | Default |
|-----------|-------------|----------|---------|
| `SourceRegistryAccountId` | Echo's AWS account ID (12 digits) | ✅ | - |
| `SourceRegistryRegion` | Echo's AWS region | ✅ | us-east-1 |
| `RepositoryNamePrefix` | Prefix for cached repository names | ❌ | echo |
| `CacheRuleName` | Name for the pullthrough cache rule | ❌ | echo-registry-cache |

## Quick Deploy

### Option 1: Deploy from S3 URL

```bash
aws cloudformation create-stack \
  --stack-name echo-registry-ecr-cache \
  --template-url https://echohq-cloudformation-stacks.s3.us-east-1.amazonaws.com/ecr-pullthrough-cache.yaml \
  --parameters ParameterKey=SourceRegistryAccountId,ParameterValue=ECHO_ACCOUNT_ID \
               ParameterKey=SourceRegistryRegion,ParameterValue=us-east-1 \
  --capabilities CAPABILITY_NAMED_IAM
```

### Option 2: Deploy from Local File

```bash
aws cloudformation create-stack \
  --stack-name echo-registry-ecr-cache \
  --template-body file://template.yaml \
  --parameters ParameterKey=SourceRegistryAccountId,ParameterValue=ECHO_ACCOUNT_ID \
               ParameterKey=SourceRegistryRegion,ParameterValue=us-east-1 \
  --capabilities CAPABILITY_NAMED_IAM
```

## Verify Deployment

```bash
# Check stack status
aws cloudformation describe-stacks \
  --stack-name echo-registry-ecr-cache \
  --query 'Stacks[0].Outputs'

# List cache rules
aws ecr describe-pullthrough-cache-rules
```

## Test the Integration

```bash
# Login to ECR
aws ecr get-login-password --region your-region | \
  docker login --username AWS --password-stdin \
  your-account.dkr.ecr.your-region.amazonaws.com

# Pull an image
docker pull your-account.dkr.ecr.your-region.amazonaws.com/echo/test-image:latest
```

## Stack Outputs

- **PullthroughCacheRuleArn**: ARN of the created cache rule
- **RepositoryPrefix**: The prefix used for cached repositories
- **UpstreamRegistryUrl**: Echo registry URL
- **AccessRoleArn**: ARN of the IAM role
- **UsageInstructions**: Example Docker commands

## Customization

### Using Custom Prefix

```bash
aws cloudformation create-stack \
  --stack-name echo-registry-ecr-cache \
  --template-body file://template.yaml \
  --parameters ParameterKey=SourceRegistryAccountId,ParameterValue=ECHO_ACCOUNT_ID \
               ParameterKey=RepositoryNamePrefix,ParameterValue=my-echo-cache \
  --capabilities CAPABILITY_NAMED_IAM
```

## Cleanup

To remove all resources:

```bash
aws cloudformation delete-stack --stack-name echo-registry-ecr-cache
```

## Troubleshooting

### Stack Creation Failed
- Check CloudFormation events: `aws cloudformation describe-stack-events --stack-name echo-registry-ecr-cache`
- Ensure you included `--capabilities CAPABILITY_NAMED_IAM`
- Verify parameter values are correct

### Cache Rule Already Exists
- Delete existing rule: `aws ecr delete-pullthrough-cache-rule --ecr-repository-prefix echo`
- Or use a different prefix

### Access Denied
- Verify your IAM permissions
- Check Echo's account ID is correct
- Review CloudTrail logs

## Support

For issues:
1. Check CloudFormation stack events
2. Review the [ECR Integration Guide](../../docs/integrations/ecr.md)
3. Contact Echo support with stack outputs and error messages 