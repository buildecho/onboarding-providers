# Echo GAR Remote Repository - Pulumi Component

Purpose: Minimal Pulumi component to set up a GCP Artifact Registry remote repository for Echo.

## Install
```bash
pulumi package add github.com/buildecho/onboarding-providers/echo-pulumi-gar-mirror
```

## Usage
```ts
import { GcpGarRemote } from "@buildecho/echo-pulumi-gar-mirror";

const remote = new GcpGarRemote("echo-remote", {
  projectId: "my-gcp-project",
  location: "us-central1",         // default
  cacheRepositoryName: "echo",     // default
  echoAccessKeyName: "<echo-username>",
  echoAccessKeyValue: "<echo-password>",
  echoRegistryUrl: "https://reg.echohq.com" // default
});

export const usage = remote.usageInstructions;
```

## Inputs
- `projectId` (string, required)
- `location` (string, default: `us-central1`)
- `repositoryName` (string, default: `echo`)
- `echoAccessKeyName` (string, required)
- `echoAccessKeyValue` (string, required, secret)
- `echoRegistryUrl` (string, default: `https://reg.echohq.com`)
- `description` (string, default: `Remote repository for Echo Registry integration`)
- `readerMembers` (string[], optional)
- `writerMembers` (string[], optional)
- `echoAccessKeySecretName` (string, default: `echo-gar-mirror-secret`)
- `labels` (Record<string, string>, optional)

## Outputs
- `repositoryId`: GAR repository id
- `secretId`: Secret Manager secret id
- `secretVersionName`: Secret version name
- `usageInstructions`: Single-line docker pull command template

## Test
```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
docker pull us-central1-docker.pkg.dev/<PROJECT>/<REPOSITORY>/<echo-image>:<tag>
```
