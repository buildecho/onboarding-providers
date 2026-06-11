# Echo GAR Remote Repository - Terraform Module

Configures Google Artifact Registry as a proxy for Echo. One module provisions a
Docker remote for **images** and/or PyPI (PYTHON) / npm (NPM) / Maven (MAVEN)
remotes for **libraries**, based on the inputs. Each repository is created only
when its flag is set. Credentials are stored in Secret Manager; the image key
and the library key are distinct secrets.

## Quickstart

```hcl
module "echo_gar_mirror" {
  source = "git@github.com:buildecho/onboarding-providers.git//echo-terraform-gar-mirror"

  project_id = "my-gcp-project"

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
  value = module.echo_gar_mirror.usage_instructions
}
```

```bash
terraform init && terraform apply
```

## Inputs

### Images (container registry)
- `echo_images` (bool, default: `false`) — provision the Docker remote
- `echo_image_key_name` / `echo_image_key_value` (string, sensitive) — image access key
- `echo_image_repository_name` (string, default: `""` → `repository_name`)
- `echo_registry_url` (string, default: `"https://reg.echohq.com"`)
- `echo_access_key_secret_name` (string, default: `"echo-gar-mirror-secret"`) — Secret Manager secret name for the image key
- `echo_access_key_name` / `echo_access_key_value` — **deprecated**, kept for backwards
  compatibility; when set (and the new image fields are empty) they provision the
  Docker remote using the image fields.

### Libraries (package registries — one shared library key)
> **Disabled for now.** The library proxy resources are commented out in `main.tf`; these inputs are accepted but provision nothing until libraries are turned on.

- `echo_library_pypi` / `echo_library_npm` / `echo_library_maven` (bool, default: `false`)
- `echo_library_key_name` / `echo_library_key_value` (string, sensitive) — library access key
- `echo_library_key_secret_name` (string, default: `"echo-gar-mirror-library-secret"`) — Secret Manager secret name for the library key
- `echo_pypi_url` (default: `"https://pypi.echohq.com"`)
- `echo_npm_url` (default: `"https://npm.echohq.com"`)
- `echo_maven_url` (default: `"https://maven.echohq.com"`)
- `echo_pypi_repository_name` / `echo_npm_repository_name` / `echo_maven_repository_name`
  (string, default: `""` → `<repository_name>-{pypi,npm,maven}`)

### Shared
- `create` (bool, default: `true`)
- `project_id` (string, required)
- `location` (string, default: `us-central1`)
- `repository_name` (string, default: `echo`) — base name; per-format repos derive from it
- `description` (string, optional)
- `reader_members` (list(string), optional) — granted reader on every created repo
- `writer_members` (list(string), optional) — granted writer on every created repo
- `labels` (map(string), optional)

## Outputs
- `usage_instructions` — per-format pull/install instructions for the created repos
- `image_repository_key` — Docker remote repository id (or `null`)
- `library_repository_keys` — list of created library remote repository ids
- `repository_id` / `repository_name` — Docker remote repository id/name (or `null`)
- `secret_id` / `secret_version` — image secret id and version name (or `null`)
- `library_secret_id` — library secret id (or `null`)

## Example — custom repository names

```hcl
module "echo_gar_mirror" {
  source = "./echo-terraform-gar-mirror"

  project_id      = "my-gcp-project"
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

## Test
```bash
# Images
gcloud auth configure-docker <location>-docker.pkg.dev
docker pull <location>-docker.pkg.dev/<project_id>/<repository_name>/<image>:<tag>

# Libraries (examples)
pip install --index-url https://<location>-python.pkg.dev/<project_id>/<repository_name>-pypi/simple/ <package>
npm install --registry https://<location>-npm.pkg.dev/<project_id>/<repository_name>-npm/ <package>
```
