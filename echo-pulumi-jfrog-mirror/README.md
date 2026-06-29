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
- `echoLibraryKeyValue` — library access key value (the Basic-auth password).
- `echoLibraryKeyName` — the Echo library access key **subject** (deterministic per
  tenant, `et-<id>`), used as the Basic-auth username. JFrog sends credentials
  preemptively, so Basic with the correct subject authenticates.
- `echoNpmUrl` (default `https://npm.echohq.com`) / `echoMavenUrl` (default
  `https://maven.echohq.com`)
- `echoPypiRepositoryName` / `echoNpmRepositoryName` / `echoMavenRepositoryName`
  (default → `<remoteRepositoryName>-{pypi,npm,maven}`)

#### PyPI topology
A pypi remote cannot point at a virtual, so PyPI provisions **two smart remotes
aggregated by a customer virtual** that pip resolves against:
- `<pypi>` (virtual) — `repositories: [<pypi>-prod, <pypi>-remote]`; this is the key in
  the `--index-url`.
- `<pypi>-prod` (remote) — proxies Echo's first-party local `prod-pypi`.
- `<pypi>-remote` (remote) — proxies Echo's upstream cache `pypi-remote`.

Each member remote sets both `url` (`<base>/<repo>`) and `pypiRegistryUrl`
(`<base>/api/pypi/<repo>`); `pypiRepositorySuffix` stays the default `simple`.
- `echoPypiBaseUrl` (default `https://packages.echohq.com/artifactory`) — host + prefix
  for the backing repos
- `echoPypiProdRepo` (default `prod-pypi`) / `echoPypiRemoteRepo` (default `pypi-remote`)
- `echoPypiUrl` — **deprecated**, the single-remote PyPI URL is no longer used

> The pypi/npm/maven remotes do not expose `enableTokenAuthentication` in the provider
> (docker-only; jfrog provider issue #1389). If Echo ever requires Bearer, PATCH
> `{"enableTokenAuthentication":true}` via REST after create.

### Shared
- `remoteRepositoryName` (string, default `echo`) — base name; per-format repos derive from it
- `description`, `notes`, `includesPattern`, `excludesPattern`, `repoLayoutRef`,
  `blockMismatchingMimeTypes`, `enableTokenAuthentication`, `storeArtifactsLocally`,
  `socketTimeoutMillis`, `retrievalCachePeriodSeconds`, `missedCachePeriodSeconds`,
  `hardFail`, `offline`, `bypassHeadRequests`, `priorityResolution`, `xrayIndex`, `propertySets`

## Outputs
- `usageInstructions` — per-format pull/install instructions (replace `<your-jfrog-domain>`)
