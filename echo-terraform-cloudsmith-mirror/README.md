# Echo Cloudsmith Mirror - Terraform Module

Configures Cloudsmith as a proxy/cache for Echo. One module provisions a Docker
repository for **images** and/or PyPI / npm / Maven repositories for
**libraries**, based on the inputs. Each repository (and its upstream) is created
only when its flag is set.

> Terraform + Manual onboarding only. Cloudsmith has no first-class Pulumi
> provider, so there is intentionally no Pulumi module for Cloudsmith.

## Quickstart

```hcl
provider "cloudsmith" {
  api_key = var.cloudsmith_api_key
}

module "echo_cloudsmith_mirror" {
  source = "git@github.com:buildecho/onboarding-providers.git//echo-terraform-cloudsmith-mirror"

  namespace = "your-cloudsmith-org-slug"

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
  value = module.echo_cloudsmith_mirror.usage_instructions
}
```

```bash
terraform init && terraform apply
```

## Inputs

### Images (container registry)
- `echo_images` (bool, default: `false`) — provision the Docker repository + upstream
- `echo_image_key_name` / `echo_image_key_value` (string, sensitive) — image access key (upstream auth)
- `echo_image_repository_name` (string, default: `""` → `repository_name`)
- `echo_registry_url` (string, default: `"https://reg.echohq.com"`)

### Libraries (package registries — one shared library key)
- `echo_library_pypi` / `echo_library_npm` / `echo_library_maven` (bool, default: `false`)
- `echo_library_key_name` / `echo_library_key_value` (string, sensitive) — library access key (upstream auth)
- `echo_pypi_url` (default: `"https://pypi.echohq.com"`)
- `echo_npm_url` (default: `"https://npm.echohq.com"`)
- `echo_maven_url` (default: `"https://maven.echohq.com"`)
- `echo_pypi_repository_name` / `echo_npm_repository_name` / `echo_maven_repository_name`
  (string, default: `""` → `<repository_name>-{pypi,npm,maven}`)

### Shared
- `create` (bool, default: `true`) — master gate for all resources
- `namespace` (string, required) — Cloudsmith organization slug that owns the repositories
- `repository_name` (string, default: `"echo"`) — base slug; per-format repos derive from it
- `description` (string, default: `"Echo mirror repository (managed by Terraform)"`)
- `repository_type` (string, default: `"Private"`) — one of `Public`, `Private`, `Open-Source`
- `upstream_mode` (string, default: `"Cache and Proxy"`) — one of `Proxy Only`, `Cache and Proxy`

## Outputs
- `usage_instructions` — per-format pull/install instructions for created repos
- `image_repository_name` — Docker repository slug (or `null`)
- `library_repository_names` — list of created library repository slugs

## Example — custom repository names

```hcl
module "echo_cloudsmith_mirror" {
  source = "./echo-terraform-cloudsmith-mirror"

  namespace       = "your-cloudsmith-org-slug"
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

The Cloudsmith provider needs an API key (a Cloudsmith user/service API key with
permission to manage repositories in the namespace). Get it from the Cloudsmith
dashboard under your account API settings.

```hcl
provider "cloudsmith" {
  api_key = var.cloudsmith_api_key # or set CLOUDSMITH_API_KEY
}
```

The Echo access keys supplied to `echo_*_key_name` / `echo_*_key_value` are used
as the upstream (`Username and Password`) authentication so Cloudsmith can reach
the Echo endpoints.
