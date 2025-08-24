# @buildecho/pulumi-onboarding-providers-ecr-pullthrough-cache

A Pulumi component for setting up AWS ECR pull-through cache to integrate with Echo's container registry. This package provides a simple, reusable way to configure ECR to cache Echo images locally in your AWS account.

## Features

- 🚀 Simple setup with sensible defaults
- 🔧 Fully configurable for advanced use cases
- 🏷️ Automatic tagging and resource organization
- 📝 Built-in usage instructions
- 🔒 Secure IAM role configuration
- 📦 TypeScript support with full type definitions

## Installation

```bash
npm install @buildecho/pulumi-onboarding-providers-ecr-pullthrough-cache
```

or with Yarn:

```bash
yarn add @buildecho/pulumi-onboarding-providers-ecr-pullthrough-cache
```

## Prerequisites

- Pulumi CLI installed ([install guide](https://www.pulumi.com/docs/get-started/install/))
- Node.js >= 14
- AWS credentials configured
- Echo's AWS Account ID (provided by Echo team)

## Quick Start

```typescript
import { EcrPullThroughCache } from "@buildecho/pulumi-onboarding-providers-ecr-pullthrough-cache";

const cache = new EcrPullThroughCache("echo-cache", {
    sourceRegistryAccountId: "123456789012", // Echo's account ID
});

export const cachePrefix = cache.cachePrefix;
export const instructions = cache.usageInstructions;
```

## API Reference

### EcrPullThroughCache

The main component class for creating ECR pull-through cache.

#### Constructor

```typescript
new EcrPullThroughCache(name: string, config: EcrPullThroughCacheConfig, opts?: pulumi.ComponentResourceOptions)
```

#### Configuration Options

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `sourceRegistryAccountId` | `string` | ✅ | - | Echo's AWS account ID |
| `sourceRegistryRegion` | `string` | ❌ | `"us-east-1"` | Echo's registry region |
| `repositoryPrefix` | `string` | ❌ | `"echo"` | Prefix for cached repositories |
| `roleName` | `string` | ❌ | `"echo-pullthrough-cache-role"` | Name for the IAM role |
| `tags` | `Record<string, string>` | ❌ | `{}` | Additional tags for resources |

#### Outputs

| Property | Type | Description |
|----------|------|-------------|
| `cachePrefix` | `pulumi.Output<string>` | The repository prefix used |
| `roleArn` | `pulumi.Output<string>` | ARN of the created IAM role |
| `cacheRule` | `aws.ecr.PullThroughCacheRule` | The cache rule resource |
| `usageInstructions` | `pulumi.Output<string>` | Formatted usage instructions |

### Helper Functions

#### createEcrPullThroughCache

A helper function for simpler setup:

```typescript
import { createEcrPullThroughCache } from "@buildecho/pulumi-onboarding-providers-ecr-pullthrough-cache";

const cache = createEcrPullThroughCache("echo-cache", {
    sourceRegistryAccountId: "123456789012"
});
```

## Examples

### Basic Usage

```typescript
import * as pulumi from "@pulumi/pulumi";
import { EcrPullThroughCache } from "@buildecho/pulumi-onboarding-providers-ecr-pullthrough-cache";

const config = new pulumi.Config();
const echoAccountId = config.require("echoAccountId");

const cache = new EcrPullThroughCache("echo-cache", {
    sourceRegistryAccountId: echoAccountId
});

export const instructions = cache.usageInstructions;
```

### Advanced Configuration

```typescript
const cache = new EcrPullThroughCache("production-cache", {
    sourceRegistryAccountId: echoAccountId,
    sourceRegistryRegion: "us-east-1",
    repositoryPrefix: "echo-prod",
    roleName: "echo-prod-cache-role",
    tags: {
        Environment: "production",
        Team: "platform",
        CostCenter: "engineering"
    }
});
```

### Multiple Caches for Different Teams

```typescript
const teams = ["frontend", "backend", "ml"];

const teamCaches = teams.map(team => {
    return new EcrPullThroughCache(`${team}-cache`, {
        sourceRegistryAccountId: echoAccountId,
        repositoryPrefix: `echo-${team}`,
        tags: { Team: team }
    });
});
```

## How It Works

1. **IAM Role Creation**: Creates a role that allows ECR to pull images from Echo's registry
2. **Pull-Through Cache Rule**: Configures ECR to cache images with your specified prefix
3. **Automatic Caching**: When you pull an Echo image, ECR automatically caches it locally

## Using Cached Images

Once configured, pull Echo images using your local cache:

```bash
# Instead of:
# docker pull <echo-account>.dkr.ecr.us-east-1.amazonaws.com/my-image:latest

# Use:
docker pull <your-account>.dkr.ecr.<your-region>.amazonaws.com/echo/my-image:latest
```

## Required IAM Permissions

Your AWS services need these permissions to use the cache:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:CreateRepository",
                "ecr:BatchImportUpstreamImage"
            ],
            "Resource": "arn:aws:ecr:*:*:repository/echo/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage"
            ],
            "Resource": "*"
        }
    ]
}
```

## Benefits

- ⚡ **Faster Pulls**: Images are cached in your region
- 🔒 **Enhanced Security**: Apply your own access controls
- 📊 **Better Visibility**: Monitor image usage in your account
- 🔄 **Automatic Updates**: Cache refreshes every 24 hours
- 💰 **Cost Optimization**: Reduce cross-region data transfer

## Troubleshooting

### Images Not Found

Ensure you're using the correct format:
```
<your-account>.dkr.ecr.<your-region>.amazonaws.com/<prefix>/<image>:<tag>
```

### Access Denied

1. Verify Echo's account ID is correct
2. Check IAM permissions for your services
3. Ensure the cache rule was created successfully

### Debug Output

Run Pulumi with debug logging:
```bash
pulumi up --debug
```

## Support

- 📧 Email: support@echohq.com
- 📚 Documentation: [Echo Docs](https://docs.echohq.com)
- 🐛 Issues: [GitHub Issues](https://github.com/echo/onboarding-providers/issues)

## License

MIT - see [LICENSE](LICENSE) for details.
