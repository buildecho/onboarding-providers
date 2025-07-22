# ECR Pullthrough Cache - Pulumi Stack

This Pulumi stack creates an ECR pullthrough cache rule to integrate with Echo registry.

## Prerequisites

- Echo's AWS Account ID (provided by Echo team)
- Pulumi CLI installed ([install guide](https://www.pulumi.com/docs/get-started/install/))
- Node.js >= 14
- AWS CLI configured with appropriate credentials

## Quick Start

```bash
# Install dependencies
npm install

# Configure Echo Account ID
pulumi config set sourceRegistryAccountId ECHO_ACCOUNT_ID

# Deploy
pulumi up

# Test the integration
pulumi stack output usageInstructions
```

## Configuration

| Config Key | Description | Required | Default |
|-----------|-------------|----------|---------|
| `sourceRegistryAccountId` | Echo's AWS account ID (12 digits) | ✅ | - |
| `repositoryPrefix` | Prefix for cached repository names | ❌ | echo |

## Stack Outputs

- **cachePrefix**: The prefix used for cached repositories
- **roleArn**: ARN of the IAM role for cache access
- **usageInstructions**: Complete Docker pull commands

View outputs:
```bash
pulumi stack output
```

## Test the Integration

```bash
# Login to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin \
  your-account.dkr.ecr.your-region.amazonaws.com

# Pull an image
docker pull your-account.dkr.ecr.your-region.amazonaws.com/echo/test-image:latest
```

## Custom Configuration

```bash
# Set custom prefix
pulumi config set repositoryPrefix "echo-prod"

# Deploy with custom configuration
pulumi up
```

## Cleanup

Remove all resources:
```bash
pulumi destroy
```

## Troubleshooting

### Debug Mode
```bash
pulumi up --debug
```

### View Logs
```bash
pulumi logs
```

### Common Issues

- **Access denied**: Verify AWS credentials and Echo account ID
- **Stack creation failed**: Check debug output for detailed errors
- **Images not found**: Ensure correct repository prefix and image name

## Support

For issues:
1. Check Pulumi logs and debug output
2. Review the [ECR Integration Guide](../../docs/integrations/ecr.md)
3. Contact Echo support with stack outputs and error messages