# Echo Nexus Mirror - Terraform Module

Configures Sonatype Nexus as a proxy for Echo. One module provisions a Docker
proxy for **images** and/or PyPI / npm / Maven proxies for **libraries**, based
on the inputs. Each repository is created only when its flag is set.

## Quickstart

```hcl
module "echo_nexus_mirror" {
  source = "git@github.com:buildecho/onboarding-providers.git//echo-terraform-nexus-mirror"

  # Images
  echo_images          = true
  echo_image_key_name  = var.echo_image_key_name
  echo_image_key_value = var.echo_image_key_value
  docker_http_port     = 2525

  # Libraries (one shared library key)
  echo_library_pypi      = true
  echo_library_npm       = true
  echo_library_key_name  = var.echo_library_key_name
  echo_library_key_value = var.echo_library_key_value
}

output "usage_instructions" {
  value = module.echo_nexus_mirror.usage_instructions
}
```

```bash
terraform init && terraform apply
```

## Inputs

### Images (container registry)
- `echo_images` (bool, default: `false`) — provision the Docker proxy
- `echo_image_key_name` / `echo_image_key_value` (string, sensitive) — image access key
- `echo_image_repository_name` (string, default: `""` → `repository_name`)
- `echo_registry_url` (string, default: `"https://reg.echohq.com"`)
- `docker_http_port` / `docker_https_port` (number, optional)
- `echo_access_key_name` / `echo_access_key_value` — **deprecated**, kept for backwards
  compatibility; when set they provision the Docker proxy using the image fields.

### Libraries (package registries — one shared library key)
> **Disabled for now.** The library proxy resources are commented out in `main.tf`; these inputs are accepted but provision nothing until libraries are turned on.

- `echo_library_pypi` / `echo_library_npm` / `echo_library_maven` (bool, default: `false`)
- `echo_library_key_name` / `echo_library_key_value` (string, sensitive) — library access key
- `echo_pypi_url` (default: `"https://pypi.echohq.com"`)
- `echo_npm_url` (default: `"https://npm.echohq.com"`)
- `echo_maven_url` (default: `"https://maven.echohq.com"`)
- `echo_pypi_repository_name` / `echo_npm_repository_name` / `echo_maven_repository_name`
  (string, default: `""` → `<repository_name>-{pypi,npm,maven}`)
- `maven_version_policy` (string, default: `"MIXED"`) / `maven_layout_policy` (string, default: `"PERMISSIVE"`)

### Shared
- `create` (bool, default: `true`)
- `repository_name` (string, default: `"echo"`) — base name; per-format repos derive from it
- `repository_online`, `blob_store_name`, `strict_content_type_validation`
- `proxy_content_max_age`, `proxy_metadata_max_age`, `negative_cache_enabled`, `negative_cache_ttl`
- `http_client_blocked`, `http_client_auto_block`, `connection_*`, `routing_rule`
- Docker-only: `docker_force_basic_auth`, `docker_v1_enabled`, `docker_index_type`, `docker_index_url`
- `create_content_selector`, `create_repository_privilege`, `tags`

## Outputs
- `usage_instructions` — per-format pull/install instructions (replace `<nexus-host>`)
- `image_repository_key` — Docker proxy name (or `null`)
- `library_repository_keys` — list of created library proxy names

## Example — custom repository names

```hcl
module "echo_nexus_mirror" {
  source = "./echo-terraform-nexus-mirror"

  repository_name = "echo"

  echo_images          = true
  echo_image_key_name  = var.echo_image_key_name
  echo_image_key_value = var.echo_image_key_value

  echo_library_pypi         = true
  echo_pypi_repository_name = "echo-python" # overrides the default "echo-pypi"
  echo_library_key_name     = var.echo_library_key_name
  echo_library_key_value    = var.echo_library_key_value
}
```

## Provider Configuration
```hcl
provider "nexus" {
  url      = "https://your-nexus-host"
  username = var.nexus_username
  password = var.nexus_password
}
```
