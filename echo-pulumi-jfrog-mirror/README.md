# Echo JFrog Remote Repository - Pulumi Component

Pulumi component that configures JFrog Artifactory as a proxy for Echo. One
component provisions a Docker remote for **images** and/or PyPI / npm / Maven
remotes for **libraries**, based on the inputs. Each repository is created only
when its flag is set.

## Install
```bash
pulumi package add github.com/buildecho/onboarding-providers/echo-pulumi-jfrog-mirror
```

## Usage
```ts
import { JfrogIntegration } from "@buildecho/echo-pulumi-jfrog-mirror";

const integration = new JfrogIntegration("echo-integration", {
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

export const usageInstructions = integration.usageInstructions;
```

## Inputs

### Images
- `echoImages` (boolean, default `false`) — provision the Docker remote
- `echoImageKeyName` / `echoImageKeyValue` — image access key
- `echoImageRepositoryName` (string, default → `remoteRepositoryName`)
- `echoRegistryUrl` (string, default `https://reg.echohq.com`)
- `echoAccessKeyName` / `echoAccessKeyValue` — **deprecated**, backwards-compatible image fields

### Libraries (one shared library key)
- `echoLibraryPypi` / `echoLibraryNpm` / `echoLibraryMaven` (boolean, default `false`)
- `echoLibraryKeyValue` — library access key. Authentication is **token-only**: this
  value is the password.
- `echoLibraryKeyName` — **no-op**. Accepted for parity with the image flow, but Echo's
  library index ignores the username.
- `echoPypiUrl` (default `https://pypi.echohq.com`) / `echoNpmUrl` (default
  `https://npm.echohq.com`) / `echoMavenUrl` (default `https://maven.echohq.com`)
- `echoPypiRepositoryName` / `echoNpmRepositoryName` / `echoMavenRepositoryName`
  (default → `<remoteRepositoryName>-{pypi,npm,maven}`)

### Shared
- `remoteRepositoryName` (string, default `echo`) — base name; per-format repos derive from it
- `description`, `notes`, `includesPattern`, `excludesPattern`, `repoLayoutRef`,
  `blockMismatchingMimeTypes`, `enableTokenAuthentication`, `storeArtifactsLocally`,
  `socketTimeoutMillis`, `retrievalCachePeriodSeconds`, `missedCachePeriodSeconds`,
  `hardFail`, `offline`, `bypassHeadRequests`, `priorityResolution`, `xrayIndex`, `propertySets`

## Outputs
- `usageInstructions` — per-format pull/install instructions (replace `<your-jfrog-domain>`)
