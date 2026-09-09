# Echo JFrog Artifactory Mirror - Terraform Module

Configures JFrog Artifactory as a proxy for Echo. One module provisions a Docker
remote for **images**, PyPI / npm / Maven / NuGet remotes for **libraries** and a Debian
remote for **OS packages**, based on the inputs. Each repository is created only
when its flag is set.

## Quickstart

```hcl
module "echo_jfrog_mirror" {
  source = "git@github.com:buildecho/onboarding-providers.git//echo-terraform-jfrog-mirror"

  # Images
  echo_images          = true
  echo_image_key_name  = var.echo_image_key_name
  echo_image_key_value = var.echo_image_key_value

  # Libraries (one shared library key)
  echo_library_pypi      = true
  echo_library_npm       = true
  echo_library_nuget     = true
  echo_library_key_name  = var.echo_library_key_name
  echo_library_key_value = var.echo_library_key_value

  # OS packages (URL comes from the Echo platform)
  echo_os_packages     = true
  echo_os_packages_url = var.echo_os_packages_url
}

output "usage_instructions" {
  value = module.echo_jfrog_mirror.usage_instructions
}
```

```bash
terraform init && terraform apply
```

## Inputs

### Images (container registry)
- `echo_images` (bool, default: `false`) — provision the Docker remote
- `echo_image_key_name` / `echo_image_key_value` (string, sensitive) — image access key
- `echo_image_repository_name` (string, default: `""` → `remote_repository_name`)
- `echo_registry_url` (string, default: `"https://reg.echohq.com"`)
- `echo_access_key_name` / `echo_access_key_value` — **deprecated**, kept for backwards
  compatibility; when set they provision the Docker remote using the image fields.

### Libraries (package registries — one shared library key)
- `echo_library_pypi` / `echo_library_npm` / `echo_library_maven` /
  `echo_library_nuget` (bool, default: `false`)
- `echo_library_key_value` (string, sensitive) — library access key (the password).
- `echo_library_key_name` (string, sensitive) — the Echo library access-key **subject**
  (`et-<id>`) used as the Basic auth username. Required: JFrog remotes send credentials
  preemptively, so the correct subject authenticates.
- `echo_pypi_base_url` (default: `"https://packages.echohq.com/artifactory"`) — Echo host
  backing the PyPI remote
- `echo_pypi_repo` (default: `"pypi"`) — Echo pypi repository path segment
- `echo_pypi_url` — **deprecated**, replaced by `echo_pypi_base_url` + `echo_pypi_repo`
- `echo_npm_url` (default: `"https://npm.echohq.com"`)
- `echo_maven_url` (default: `"https://maven.echohq.com"`)
- `echo_nuget_url` (default: `"https://nuget.echohq.com"`)
- `echo_nuget_v3_feed_url` (default: `"https://nuget.echohq.com/index.json"`)
- `echo_pypi_repository_name` / `echo_npm_repository_name` /
  `echo_maven_repository_name` / `echo_nuget_repository_name`
  (string, default: `""` → `<remote_repository_name>-{pypi,npm,maven,nuget}`)

> **NuGet routing:** the module explicitly sets the NuGet v3 feed URL to Echo and
> clears JFrog's default nuget.org symbol-server URL. It also forces NuGet client
> authentication so Artifactory challenges clients to send their JFrog credentials.
> Omitting the feed or symbol-server setting can route NuGet requests around Echo.
> Customer-side package caching remains enabled.

> **PyPI topology:** JFrog now supports a pypi remote whose upstream is a virtual,
> so enabling `echo_library_pypi` creates a **single smart remote** (`<pypi>`) like
> npm and Maven, pointing at Echo's virtual `pypi`
> (URL `https://packages.echohq.com/artifactory/pypi`, Registry URL
> `https://packages.echohq.com/artifactory/api/pypi/pypi`). pip resolves against it.
>
> **Migrating from the two-remote topology:** the old layout created remotes
> `<pypi>-prod` and `<pypi>-remote` plus a virtual `<pypi>`. Upgrading, terraform
> destroys all three and creates remote `<pypi>`. Because the old virtual and the
> new remote share the same key, destroy the virtual first so the new remote's
> key is free:
>
> ```bash
> terraform destroy -target=artifactory_virtual_pypi_repository.echo_pypi
> ```
>
> then `terraform apply` (or simply apply twice).

### OS packages (Debian)
- `echo_os_packages` (bool, default: `false`) — provision the Debian remote
- `echo_os_packages_url` (string, default: `""`) — the Echo Debian repository URL.
  **Required when `echo_os_packages` is enabled**; there is intentionally no default.
  Copy it from the Integrations page in the Echo platform.
- `echo_deb_repository_name` (string, default: `""` → `<remote_repository_name>-deb`)

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
- `create` (bool, default: `true`)
- `remote_repository_name` (string, default: `"echo"`) — base name; per-format repos derive from it
- `description`, `notes`, `includes_pattern`, `excludes_pattern`, `repo_layout_ref`
- `block_mismatching_mime_types`, `enable_token_authentication` (Docker only)
- `store_artifacts_locally`, `socket_timeout_millis`, `retrieval_cache_period_seconds`,
  `missed_cache_period_seconds`, `hard_fail`, `offline`, `bypass_head_requests`,
  `priority_resolution`, `xray_index`, `property_sets`

## Outputs
- `usage_instructions` — per-format pull/install instructions (replace `<your-jfrog-domain>`)
- `image_repository_key` — Docker remote key (or `null`)
- `library_repository_keys` — list of created library remote keys
- `os_package_repository_key` — Debian remote key (or `null`)

## Example — custom repository names

```hcl
module "echo_jfrog_mirror" {
  source = "./echo-terraform-jfrog-mirror"

  remote_repository_name = "echo"

  echo_images          = true
  echo_image_key_name  = var.echo_image_key_name
  echo_image_key_value = var.echo_image_key_value

  echo_library_pypi          = true
  echo_pypi_repository_name  = "echo-python" # overrides the default "echo-pypi"
  echo_library_key_name      = var.echo_library_key_name
  echo_library_key_value     = var.echo_library_key_value
}
```

## Provider Configuration
```hcl
provider "artifactory" {
  url          = "https://your-artifactory.com/artifactory"
  access_token = var.artifactory_access_token
}
```
