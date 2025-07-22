terraform {
  required_version = ">= 1.0"
}

# Basic ECR Pullthrough Cache configuration
module "ecr_pullthrough_cache" {
  source = "../../../terraform/ecr-pullthrough-cache"

  # Required: Echo registry details
  source_registry_account_id = var.source_registry_account_id
  source_registry_region     = var.source_registry_region

  # Optional: Customize the repository prefix
  repository_prefix = var.repository_prefix

  # Optional: Name for the cache rule
  cache_rule_name = var.cache_rule_name

  # Optional: Tags for resources
  tags = var.tags
}

# Output the usage instructions
output "repository_prefix" {
  description = "Repository prefix for cached images"
  value       = module.ecr_pullthrough_cache.repository_prefix
}

output "usage_instructions" {
  description = "How to use the pullthrough cache"
  value       = module.ecr_pullthrough_cache.usage_instructions
}
