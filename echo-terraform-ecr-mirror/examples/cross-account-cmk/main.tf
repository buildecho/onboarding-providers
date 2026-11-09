# KMS key owned by a DIFFERENT account (e.g. a central security account).
#
#   key owner account: modules/kms-key-owner creates the key with a policy
#     that allows the consumer's repository creation role.
#   consumer account:  the main module uses the key ARN and creates the role
#     with matching IAM permissions.
#
# Both accounts must use the same Region. The two halves can also live in
# separate configurations/pipelines; the key policy does not require the
# consumer role to exist first.
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
  alias   = "consumer"
  region  = var.region
  profile = var.consumer_profile
}

provider "aws" {
  alias   = "key_owner"
  region  = var.region
  profile = var.key_owner_profile

  dynamic "assume_role" {
    for_each = var.key_owner_assume_role_arn == null ? [] : [var.key_owner_assume_role_arn]
    content {
      role_arn = assume_role.value
    }
  }
}

data "aws_caller_identity" "consumer" {
  provider = aws.consumer
}

locals {
  creation_role_name = "${var.cache_namespace}-repo-creation-role"
}

module "echo_kms_key_owner" {
  source    = "../../modules/kms-key-owner"
  providers = { aws = aws.key_owner }

  consumer_account_id         = data.aws_caller_identity.consumer.account_id
  consumer_creation_role_name = local.creation_role_name
  kms_key_alias               = "alias/${var.cache_namespace}"
}

module "echo_ecr_cache" {
  source    = "../../"
  providers = { aws = aws.consumer }

  echo_registry_account_id = var.echo_registry_account_id
  cache_namespace          = var.cache_namespace
  role_name                = "${var.cache_namespace}-ptc-role"
  policy_name              = "${var.cache_namespace}-ptc-policy"

  create_repository_creation_template = true
  encryption_type                     = "KMS"
  kms_key_arn                         = module.echo_kms_key_owner.kms_key_arn
  creation_role_name                  = local.creation_role_name
}

output "how_to_use" {
  value = module.echo_ecr_cache.usage_instructions
}

output "kms_key_arn" {
  value = module.echo_ecr_cache.kms_key_arn
}

output "kms_key_is_cross_account" {
  value = module.echo_ecr_cache.kms_key_is_cross_account
}
