# Data sources for dynamic values in outputs
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

output "role_arn" {
  description = "ARN of the ECR access role"
  value       = var.create ? aws_iam_role.ecr_access[0].arn : null
}

output "policy_arn" {
  description = "ARN of the ECR access policy"
  value       = var.create ? aws_iam_role_policy.ecr_pullthrough_cache[0].policy_arn : null
}


output "usage_instruction" {
  description = "Single-line usage instruction for pulling via the mirror"
  value       = var.create ? "docker pull ${data.aws_caller_identity.current.account_id}.dkr.ecr.${data.aws_region.current.name}.amazonaws.com/${var.cache_namespace}/<image>:<tag>" : null
}
