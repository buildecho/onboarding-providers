# Echo ECR Pull-Through Cache - Pulumi Component

Purpose: Minimal Pulumi component to set up AWS ECR pull-through cache for Echo.

## Install
```bash
pulumi package add github.com/buildecho/onboarding-providers/echo-pulumi-ecr-mirror
```

## Usage
```ts
import { EcrPullThroughCache } from "@buildecho/echo-pulumi-ecr-mirror";

const cache = new EcrPullThroughCache("echo-cache", {
  echoRegistryAccountId: "123456789012",
  echoRegistryRegion: "us-east-1", // default
  cacheNamespace: "echo",          // default
});

export const roleArn = cache.roleArn;
export const usage = cache.usageInstructions;
```

## Inputs
- `echoRegistryAccountId` (string, required)
- `echoRegistryRegion` (string, default: `us-east-1`)
- `cacheNamespace` (string, default: `echo`)
- `roleName` (string, default: `echo-ecr-mirror-role`)
- `policyName` (string, default: `echo-ecr-mirror-policy`)
- `tags` (Record<string, string>, optional)

## Outputs
- `roleArn`: ARN of the IAM role created for pull-through cache
- `cacheNamespace`: Cache namespace used
- `usageInstructions`: Usage instructions for pulling via the mirror

## Test
```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region)
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
docker pull "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/echo/<image>:<tag>"
```
