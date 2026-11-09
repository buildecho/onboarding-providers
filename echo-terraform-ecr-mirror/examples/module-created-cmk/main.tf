# The module creates a customer managed KMS key (with rotation and an alias)
# whose key policy allows the module-created repository creation role.

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
  create_kms_key                      = true
  kms_key_alias                       = "alias/echo-ecr-mirror"
}

output "kms_key_arn" {
  value = module.echo_ecr_cache.kms_key_arn
}
