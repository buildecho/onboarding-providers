# Echo Nexus Mirror - Pulumi Component

Purpose: Minimal Pulumi component to set up Sonatype Nexus Docker proxy for Echo registry.

## Install
```bash
pulumi package add @echo/pulumi-nexus-mirror
```

## Usage
```ts
import { NexusIntegration } from "@echo/pulumi-nexus-mirror";

const mirror = new NexusIntegration("echo-mirror", {
  echoAccessKeyName: "your-access-key-name",
  echoAccessKeyValue: pulumi.secret("your-access-key-value"),
  echoRegistryUrl: "https://reg.echohq.com", // default
  repositoryName: "echo",                    // default
  dockerConfig: {
    httpPort: 2525
  }
});

export const repositoryName = mirror.repositoryName;
export const usageInstructions = mirror.usageInstructions;
```

## Inputs
- `echoAccessKeyName` (string, required)
- `echoAccessKeyValue` (pulumi.Input<string>, required)
- `echoRegistryUrl` (string, default: `https://reg.echohq.com`)
- `repositoryName` (string, default: `echo`)
- `dockerConfig.httpPort` (number, optional)
- `dockerConfig.httpsPort` (number, optional)

## Outputs
- `repository`: Nexus Docker proxy repository resource
- `repositoryName`: Name of the created repository
- `repositoryUrl`: URL of the repository
- `usageInstructions`: Docker pull command template

## Test
```bash
docker login nexus.example.com:2525
docker pull nexus.example.com:2525/echo/<image>:<tag>
``` 
