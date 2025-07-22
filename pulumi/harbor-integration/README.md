# Harbor Integration Pulumi Module

This Pulumi module configures Harbor to integrate with Echo Registry, enabling Harbor to act as a proxy cache for Echo container images.

## Overview

The module creates:
- A Harbor registry configuration pointing to Echo Registry
- A Harbor project configured as a proxy cache for Echo images

This integration allows you to:
- Cache Echo container images locally in Harbor for faster pulls
- Reduce bandwidth usage by caching frequently used images
- Maintain a local registry mirror of Echo images
- Leverage Harbor's security scanning and policy features on Echo images

## Installation

### NPM

```bash
npm install @buildecho/pulumi-onboarding-providers-harbor-integration
```

### Yarn

```bash
yarn add @buildecho/pulumi-onboarding-providers-harbor-integration
```

## Prerequisites

Before using this module, ensure you have:

1. A running Harbor instance (v2.0 or later)
2. Admin credentials for Harbor
3. Echo Registry access credentials
4. Pulumi CLI installed and configured

## Provider Configuration

Configure the Harbor provider in your Pulumi program:

```typescript
import * as pulumi from "@pulumi/pulumi";
import * as harbor from "@pulumiverse/harbor";

// Configure the Harbor provider
const harborProvider = new harbor.Provider("harbor", {
    url: "https://your-harbor-instance.com",
    username: "admin",
    password: pulumi.secret("your-harbor-password"),
});
```

## Usage

### Basic Usage

```typescript
import { HarborIntegration } from "@buildecho/pulumi-onboarding-providers-harbor-integration";

const harborIntegration = new HarborIntegration("echo-harbor", {
    echoAccessKeyName: "your-echo-access-key-name",
    echoAccessKeyValue: pulumi.secret("your-echo-access-key-value"),
}, { provider: harborProvider });

// Export useful information
export const projectName = harborIntegration.projectName;
export const instructions = harborIntegration.usageInstructions;
```

### Advanced Usage with Custom Configuration

```typescript
import { HarborIntegration } from "@buildecho/pulumi-onboarding-providers-harbor-integration";

const harborIntegration = new HarborIntegration("echo-harbor", {
    create: true,
    echoRegistryUrl: "https://reg.echohq.com",
    echoAccessKeyName: config.require("echoAccessKeyName"),
    echoAccessKeyValue: config.requireSecret("echoAccessKeyValue"),
    registryName: "echo-registry",
    projectName: "echo",
    projectPublic: false,
    vulnerabilityScanning: true,
    enableContentTrust: true,
    enableContentTrustCosign: false,
    autoSbomGeneration: true,
}, { provider: harborProvider });
```

### Using the Helper Function

```typescript
import { createHarborIntegration } from "@buildecho/pulumi-onboarding-providers-harbor-integration";

const integration = createHarborIntegration("echo-harbor", {
    echoAccessKeyName: "my-access-key",
    echoAccessKeyValue: pulumi.secret("my-access-key-value"),
}, { provider: harborProvider });

export const instructions = integration.usageInstructions;
```

### Conditional Creation

```typescript
const enableIntegration = config.getBoolean("enableHarborIntegration") ?? true;

const harborIntegration = new HarborIntegration("echo-harbor", {
    create: enableIntegration,
    echoAccessKeyName: config.require("echoAccessKeyName"),
    echoAccessKeyValue: config.requireSecret("echoAccessKeyValue"),
}, { provider: harborProvider });
```

## Configuration Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `create` | `boolean` | `true` | Whether to provision the resources |
| `echoRegistryUrl` | `string` | `"https://reg.echohq.com"` | The URL of the Echo registry |
| `echoAccessKeyName` | `string` | required | The name of the Echo access key |
| `echoAccessKeyValue` | `pulumi.Input<string>` | required | The value of the Echo access key (should be marked as secret) |
| `registryName` | `string` | `"echo-registry"` | Name for the Harbor registry resource |
| `projectName` | `string` | `"echo"` | Name for the Harbor project |
| `registryDescription` | `string` | `"Echo Registry"` | Description for the Echo registry in Harbor |
| `projectPublic` | `boolean` | `false` | Whether to make the project public |
| `vulnerabilityScanning` | `boolean` | `true` | Enable vulnerability scanning for the project |
| `enableContentTrust` | `boolean` | `false` | Enable content trust (Notary) for the project |
| `enableContentTrustCosign` | `boolean` | `false` | Enable content trust (Cosign) for the project |
| `autoSbomGeneration` | `boolean` | `false` | Automatically generate SBOM for images |

## Outputs

The module provides the following outputs:

| Output | Type | Description |
|--------|------|-------------|
| `registry` | `harbor.Registry` | The Harbor registry resource |
| `project` | `harbor.Project` | The Harbor project resource |
| `registryId` | `pulumi.Output<number>` | The registry ID for reference |
| `projectName` | `pulumi.Output<string>` | The project name |
| `usageInstructions` | `pulumi.Output<string>` | Human-readable usage instructions |

## How to Use the Proxy Cache

Once the module is deployed, you can pull images through Harbor instead of directly from Echo:

```bash
# Instead of pulling directly from Echo:
# docker pull reg.echohq.com/nginx:latest

# Pull through Harbor proxy cache:
docker pull your-harbor-instance.com/echo/nginx:latest
```

The first pull will fetch the image from Echo and cache it in Harbor. Subsequent pulls will use the cached version.

## Complete Example

Here's a complete example that sets up Harbor integration with Echo:

```typescript
import * as pulumi from "@pulumi/pulumi";
import * as harbor from "@pulumiverse/harbor";
import { HarborIntegration } from "@buildecho/pulumi-onboarding-providers-harbor-integration";

// Get configuration
const config = new pulumi.Config();

// Configure the Harbor provider
const harborProvider = new harbor.Provider("harbor", {
    url: config.require("harborUrl"),
    username: config.require("harborUsername"),
    password: config.requireSecret("harborPassword"),
});

// Create the Harbor integration
const echoIntegration = new HarborIntegration("echo-integration", {
    echoAccessKeyName: config.require("echoAccessKeyName"),
    echoAccessKeyValue: config.requireSecret("echoAccessKeyValue"),
    vulnerabilityScanning: true,
    autoSbomGeneration: true,
}, { 
    provider: harborProvider,
    // Optionally protect from accidental deletion
    protect: true,
});

// Export the results
export const projectName = echoIntegration.projectName;
export const registryId = echoIntegration.registryId;
export const usageInstructions = echoIntegration.usageInstructions;
```

## Security Considerations

- Always use `pulumi.secret()` for sensitive values like access keys
- Store sensitive configuration in Pulumi's secret management system
- Ensure your Harbor instance is properly secured with TLS
- Regularly update cached images to get security patches
- Configure appropriate retention policies in Harbor to manage storage

## Troubleshooting

### Common Issues

1. **Authentication Failed**: Ensure your Echo access keys are correct and have the necessary permissions
2. **Registry Connection Failed**: Verify the Echo registry URL is accessible from your Harbor instance
3. **Project Creation Failed**: Check that you have admin permissions in Harbor
4. **Provider Not Found**: Ensure you've installed the `@pulumiverse/harbor` package

### Debug Tips

- Check Harbor logs for detailed error messages
- Verify network connectivity between Harbor and Echo Registry
- Ensure Harbor version compatibility (v2.0+)
- Use `pulumi up --debug` for detailed deployment logs

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This module is licensed under the MIT License. See the LICENSE file for details.

## Support

For issues related to:
- This Pulumi module: Open an issue in this repository
- Echo Registry: Contact support@echohq.com
- Harbor: Refer to the [Harbor documentation](https://goharbor.io/docs/) 