# Pulumi JFrog Integration for Echo Registry

This Pulumi component creates a JFrog Artifactory remote repository configured to proxy container images from Echo Registry.

## Installation

```bash
npm install @buildecho/pulumi-onboarding-providers-jfrog-integration
```

or

```bash
yarn add @buildecho/pulumi-onboarding-providers-jfrog-integration
```

## Prerequisites

1. A JFrog Artifactory instance with appropriate permissions to create repositories
2. Echo Registry access credentials (access key name and value)
3. Pulumi CLI installed and configured
4. Node.js 14+ installed

## Configuration

Before using this component, you need to configure the Artifactory provider. You can do this through:

### Environment Variables

```bash
export ARTIFACTORY_URL="https://your-artifactory-instance.com/artifactory"
export ARTIFACTORY_ACCESS_TOKEN="your-artifactory-access-token"
```

### Pulumi Configuration

```bash
pulumi config set artifactory:url https://your-artifactory-instance.com/artifactory
pulumi config set artifactory:accessToken your-artifactory-access-token --secret
```

## Usage

### Basic Example

```typescript
import * as pulumi from "@pulumi/pulumi";
import { JfrogIntegration } from "@buildecho/pulumi-onboarding-providers-jfrog-integration";

const config = new pulumi.Config();

const integration = new JfrogIntegration("echo-integration", {
    echoAccessKeyName: config.requireSecret("echoAccessKeyName"),
    echoAccessKeyValue: config.requireSecret("echoAccessKeyValue")
});

export const repositoryKey = integration.repositoryKey;
export const repositoryUrl = integration.repositoryUrl;
export const instructions = integration.usageInstructions;
```

### Advanced Example with Custom Configuration

```typescript
import * as pulumi from "@pulumi/pulumi";
import { JfrogIntegration } from "@buildecho/pulumi-onboarding-providers-jfrog-integration";

const config = new pulumi.Config();

const integration = new JfrogIntegration("echo-integration", {
    echoAccessKeyName: config.requireSecret("echoAccessKeyName"),
    echoAccessKeyValue: config.requireSecret("echoAccessKeyValue"),
    repositoryKey: "echo-custom",
    description: "Custom Echo Registry proxy",
    storeArtifactsLocally: true,
    retrievalCachePeriodSeconds: 14400, // 4 hours
    xrayIndex: true, // Enable Xray scanning
    includesPattern: "echo/**",
    excludesPattern: "echo/internal/**"
});

export const repositoryKey = integration.repositoryKey;
export const repositoryUrl = integration.repositoryUrl;
```

### Using the Helper Function

```typescript
import { createJfrogIntegration } from "@buildecho/pulumi-onboarding-providers-jfrog-integration";

const integration = createJfrogIntegration("echo-integration", {
    echoAccessKeyName: "my-echo-username",
    echoAccessKeyValue: "my-echo-password"
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `echoAccessKeyName` | `string` | *required* | Echo Registry access key name (username) |
| `echoAccessKeyValue` | `string` | *required* | Echo Registry access key value (password) |
| `repositoryKey` | `string` | `"echo"` | The key (name) for the remote repository |
| `echoRegistryUrl` | `string` | `"https://reg.echohq.com"` | The URL of the Echo registry |
| `description` | `string` | `"Echo Registry remote repository..."` | Repository description |
| `storeArtifactsLocally` | `boolean` | `true` | Store artifacts locally when proxying |
| `retrievalCachePeriodSeconds` | `number` | `7200` | Cache period for retrieval operations |
| `missedCachePeriodSeconds` | `number` | `1800` | Cache period for missed artifacts |
| `xrayIndex` | `boolean` | `false` | Enable Xray indexing |
| `includesPattern` | `string` | `"**/*"` | Patterns to include |
| `excludesPattern` | `string` | `""` | Patterns to exclude |

For a complete list of configuration options, see the [TypeScript interface definition](src/index.ts).

## Using Echo Images Through Artifactory

Once the integration is set up, you can pull Echo images through your Artifactory instance:

```bash
# Login to your Artifactory instance
docker login your-artifactory-url

# Pull an Echo image through Artifactory
docker pull your-artifactory-url/echo/image-name:tag

# Example
docker pull artifactory.example.com/echo/static:latest
```

## Benefits

- **Centralized Access Control**: Manage access to Echo images through Artifactory's permission system
- **Local Caching**: Images are cached locally for faster subsequent pulls
- **Security Scanning**: Integrate with JFrog Xray for vulnerability scanning
- **Audit Trail**: Track who is using which images
- **Network Efficiency**: Reduce bandwidth usage with local caching

## Troubleshooting

### Authentication Issues

If you encounter authentication errors:

1. Verify your Echo credentials are correct
2. Ensure your Artifactory instance has internet access to reach Echo Registry
3. Check that the Artifactory user has permissions to create repositories

### Image Pull Failures

If you can't pull images:

1. Verify the repository was created successfully in Artifactory
2. Ensure you're authenticated to Artifactory (`docker login`)
3. Check the repository URL format: `<artifactory-url>/<repository-key>/<image>:<tag>`

## Support

For issues related to:
- This Pulumi component: Open an issue in this repository
- Echo Registry: Contact support@echohq.com
- JFrog Artifactory: Refer to [JFrog documentation](https://jfrog.com/help/)

## License

MIT 