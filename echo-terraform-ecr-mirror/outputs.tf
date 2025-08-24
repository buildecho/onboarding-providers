# Data sources for dynamic values in outputs
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}


output "repository_prefix" {
  description = "Repository prefix for cached images"
  value       = var.create ? var.repository_prefix : null
}

output "upstream_registry_url" {
  description = "Echo registry URL"
  value       = var.create ? "${var.source_registry_account_id}.dkr.ecr.${var.source_registry_region}.amazonaws.com" : null
}

output "access_role_arn" {
  description = "ARN of the ECR access role"
  value       = var.create ? aws_iam_role.ecr_access[0].arn : null
}

output "cache_rule_name" {
  description = "Name of the pullthrough cache rule"
  value       = var.create ? local.cache_rule_name : null
}

output "iam_policy_arn" {
  description = "ARN of the IAM policy for ECR access"
  value       = var.create ? aws_iam_role_policy.ecr_pullthrough_cache[0].arn : null
}

output "resource_prefix" {
  description = "The resource prefix used for naming resources"
  value       = var.create ? var.resource_prefix : null
}

output "resource_arns" {
  description = "ARNs of all resources created by this module"
  value = var.create ? {
    iam_role_arn          = aws_iam_role.ecr_access[0].arn
    iam_policy_arn        = aws_iam_role_policy.ecr_pullthrough_cache[0].arn
    pullthrough_cache_arn = "arn:aws:ecr:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:pull-through-cache-rule/${local.cache_rule_name}"
  } : null
}

output "usage_instructions" {
  description = "Instructions for using the pullthrough cache"
  value = var.create ? (
    <<-EOT
# Echo ECR Pull-Through Cache Setup Complete!

## 🚀 Quick Start
To pull images through this cache, use:
```bash
docker pull ${data.aws_caller_identity.current.account_id}.dkr.ecr.${data.aws_region.current.name}.amazonaws.com/${var.repository_prefix}/[REPOSITORY_NAME]:[TAG]
```

## 📋 Examples
```bash
# Pull a sample image
docker pull ${data.aws_caller_identity.current.account_id}.dkr.ecr.${data.aws_region.current.name}.amazonaws.com/${var.repository_prefix}/my-app:latest

# List cached repositories
aws ecr describe-repositories --repository-names ${var.repository_prefix}/my-app

# Get login token
aws ecr get-login-password --region ${data.aws_region.current.name} | docker login --username AWS --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.${data.aws_region.current.name}.amazonaws.com
```

## 🔧 Configuration
- **Cache Rule Name**: ${local.cache_rule_name}
- **Repository Prefix**: ${var.repository_prefix}
- **Region**: ${data.aws_region.current.name}
- **Account ID**: ${data.aws_caller_identity.current.account_id}

## 📝 Notes
- First pull will create the cached repository automatically
- Subsequent pulls will be served from the cache for faster access
- For cross-account access, ensure proper IAM permissions and registry policies
EOT
  ) : null
}
