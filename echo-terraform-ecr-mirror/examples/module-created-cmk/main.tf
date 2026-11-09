# The module creates a customer managed KMS key (with rotation and an alias)
# whose key policy allows the module-created repository creation role.
#
#   cp terraform.tfvars.example terraform.tfvars   # fill in values
#   terraform init && terraform apply

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.0"
    }
  }
}

provider "aws" {
  region = var.region
}

module "echo_ecr_cache" {
  source = "../../"

  echo_registry_account_id = var.echo_registry_account_id
  cache_namespace          = var.cache_namespace
  role_name                = "${var.cache_namespace}-ptc-role"
  policy_name              = "${var.cache_namespace}-ptc-policy"

  create_repository_creation_template = true
  encryption_type                     = "KMS"
  create_kms_key                      = true
  kms_key_alias                       = "alias/${var.cache_namespace}"
  creation_role_name                  = "${var.cache_namespace}-repo-creation-role"
}

output "how_to_use" {
  value = module.echo_ecr_cache.usage_instructions
}

output "kms_key_arn" {
  value = module.echo_ecr_cache.kms_key_arn
}
