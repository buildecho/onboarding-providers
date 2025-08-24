# Echo ECR Pull-Through Cache - Terraform Module

Purpose: Minimal ECR pull-through cache rule to integrate with the Echo registry.

## Quickstart

```hcl
module "echo_ecr_cache" {
  source = "./echo-terraform-ecr-mirror"

  echo_registry_account_id = "123456789012"
  echo_registry_region     = "us-east-1" # default
  cache_namespace          = "echo"       # default
}
```

```bash
terraform init && terraform apply -auto-approve
```

## Inputs
- `create` (bool, default: `true`)
- `echo_registry_account_id` (string, required)
- `echo_registry_region` (string, default: `us-east-1`)
- `cache_namespace` (string, default: `echo`)
- `role_name` (string, default: `echo-ecr-mirror-role`)
- `policy_name` (string, default: `echo-ecr-mirror-policy`)
- `tags` (map(string), optional)

## Outputs
- `role_arn`: ARN of the ECR access role
- `policy_arn`: ARN of the ECR access policy
- `usage_instruction`: Single-line docker pull command template
## Example usage
```hcl
module "echo_ecr_cache" {
  source = "./echo-terraform-ecr-mirror"
  echo_registry_account_id = "123456789012"
}

output "how_to_use" {
  value = module.echo_ecr_cache.usage_instruction
}
```

## Test
```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region)
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
docker pull "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/<cache_namespace>/<image>:<tag>"
```
