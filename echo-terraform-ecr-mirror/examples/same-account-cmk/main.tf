# Existing customer managed KMS key in the SAME account and Region.
# The module creates the repository creation role and grants it
# kms:CreateGrant / kms:RetireGrant / kms:DescribeKey on the key via IAM.
# This works as long as the key policy delegates to IAM (the default key
# policy's "Enable IAM User Permissions" statement).
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
  kms_key_arn                         = var.kms_key_arn
  creation_role_name                  = "${var.cache_namespace}-repo-creation-role"

  lifecycle_policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Expire untagged images after 14 days"
      selection = {
        tagStatus   = "untagged"
        countType   = "sinceImagePushed"
        countUnit   = "days"
        countNumber = 14
      }
      action = { type = "expire" }
    }]
  })

  repository_tags = {
    managed-by = "echo-terraform-ecr-mirror"
  }
}

output "how_to_use" {
  value = module.echo_ecr_cache.usage_instructions
}

output "creation_role_arn" {
  value = module.echo_ecr_cache.repository_creation_role_arn
}
