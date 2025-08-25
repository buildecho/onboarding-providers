# Echo JFrog Remote Repository - Pulumi Component

Purpose: Minimal Pulumi component to set up JFrog Artifactory remote repository for Echo Registry.

## Install
```bash
pulumi package add github.com/buildecho/onboarding-providers/echo-pulumi-jfrog-mirror
```

## Usage
```ts
import { JfrogIntegration } from "@buildecho/echo-pulumi-jfrog-mirror";

const integration = new JfrogIntegration("echo-integration", {
  echoAccessKeyName: "your-echo-username",
  echoAccessKeyValue: "your-echo-password",
  remoteRepositoryKey: "echo",              // default
  echoRegistryUrl: "https://reg.echohq.com" // default
});

export const repositoryUrl = integration.repositoryUrl;
export const usageInstructions = integration.usageInstructions;
```

## Inputs
- `echoAccessKeyName` (string, required): Echo Registry access key name (username)
- `echoAccessKeyValue` (string, required): Echo Registry access key value (password)
- `remoteRepositoryKey` (string, default: `echo`): The key (name) for the remote repository
- `echoRegistryUrl` (string, default: `https://reg.echohq.com`): The URL of the Echo registry
- `description` (string, default: `Echo Registry remote repository for container images`): Repository description
- `notes` (string, default: `Managed by Pulumi - Echo Registry integration`): Internal notes about the repository
- `includesPattern` (string, default: `**/*`): Comma-separated list of patterns to include when evaluating artifact requests
- `excludesPattern` (string, default: `""`): Comma-separated list of patterns to exclude when evaluating artifact requests
- `repoLayoutRef` (string, default: `simple-default`): Repository layout reference
- `blockMismatchingMimeTypes` (boolean, default: `true`): Block artifacts with mismatching MIME types
- `enableTokenAuthentication` (boolean, default: `true`): Enable token authentication for Docker repositories
- `storeArtifactsLocally` (boolean, default: `true`): Store artifacts locally when proxying
- `socketTimeoutMillis` (number, default: `15000`): Network socket timeout in milliseconds
- `retrievalCachePeriodSeconds` (number, default: `7200`): Cache period for retrieval operations in seconds
- `missedCachePeriodSeconds` (number, default: `1800`): Cache period for missed artifacts in seconds
- `hardFail` (boolean, default: `false`): Fail the request if the remote repository is not available
- `offline` (boolean, default: `false`): Set the repository to offline mode
- `bypassHeadRequests` (boolean, default: `false`): Bypass HEAD requests and directly perform GET requests
- `priorityResolution` (boolean, default: `false`): Enable priority resolution
- `xrayIndex` (boolean, default: `false`): Enable Xray indexing
- `propertySets` (string[], default: `["artifactory"]`): List of property sets to apply to the repository
- `tags` (Record<string, string>, optional): Additional tags to apply to created resources

## Outputs
- `repositoryUrl`: URL of the JFrog remote repository
- `usageInstructions`: Docker pull command template

## Test
```bash
# Login to your JFrog Artifactory instance
docker login your-artifactory-url

# Pull an Echo image through JFrog
docker pull your-artifactory-url/echo/<image>:<tag>
``` 
