# Data sources for dynamic values in outputs
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

output "role_arn" {
  description = "ARN of the ECR access role"
  value       = var.create ? try(aws_iam_role.ecr_access[0].arn, null) : null
}

output "usage_instructions" {
  description = "Usage instructions for pulling via the mirror"
  value       = var.create ? "docker pull ${data.aws_caller_identity.current.account_id}.dkr.ecr.${data.aws_region.current.region}.amazonaws.com/${var.cache_namespace}/<image>:<tag>" : null
}

output "repository_creation_template_prefix" {
  description = "Prefix of the managed repository creation template (equals cache_namespace), or null when no template is managed"
  value       = one(aws_ecr_repository_creation_template.this[*].prefix)
}

output "repository_creation_role_arn" {
  description = "ARN of the role ECR assumes to create cache repositories (module-created or supplied), or null when not required"
  value       = local.creation_role_arn
}

output "kms_key_arn" {
  description = "ARN of the KMS key used to encrypt new cache repositories, or null when encryption_type = AES256"
  value       = local.kms_key_arn
}

output "kms_key_is_cross_account" {
  description = "True when kms_key_arn is owned by a different AWS account than this registry (the key owner must update the key policy; see README)"
  value       = local.kms_key_arn_account != null && local.kms_key_arn_account != local.account_id
}
