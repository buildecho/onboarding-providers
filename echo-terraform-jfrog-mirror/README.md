# Echo JFrog Artifactory Mirror - Terraform Module

Purpose: Terraform module to configure JFrog Artifactory as a proxy cache for Echo Registry, enabling local caching and faster container image pulls.

## Quickstart

```hcl
module "echo_artifactory_mirror" {
  source = "git@github.com:buildecho/onboarding-providers.git//echo-terraform-jfrog-mirror"

  echo_access_key_name     = var.echo_access_key_name
  echo_access_key_value    = var.echo_access_key_value
}
```

```bash
terraform init && terraform apply -auto-approve
```

## Inputs
- `create` (bool, default: `true`)
- `echo_access_key_name` (string, required)
- `echo_access_key_value` (string, required)
- `repository_name` (string, default: `"echo-mirror"`)
- `echo_registry_url` (string, default: `"https://reg.echohq.com"`)
- `description` (string, default: `"Echo Registry remote repository for container images"`)
- `notes` (string, default: `"Managed by Terraform - Echo Registry integration"`)
- `includes_pattern` (string, default: `"**/*"`)
- `excludes_pattern` (string, default: `""`)
- `repo_layout_ref` (string, default: `"simple-default"`)
- `block_mismatching_mime_types` (bool, default: `true`)
- `enable_token_authentication` (bool, default: `true`)

## Outputs
- `repository_url`: The URL of the created remote repository
- `usage_instructions`: Docker pull command template

## Example Usage
```hcl
module "echo_artifactory_mirror" {
  source = "./echo-terraform-jfrog-mirror"
  
  artifactory_url          = "https://my-company.jfrog.io/artifactory"
  artifactory_access_token = var.artifactory_token
  echo_access_key_name     = var.echo_access_key_name
  echo_access_key_value    = var.echo_access_key_value
  repository_key           = "echo-mirror"
}

output "pull_url" {
  value = module.echo_artifactory_mirror.pull_url
}
```

## Test
```bash
# Configure Docker to use Artifactory
docker login your-artifactory.com

# Pull through Artifactory mirror
docker pull your-artifactory.com/echo-remote/static:latest
```

## Provider Configuration
```hcl
provider "artifactory" {
  url          = "https://your-artifactory.com/artifactory"
  access_token = var.artifactory_access_token
}
```

## Advanced Configuration
```hcl
module "echo_artifactory_mirror" {
  source = "./echo-terraform-jfrog-mirror"

  artifactory_url          = "https://company.jfrog.io/artifactory"
  artifactory_access_token = var.artifactory_token
  echo_access_key_name     = var.echo_access_key_name
  echo_access_key_value    = var.echo_access_key_value
  
  # Custom settings
  repository_key                 = "echo-docker-remote"
  store_artifacts_locally        = true
  retrieval_cache_period_seconds = 7200
  xray_index                     = true
}
``` 
