# Echo Harbor Proxy Cache - Terraform Module

Purpose: Harbor proxy cache configuration to integrate with the Echo registry.

## Quickstart

```hcl
module "echo_harbor_cache" {
  source = "./echo-terraform-harbor-mirror"

  echo_access_key_name  = "your-echo-access-key-name"
  echo_access_key_value = "your-echo-access-key-value"
}
```

```bash
terraform init && terraform apply -auto-approve
```

## Inputs
- `create` (bool, default: `true`)
- `resource_prefix` (string, default: `echo-mirror`)
- `registry_name` (string, default: `echo-registry`)  
- `project_name` (string, default: `echo`)
- `echo_registry_url` (string, default: `https://reg.echohq.com`)
- `echo_access_key_name` (string, required)
- `echo_access_key_value` (string, required)
- `registry_description` (string, default: `Echo Registry`)
- `project_public` (bool, default: `false`)
- `vulnerability_scanning` (bool, default: `true`)
- `enable_content_trust` (bool, default: `false`)
- `enable_content_trust_cosign` (bool, default: `false`)
- `auto_sbom_generation` (bool, default: `false`)

## Outputs
- `registry_id`: The ID of the Harbor registry
- `registry_name`: The name of the Harbor registry
- `project_id`: The ID of the Harbor project
- `project_name`: The name of the Harbor project
- `usage_instructions`: Single-line docker pull command template

## Example usage
```hcl
module "echo_harbor_cache" {
  source = "./echo-terraform-harbor-mirror"
  
  echo_access_key_name  = var.echo_access_key_name
  echo_access_key_value = var.echo_access_key_value
}

output "how_to_use" {
  value = module.echo_harbor_cache.usage_instructions
}
```

## Test
```bash
# Pull through Harbor proxy cache:
docker pull <harbor-instance>/echo/<image>:<tag>
``` 
