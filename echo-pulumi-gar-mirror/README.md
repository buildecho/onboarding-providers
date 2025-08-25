# Echo GAR Remote Repository - Pulumi Component

Purpose: Minimal Pulumi component to set up a GCP Artifact Registry remote repository for Echo.

## Install
```bash
pulumi package add @echo/pulumi-gcp-gar-remote
```

## Usage
```ts
import { GcpGarRemote } from "@echo/pulumi-gcp-gar-remote";

const remote = new GcpGarRemote("echo-remote", {
  projectId: "my-gcp-project",
  location: "us-central1",         // default
  cacheRepositoryName: "echo",     // default
  echoAccessKeyName: "<echo-username>",
  echoAccessKeyValue: "<echo-password>",
  echoRegistryUrl: "https://reg.echohq.com" // default
});

export const usage = remote.usageInstruction;
```

## Inputs
- `projectId` (string, required)
- `location` (string, default: `us-central1`)
- `cacheRepositoryName` (string, default: `echo`)
- `echoAccessKeyName` (string, required)
- `echoAccessKeyValue` (string, required, secret)
- `echoRegistryUrl` (string, default: `https://reg.echohq.com`)
- `labels` (Record<string, string>, optional)
- `readerMembers` (string[], optional)
- `writerMembers` (string[], optional)
- `accessKeySecretName` (string, default: `echo-gar-mirror-secret`)

## Outputs
- `repositoryId`: GAR repository id
- `secretId`: Secret Manager secret id
- `secretVersionName`: Secret version name
- `usageInstruction`: Single-line docker pull command template

## Test
```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
docker pull us-central1-docker.pkg.dev/<PROJECT>/<REPOSITORY>/<echo-image>:<tag>
```
