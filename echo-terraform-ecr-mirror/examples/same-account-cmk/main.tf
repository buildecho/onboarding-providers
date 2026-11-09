# Existing customer managed KMS key in the SAME account and Region.
# The module creates the repository creation role and grants it
# kms:CreateGrant / kms:RetireGrant / kms:DescribeKey on the key via IAM.
# This works as long as the key policy delegates to IAM (the default key
# policy's "Enable IAM User Permissions" statement). If your key policy does
# not, add the statement shown in the README.

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
  region = "us-east-1"
}

module "echo_ecr_cache" {
  source = "../../"

  echo_registry_account_id = "123456789012"

  create_repository_creation_template = true
  encryption_type                     = "KMS"
  kms_key_arn                         = "arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"

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
    team = "platform"
  }
}

output "creation_role_arn" {
  value = module.echo_ecr_cache.repository_creation_role_arn
}
