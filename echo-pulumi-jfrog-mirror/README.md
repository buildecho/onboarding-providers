# Echo JFrog Remote Repository - Pulumi Component

Pulumi component that configures JFrog Artifactory as a proxy for Echo. One
component provisions a Docker remote for **images**, PyPI / npm / Maven remotes
for **libraries** and a Debian remote for **OS packages**, based on the inputs.
Each repository is created only when its flag is set.

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

  // OS packages
  echoOsPackages: true,
  echoOsPackagesUrl: config.require("echoOsPackagesUrl"),
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
- `echoLibraryKeyValue` — library access key value (the Basic-auth password).
- `echoLibraryKeyName` — the Echo library access key **subject** (deterministic per
  tenant, `et-<id>`), used as the Basic-auth username. JFrog sends credentials
  preemptively, so Basic with the correct subject authenticates.
- `echoNpmUrl` (default `https://npm.echohq.com`) / `echoMavenUrl` (default
  `https://maven.echohq.com`)
- `echoPypiRepositoryName` / `echoNpmRepositoryName` / `echoMavenRepositoryName`
  (default → `<remoteRepositoryName>-{pypi,npm,maven}`)

#### PyPI topology
JFrog now supports a pypi remote whose upstream is a virtual, so PyPI is a
**single smart remote** (like npm and Maven) pointing at Echo's virtual `pypi`
that pip resolves against:
- `<pypi>` (remote) — URL `https://packages.echohq.com/artifactory/pypi`, Registry URL
  `https://packages.echohq.com/artifactory/api/pypi/pypi`; this is the key in the
  `--index-url`.

The remote sets both `url` (`<base>/<repo>`) and `pypiRegistryUrl`
(`<base>/api/pypi/<repo>`); `pypiRepositorySuffix` stays the default `simple`.
- `echoPypiBaseUrl` (default `https://packages.echohq.com/artifactory`) — host + prefix
  for the backing repo
- `echoPypiRepo` (default `pypi`) — Echo pypi repository path segment
- `echoPypiUrl` — **deprecated**, the standalone PyPI index URL is no longer used

> **Migrating from the two-remote topology:** the old layout created remotes
> `<pypi>-prod` and `<pypi>-remote` plus a virtual `<pypi>`. Upgrading, Pulumi
> destroys all three and creates remote `<pypi>`. Because the old virtual and the
> new remote share the same key, destroy the virtual first (e.g.
> `pulumi destroy --target '**-pypi'` for the virtual) so the new remote's key is
> free, or run the update twice.

> The pypi/npm/maven remotes do not expose `enableTokenAuthentication` in the provider
> (docker-only; jfrog provider issue #1389). If Echo ever requires Bearer, PATCH
> `{"enableTokenAuthentication":true}` via REST after create.

### OS packages (Debian)
- `echoOsPackages` (boolean, default `false`) — provision the Debian remote
- `echoOsPackagesUrl` (string) — the Echo Debian repository URL. **Required when
  `echoOsPackages` is set**; there is intentionally no default, and the component
  throws if it is missing. Copy it from the Integrations page in the Echo platform.
- `echoDebRepositoryName` (default → `<remoteRepositoryName>-deb`)

> **Consuming the mirror:** OS package mirroring is supported for **Echo-based
> images only**. Those images already ship Echo's apt signing key and source, so
> there is no keyring or `sources.list` setup. In your Dockerfile, swap the
> source URL to the new remote:
>
> ```dockerfile
> FROM echo/someimage:latest
> ARG APT_MIRROR=https://<your-jfrog-domain>/artifactory/echo-deb
> RUN echo-apt-mirror $APT_MIRROR
> RUN apt-get update && apt-get install -y my-package
> ```

### Shared
- `remoteRepositoryName` (string, default `echo`) — base name; per-format repos derive from it
- `description`, `notes`, `includesPattern`, `excludesPattern`, `repoLayoutRef`,
  `blockMismatchingMimeTypes`, `enableTokenAuthentication`, `storeArtifactsLocally`,
  `socketTimeoutMillis`, `retrievalCachePeriodSeconds`, `missedCachePeriodSeconds`,
  `hardFail`, `offline`, `bypassHeadRequests`, `priorityResolution`, `xrayIndex`, `propertySets`

## Outputs
- `usageInstructions` — per-format pull/install instructions (replace `<your-jfrog-domain>`)
