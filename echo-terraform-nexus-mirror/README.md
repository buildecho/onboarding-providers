# Echo Nexus Mirror - Terraform Module

Purpose: Minimal Nexus Docker proxy repository to integrate with the Echo registry.

## Quickstart

```hcl
module "nexus_echo_proxy" {
  source = "./echo-terraform-nexus-mirror"

  echo_access_key_name  = "your-echo-access-key-name"
  echo_access_key_value = "your-echo-access-key-value"
}
```

```bash
terraform init && terraform apply -auto-approve
```

## Inputs
- `create` (bool, default: `true`)
- `echo_registry_url` (string, default: `https://reg.echohq.com`)
- `echo_access_key_name` (string, required, sensitive)
- `echo_access_key_value` (string, required, sensitive)
- `repository_name` (string, default: `echo`)
- `repository_online` (bool, default: `true`)
- `docker_force_basic_auth` (bool, default: `true`)
- `docker_http_port` (number, optional)
- `docker_https_port` (number, optional)
- `docker_v1_enabled` (bool, default: `false`)
- `docker_index_type` (string, default: `REGISTRY`)
- `docker_index_url` (string, optional)
- `blob_store_name` (string, default: `default`)
- `strict_content_type_validation` (bool, default: `true`)
- `proxy_content_max_age` (number, default: `1440`)
- `proxy_metadata_max_age` (number, default: `1440`)
- `http_client_blocked` (bool, default: `false`)
- `http_client_auto_block` (bool, default: `true`)
- `connection_retries` (number, default: `3`)
- `connection_timeout` (number, default: `60`)
- `negative_cache_enabled` (bool, default: `true`)
- `negative_cache_ttl` (number, default: `1440`)
- `create_content_selector` (bool, default: `false`)
- `create_repository_privilege` (bool, default: `false`)
- `tags` (map(string), optional)

## Outputs
- `repository_name`: Name of the created Docker proxy repository
- `usage_instructions`: Example Docker pull command

## Example usage
```hcl
module "nexus_echo_proxy" {
  source = "./echo-terraform-nexus-mirror"
  
  echo_access_key_name  = var.echo_access_key_name
  echo_access_key_value = var.echo_access_key_value
}

output "how_to_use" {
  value = module.nexus_echo_proxy.usage_instructions
}
```

## Test
```bash
# Get usage instructions
terraform output how_to_use

# Example: docker pull <nexus-host>/<repository_name>/image:tag
``` 
