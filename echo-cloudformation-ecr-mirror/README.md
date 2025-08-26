# Echo ECR Pull-Through Cache - CloudFormation Template

Purpose: Minimal ECR pull-through cache rule to integrate with the Echo registry.

## Quickstart

### AWS Console
[![Launch Stack](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/create/review?stackName=echo-ecr-integration&templateURL=https://raw.githubusercontent.com/buildecho/onboarding-providers/main/echo-cloudformation-ecr-mirror/template.yaml)

### AWS CLI
```bash
aws cloudformation deploy \
  --template-file template.yaml \
  --stack-name echo-ecr-integration \
  --parameter-overrides \
    EchoRegistryAccountId=123456789012 \
    EchoRegistryRegion=us-east-1 \
    CacheNamespacePrefix=echo \
  --capabilities CAPABILITY_NAMED_IAM
```

## Inputs
- `EchoRegistryAccountId` (required): AWS account ID of Echo registry (12 digits)
- `EchoRegistryRegion` (default: `us-east-1`): AWS region of Echo registry
- `CacheNamespacePrefix` (default: `echo`): Prefix for cached repositories
- `IAMRoleName` (default: `echo-mirror-role`): Name of IAM role used by the cache
- `IAMPolicyName` (default: `echo-mirror-policy`): Name of IAM policy for the role
- `ResourceNameSuffix` (optional): Suffix appended to resource names

## Outputs
- `AccessRoleArn`: ARN of the ECR access role
- `UsageInstruction`: Single-line docker pull command template

## Verify
```bash
aws cloudformation describe-stacks \
  --stack-name echo-ecr-integration \
  --query 'Stacks[0].Outputs[?OutputKey==`UsageInstruction`].OutputValue' \
  --output text
```

## Example usage
```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region)

# Login to ECR
aws ecr get-login-password --region "$REGION" | \
  docker login --username AWS --password-stdin \
  "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

# Pull via mirror (replace <image>:<tag>)
docker pull "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/echo/<image>:<tag>"
```

## Cleanup
```bash
aws cloudformation delete-stack --stack-name echo-ecr-integration
aws cloudformation wait stack-delete-complete --stack-name echo-ecr-integration
```
