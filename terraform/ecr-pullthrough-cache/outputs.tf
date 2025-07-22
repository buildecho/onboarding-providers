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
  value       = var.create ? var.cache_rule_name : null
}

output "usage_instructions" {
  description = "Instructions for using the pullthrough cache"
  value = var.create ? (
    <<-EOT
To pull images through this cache, use:
docker pull ${data.aws_caller_identity.current.account_id}.dkr.ecr.${data.aws_region.current.name}.amazonaws.com/${var.repository_prefix}/[REPOSITORY_NAME]:[TAG]

Example:
docker pull ${data.aws_caller_identity.current.account_id}.dkr.ecr.${data.aws_region.current.name}.amazonaws.com/${var.repository_prefix}/my-app:latest

Note: For cross-account access, ensure the upstream registry has the appropriate registry permissions policy.
EOT
  ) : null
}
