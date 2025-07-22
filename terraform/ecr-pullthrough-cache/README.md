# ECR Pullthrough Cache - Terraform Module

This Terraform module creates an ECR pullthrough cache rule to integrate with Echo registry.

## Prerequisites

- Echo's AWS Account ID (provided by Echo team)
- Terraform >= 1.0
- AWS CLI configured with appropriate credentials

## Quick Start

```hcl
module "ecr_pullthrough_cache" {
  source = "github.com/buildecho/onboarding-providers/terraform/ecr-pullthrough-cache"
  
  source_registry_account_id = "123456789012"  # Replace with Echo's account ID
  source_registry_region     = "us-east-1"     # Echo's region
}
```

Deploy:
```bash
terraform init
terraform plan
terraform apply
```

## Module Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `create` | Whether to provision the resources under this module | ❌ | `true` |
| `source_registry_account_id` | Echo's AWS account ID (12 digits) | ✅ | - |
| `source_registry_region` | Echo's AWS region | ❌ | `us-east-1` |
| `repository_prefix` | Prefix for cached repository names | ❌ | `echo` |
| `cache_rule_name` | Name for the pullthrough cache rule | ❌ | `echo-registry-cache` |
| `tags` | Tags to apply to resources | ❌ | `{}` |

## Module Outputs

| Name | Description |
|------|-------------|
| `pullthrough_cache_rule_arn` | ARN of the created cache rule |
| `repository_prefix` | The prefix used for cached repositories |
| `upstream_registry_url` | Echo registry URL |
| `access_role_arn` | ARN of the access role |
| `usage_instructions` | Docker pull command examples |

## Examples

### Basic Usage

```hcl
module "ecr_pullthrough_cache" {
  source = "./terraform/ecr-pullthrough-cache"
  
  source_registry_account_id = "123456789012"
}
```

### Advanced Configuration

```hcl
module "ecr_pullthrough_cache" {
  source = "./terraform/ecr-pullthrough-cache"
  
  source_registry_account_id = "123456789012"
  source_registry_region     = "us-east-1"
  repository_prefix          = "echo-prod"
  cache_rule_name           = "production-echo-cache"
  
  tags = {
    Environment = "production"
    ManagedBy   = "terraform"
  }
}
```

### Conditional Creation

```hcl
module "ecr_pullthrough_cache" {
  source = "./terraform/ecr-pullthrough-cache"
  
  create = var.enable_echo_integration  # Conditionally create resources
  
  source_registry_account_id = "123456789012"
  source_registry_region     = "us-east-1"
}
```

## Test the Integration

```bash
# Get usage instructions
terraform output usage_instructions

# Login to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin \
  your-account.dkr.ecr.your-region.amazonaws.com

# Pull an image
docker pull your-account.dkr.ecr.your-region.amazonaws.com/echo/test-image:latest
```

## Troubleshooting

### Import Existing Resources
```bash
terraform import module.ecr_pullthrough_cache.aws_ecr_pullthrough_cache_rule.this echo
```

### Enable Debug Logging
```bash
export TF_LOG=DEBUG
terraform apply
```

### Common Issues

- **Cache rule already exists**: Import existing rule or delete it first
- **Access denied**: Verify AWS credentials and IAM permissions
- **Apply failed**: Check debug logs and ensure all inputs are correct

## Support

For issues:
1. Check `terraform show` for current state
2. Review the [ECR Integration Guide](../../docs/integrations/ecr.md)
3. Contact Echo support with terraform outputs and error messages 