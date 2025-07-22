# Nexus Integration - Pulumi Component

This Pulumi component creates a Sonatype Nexus Docker proxy repository to integrate with Echo registry, providing a simple abstraction for customers to easily set up caching and proxying of Echo container images.

## Prerequisites

- Sonatype Nexus Repository Manager (OSS or Pro)
- Echo access key (name and value) from Echo platform
- Pulumi CLI installed
- Node.js >= 14
- Nexus provider configured

## Installation

```bash
npm install @buildecho/pulumi-onboarding-providers-nexus-integration
```

or with Yarn:

```bash
yarn add @buildecho/pulumi-onboarding-providers-nexus-integration
```

## Quick Start

```typescript
import * as pulumi from "@pulumi/pulumi";
import * as nexus from "@pulumi/nexus";
import { NexusIntegration } from "@buildecho/pulumi-onboarding-providers-nexus-integration";

// Configure the Nexus provider
const nexusProvider = new nexus.Provider("nexus", {
    url: "https://nexus.example.com",
    username: "admin",
    password: pulumi.secret("admin-password"),
    insecure: false
});

// Create the Echo integration
const echoIntegration = new NexusIntegration("echo-nexus", {
    echoAccessKeyName: "your-echo-access-key-name",
    echoAccessKeyValue: pulumi.secret("your-echo-access-key-value"),
    dockerConfig: {
        httpPort: 2525
    }
}, { provider: nexusProvider });

// Export useful information
export const repositoryName = echoIntegration.repositoryName;
export const dockerPullCommand = echoIntegration.dockerPullCommand;
export const instructions = echoIntegration.usageInstructions;
```

## Configuration Options

### Basic Configuration

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `echoAccessKeyName` | string | ✅ | - | Echo access key name |
| `echoAccessKeyValue` | pulumi.Input<string> | ✅ | - | Echo access key value (use pulumi.secret) |
| `echoRegistryUrl` | string | ❌ | `https://reg.echohq.com` | Echo registry URL |
| `repositoryName` | string | ❌ | `echo` | Name of the Docker proxy repository |
| `repositoryOnline` | boolean | ❌ | `true` | Whether repository should be online |

### Docker Configuration

Configure Docker-specific settings using the `dockerConfig` property:

```typescript
dockerConfig: {
    forceBasicAuth: true,      // Force basic authentication (default: true)
    httpPort: 2525,            // HTTP port for Docker registry
    httpsPort: 2526,           // HTTPS port for Docker registry
    v1Enabled: false,          // Enable Docker V1 API support (default: false)
    subdomain: "docker"        // Subdomain for Docker repository connector
}
```

### Storage Configuration

Configure storage settings using the `storageConfig` property:

```typescript
storageConfig: {
    blobStoreName: "docker-blob-store",        // Blob store name (default: "default")
    strictContentTypeValidation: true          // Enable strict validation (default: true)
}
```

### Proxy Configuration

Configure proxy caching behavior using the `proxyConfig` property:

```typescript
proxyConfig: {
    contentMaxAge: 2880,       // Content cache duration in minutes (default: 1440)
    metadataMaxAge: 60         // Metadata cache duration in minutes (default: 1440)
}
```

### Advanced Configuration

For more advanced configurations, see the full interface documentation in the source code.

## Examples

### Basic Usage

```typescript
import { NexusIntegration } from "@buildecho/pulumi-onboarding-providers-nexus-integration";

const nexusIntegration = new NexusIntegration("echo-nexus", {
    echoAccessKeyName: config.require("echoAccessKeyName"),
    echoAccessKeyValue: config.requireSecret("echoAccessKeyValue")
});
```

### With Custom Docker Ports

```typescript
const nexusIntegration = new NexusIntegration("echo-nexus", {
    echoAccessKeyName: config.require("echoAccessKeyName"),
    echoAccessKeyValue: config.requireSecret("echoAccessKeyValue"),
    repositoryName: "echo-prod",
    dockerConfig: {
        httpPort: 8082,
        httpsPort: 8083,
        v1Enabled: true
    }
});
```

### With Custom Caching Settings

```typescript
const nexusIntegration = new NexusIntegration("echo-nexus", {
    echoAccessKeyName: config.require("echoAccessKeyName"),
    echoAccessKeyValue: config.requireSecret("echoAccessKeyValue"),
    proxyConfig: {
        contentMaxAge: 2880,    // 48 hours
        metadataMaxAge: 60      // 1 hour
    },
    negativeCacheConfig: {
        enabled: true,
        ttl: 2880              // 48 hours
    }
});
```

### Using the Helper Function

```typescript
import { createNexusIntegration } from "@buildecho/pulumi-onboarding-providers-nexus-integration";

const integration = createNexusIntegration("echo-nexus", {
    echoAccessKeyName: "my-access-key",
    echoAccessKeyValue: pulumi.secret("my-access-key-value")
});

export const instructions = integration.usageInstructions;
```

## Outputs

The component provides the following outputs:

| Output | Type | Description |
|--------|------|-------------|
| `repository` | nexus.RepositoryDockerProxy | The created Nexus repository resource |
| `repositoryName` | pulumi.Output<string> | Name of the created repository |
| `repositoryUrl` | pulumi.Output<string> | URL of the repository |
| `dockerPullCommand` | pulumi.Output<string> | Example Docker pull command |
| `usageInstructions` | pulumi.Output<string> | Human-readable usage instructions |

## Testing the Integration

After deployment:

1. **Get the Docker pull command**:
   ```bash
   pulumi stack output dockerPullCommand
   ```

2. **Configure Docker to use Nexus**:
   ```bash
   docker login nexus.example.com:2525
   ```

3. **Pull an image through the proxy**:
   ```bash
   docker pull nexus.example.com:2525/echo/nginx:latest
   ```

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify Echo access key name and value
   - Check Nexus provider credentials
   - Ensure Nexus has internet connectivity

2. **Port Already in Use**
   - Choose different HTTP/HTTPS ports
   - Check for conflicting services

3. **Repository Creation Failed**
   - Verify blob store exists
   - Check Nexus permissions
   - Ensure repository name is unique

### Debug Tips

- Check Nexus logs: `/opt/sonatype-work/nexus3/log/nexus.log`
- Verify connectivity: `curl -I https://reg.echohq.com`
- Test Nexus API: `curl -u admin:password https://nexus.example.com/service/rest/v1/repositories`

## Security Considerations

1. **Always use `pulumi.secret()` for sensitive values**:
   ```typescript
   echoAccessKeyValue: pulumi.secret("your-secret-value")
   ```

2. **Store credentials securely**:
   - Use Pulumi configuration with encryption
   - Use environment variables
   - Use secret management systems

3. **Configure HTTPS when possible**:
   ```typescript
   dockerConfig: {
       httpsPort: 8443
   }
   ```

## License

MIT

## Support

For issues:
1. Check the [Nexus Docker Proxy Documentation](https://help.sonatype.com/repomanager3/formats/docker-registry/proxy-repository-for-docker)
2. Review the [Pulumi Nexus Provider Documentation](https://www.pulumi.com/registry/packages/nexus/)
3. Contact Echo support at support@echohq.com 