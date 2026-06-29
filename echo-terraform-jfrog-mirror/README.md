# Echo JFrog Artifactory Mirror - Terraform Module

Configures JFrog Artifactory as a proxy for Echo. One module provisions a Docker
remote for **images** and/or PyPI / npm / Maven remotes for **libraries**, based
on the inputs. Each repository is created only when its flag is set.

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
  echo_library_key_name  = var.echo_library_key_name
  echo_library_key_value = var.echo_library_key_value
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
- `echo_library_pypi` / `echo_library_npm` / `echo_library_maven` (bool, default: `false`)
- `echo_library_key_value` (string, sensitive) — library access key (the password).
- `echo_library_key_name` (string, sensitive) — the Echo library access-key **subject**
  (`et-<id>`) used as the Basic auth username. Required: JFrog remotes send credentials
  preemptively, so the correct subject authenticates.
- `echo_pypi_base_url` (default: `"https://packages.echohq.com/artifactory"`) — Echo host
  backing the PyPI remotes
- `echo_pypi_prod_repo` (default: `"prod-pypi"`) — Echo first-party local repo
- `echo_pypi_remote_repo` (default: `"pypi-remote"`) — Echo upstream cache repo
- `echo_pypi_url` — **deprecated**, replaced by `echo_pypi_base_url` + the repo split
- `echo_npm_url` (default: `"https://npm.echohq.com"`)
- `echo_maven_url` (default: `"https://maven.echohq.com"`)
- `echo_pypi_repository_name` / `echo_npm_repository_name` / `echo_maven_repository_name`
  (string, default: `""` → `<remote_repository_name>-{pypi,npm,maven}`)

> **PyPI topology:** a JFrog pypi remote cannot point at a virtual, so enabling
> `echo_library_pypi` creates **two smart remotes** (`<pypi>-prod`, `<pypi>-remote`)
> aggregated by **one virtual** (`<pypi>`). pip resolves against the virtual. npm and
> Maven remain single smart remotes.

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
