# Echo ECR Pull-Through Cache - Pulumi Component

Purpose: Minimal Pulumi component to set up AWS ECR pull-through cache for Echo.

## Install
```bash
pulumi package add github.com/buildecho/onboarding-providers/echo-pulumi-ecr-mirror@main
```

## Usage
```ts
import { EcrPullThroughCache } from "@echo/pulumi-ecr-pullthrough-cache";

const cache = new EcrPullThroughCache("echo-cache", {
  echoRegistryAccountId: "123456789012",
  echoRegistryRegion: "us-east-1", // default
  cacheNamespace: "echo",          // default
  resourcePrefix: "echo-mirror"     // default
});

export const mirrorUrl = cache.mirrorUrl;
export const usage = cache.usageInstruction;
```

## Inputs
- `echoRegistryAccountId` (string, required)
- `echoRegistryRegion` (string, default: `us-east-1`)
- `cacheNamespace` (string, default: `echo`)
- `resourcePrefix` (string, default: `echo-mirror`)
- `tags` (Record<string, string>, optional)

## Outputs
- `mirrorUrl`: Base URL of your mirror
- `roleArn`: ARN of the ECR access role
- `cacheRuleId`: Identifier of the cache rule
- `cacheRuleArn`: ARN of the cache rule
- `cacheNamespace`: Cache namespace used
- `usageInstruction`: Single-line docker pull command template

## Test
```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region)
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
docker pull "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/echo/<image>:<tag>"
```
