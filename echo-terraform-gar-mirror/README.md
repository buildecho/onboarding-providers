# Echo GAR Remote Repository - Terraform Module

Purpose: Minimal GAR remote repository to integrate with the Echo registry.

## Quickstart

```hcl
module "echo_gar_remote" {
  source = "git@github.com:buildecho/onboarding-providers.git//echo-terraform-gar-mirror"

  project_id            = "my-gcp-project"
  echo_access_key_name  = "my-echo-key-name"
  echo_access_key_value = "my-echo-key-value"
  # location and cache_repository_name default to "us-central1" and "echo"
}
```

```bash
terraform init && terraform apply -auto-approve
```

## Inputs
- `create` (bool, default: `true`)
- `project_id` (string, required)
- `location` (string, default: `us-central1`)
- `repository_name` (string, default: `echo`)
- `description` (string, optional)
- `echo_registry_url` (string, default: `https://reg.echohq.com`)
- `echo_access_key_name` (string, required)
- `echo_access_key_value` (string, required, sensitive)
- `echo_access_key_secret_name` (string, default: `echo-gar-mirror-secret`)
- `reader_members` (list(string), optional)
- `writer_members` (list(string), optional)
- `labels` (map(string), optional)

## Outputs
- `repository_id`: The ID of the created Artifact Registry repository
- `repository_name`: The name of the created Artifact Registry repository
- `secret_id`: The ID of the created secret containing the Echo access key
- `secret_version`: The full resource name of the secret version
- `usage_instructions`: Instructions for using the GAR remote repository

## Example usage
```hcl
module "echo_gar_remote" {
  source = "./echo-terraform-gar-mirror"
  project_id            = "my-gcp-project"
  echo_access_key_name  = "my-echo-key-name"
  echo_access_key_value = "my-echo-key-value"
}

output "how_to_use" {
  value = module.echo_gar_remote.usage_instructions
}
```

## Test
```bash
gcloud auth configure-docker <location>-docker.pkg.dev
docker pull <location>-docker.pkg.dev/<project_id>/<cache_repository_name>/<image>:<tag>
```
