# Echo GAR Remote Repository - Pulumi Component

Configures GCP Artifact Registry as a proxy for Echo. One component provisions a
Docker remote for **images** and/or PyPI (PYTHON) / npm (NPM) / Maven (MAVEN)
remotes for **libraries**, based on the inputs. Each repository is created only
when its flag is set. Credentials are stored in Secret Manager; the image key
and the library key are distinct secrets.

## Install
```bash
pulumi package add github.com/buildecho/onboarding-providers/echo-pulumi-gar-mirror
```

## Usage
```ts
import { GcpGarRemote } from "@buildecho/echo-pulumi-gar-mirror";

const remote = new GcpGarRemote("echo-remote", {
  projectId: "my-gcp-project",

  // Images
  echoImages: true,
  echoImageKeyName: config.requireSecret("echoImageKeyName"),
  echoImageKeyValue: config.requireSecret("echoImageKeyValue"),

  // Libraries (one shared library key)
  echoLibraryPypi: true,
  echoLibraryNpm: true,
  echoLibraryKeyName: config.requireSecret("echoLibraryKeyName"),
  echoLibraryKeyValue: config.requireSecret("echoLibraryKeyValue"),
});

export const usage = remote.usageInstructions;
```

## Inputs

### Images (container registry)
- `echoImages` (boolean, default: `false`) — provision the Docker remote
- `echoImageKeyName` / `echoImageKeyValue` (Input<string>, secret) — image access key
- `echoImageRepositoryName` (string, default: `""` → `repositoryName`)
- `echoRegistryUrl` (string, default: `https://reg.echohq.com`)
- `echoAccessKeySecretName` (string, default: `echo-gar-mirror-secret`) — Secret Manager secret name for the image key
- `echoAccessKeyName` / `echoAccessKeyValue` — **deprecated**, kept for backwards
  compatibility; provisions the Docker remote when set.

### Libraries (package registries — one shared library key)
- `echoLibraryPypi` / `echoLibraryNpm` / `echoLibraryMaven` (boolean, default: `false`)
- `echoLibraryKeyName` / `echoLibraryKeyValue` (Input<string>, secret) — library access key
- `echoLibraryKeySecretName` (string, default: `echo-gar-mirror-library-secret`) — Secret Manager secret name for the library key
- `echoPypiUrl` (default: `https://pypi.echohq.com`)
- `echoNpmUrl` (default: `https://npm.echohq.com`)
- `echoMavenUrl` (default: `https://maven.echohq.com`)
- `echoPypiRepositoryName` / `echoNpmRepositoryName` / `echoMavenRepositoryName`
  (string, default: `""` → `<repositoryName>-{pypi,npm,maven}`)

### Shared
- `projectId` (string, required)
- `location` (string, default: `us-central1`)
- `repositoryName` (string, default: `echo`) — base name; per-format repos derive from it
- `description` (string, default: `Remote repository for Echo Registry integration`)
- `readerMembers` (string[], optional) — granted reader on every created repo
- `writerMembers` (string[], optional) — granted writer on every created repo
- `labels` (Record<string, string>, optional)

## Outputs
- `imageRepositoryKey`: Docker remote repository id (or `undefined`)
- `libraryRepositoryKeys`: list of created library remote repository ids
- `usageInstructions`: multi-line per-format pull/install instructions

## Test
```bash
# Images
gcloud auth configure-docker <location>-docker.pkg.dev
docker pull <location>-docker.pkg.dev/<PROJECT>/<REPOSITORY>/<echo-image>:<tag>

# Libraries (examples)
pip install --index-url https://<location>-python.pkg.dev/<PROJECT>/<REPOSITORY>-pypi/simple/ <package>
npm install --registry https://<location>-npm.pkg.dev/<PROJECT>/<REPOSITORY>-npm/ <package>
```
