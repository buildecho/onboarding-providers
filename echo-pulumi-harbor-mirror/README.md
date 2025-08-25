# Echo Harbor Proxy Cache - Pulumi Component

Purpose: Minimal Pulumi component to set up Harbor proxy cache for Echo.

## Install
```bash
pulumi package add github.com/buildecho/onboarding-providers/echo-pulumi-harbor-mirror
```

## Usage
```ts
import { HarborIntegration } from "@buildecho/echo-pulumi-harbor-mirror";

const cache = new HarborIntegration("echo-harbor", {
  echoAccessKeyName: "your-access-key-name",
  echoAccessKeyValue: "your-access-key-value"
});

export const projectName = cache.projectName;
export const usageInstructions = cache.usageInstructions;
```

## Inputs
- `echoAccessKeyName` (string, required)
- `echoAccessKeyValue` (string, required)
- `echoRegistryUrl` (string, default: `https://reg.echohq.com`)
- `echoRegistryName` (string, default: `echo-registry`)
- `cacheProjectName` (string, default: `echo`)
- `projectPublic` (boolean, default: `false`)
- `vulnerabilityScanning` (boolean, default: `true`)
- `enableContentTrust` (boolean, default: `false`)
- `enableContentTrustCosign` (boolean, default: `false`)
- `autoSbomGeneration` (boolean, default: `false`)
- `registryDescription` (string, default: `Echo Registry`)
- `tags` (Record<string, string>, optional)

## Outputs
- `projectName`: Echo project name used in Harbor
- `registryId`: Echo registry identifier
- `usageInstructions`: Single-line docker pull command template

## Test
```bash
docker login <harbor-host>
docker pull <harbor-host>/<project>/static:latest
```
