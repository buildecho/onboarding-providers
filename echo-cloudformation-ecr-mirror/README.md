# Echo ECR Pull-Through Cache - CloudFormation Template

This CloudFormation template creates an ECR pull-through cache rule to integrate with Echo registry.

## 🚀 Quick Deploy

### AWS Console (One-Click Deploy)
[![Launch Stack](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/create/review?stackName=echo-ecr-integration&templateURL=https://raw.githubusercontent.com/buildecho/onboarding-providers/main/echo-cloudformation-ecr-mirror/template.yaml)

### AWS CLI
```bash
aws cloudformation deploy \
  --template-file template.yaml \
  --stack-name echo-ecr-integration \
  --parameter-overrides \
    SourceRegistryAccountId=123456789012 \
  --capabilities CAPABILITY_NAMED_IAM
```

## 📋 Prerequisites

- **Echo Registry Credentials**: Get the AWS Account ID from the Echo platform
- **AWS CLI**: Configured with appropriate credentials  
- **IAM Permissions**: To create CloudFormation stacks with CAPABILITY_NAMED_IAM

## 📥 Template Parameters

| Parameter | Description | Type | Default | Required |
|-----------|-------------|------|---------|----------|
| `SourceRegistryAccountId` | AWS account ID of Echo registry (12 digits) | `String` | - | ✅ |
| `SourceRegistryRegion` | AWS region of Echo registry | `String` | `"us-east-1"` | ❌ |
| `RepositoryNamePrefix` | Repository prefix for cached images | `String` | `"echo-mirror"` | ❌ |
| `CacheRuleName` | Name for the pullthrough cache rule | `String` | `"echo-mirror-cache-rule"` | ❌ |

## 📤 Stack Outputs

| Output | Description |
|--------|-------------|
| `RepositoryPrefix` | Repository prefix for cached images |
| `UpstreamRegistryUrl` | Echo registry URL |
| `AccessRoleArn` | ARN of the ECR access role |
| `CacheRuleName` | Name of the pullthrough cache rule |
| `UsageInstructions` | Detailed usage instructions with examples |

## ✅ Verify Deployment

```bash
# Check stack status
aws cloudformation describe-stacks \
  --stack-name echo-ecr-integration \
  --query 'Stacks[0].StackStatus'

# View usage instructions
aws cloudformation describe-stacks \
  --stack-name echo-ecr-integration \
  --query 'Stacks[0].Outputs[?OutputKey==`UsageInstructions`].OutputValue' \
  --output text
```

## 🧪 Test the Integration

```bash
# Get your account ID and region
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region)

# Login to ECR
aws ecr get-login-password --region $REGION | \
  docker login --username AWS --password-stdin \
  $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Pull an Echo image through your cache
docker pull $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/echo-mirror/nginx:latest
```

## 🧹 Cleanup

```bash
# Delete the stack
aws cloudformation delete-stack --stack-name echo-ecr-integration

# Wait for deletion to complete
aws cloudformation wait stack-delete-complete --stack-name echo-ecr-integration
```
