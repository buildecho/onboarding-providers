# KMS key owned by a DIFFERENT account (e.g. a central security account).
#
#   key owner account (222233334444): modules/kms-key-owner creates the key
#     with a policy that allows the consumer's repository creation role.
#   consumer account  (111122223333): the main module uses the key ARN and
#     creates the role with matching IAM permissions.
#
# Both accounts must use the same Region. The two halves can also live in
# separate configurations/pipelines; the key policy does not require the
# consumer role to exist first.

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
  alias  = "consumer"
  region = "us-east-1"
}

provider "aws" {
  alias  = "key_owner"
  region = "us-east-1"

  assume_role {
    role_arn = "arn:aws:iam::222233334444:role/terraform"
  }
}

module "echo_kms_key_owner" {
  source    = "../../modules/kms-key-owner"
  providers = { aws = aws.key_owner }

  consumer_account_id         = "111122223333"
  consumer_creation_role_name = "echo-ecr-repo-creation-role"
}

module "echo_ecr_cache" {
  source    = "../../"
  providers = { aws = aws.consumer }

  echo_registry_account_id = "123456789012"

  create_repository_creation_template = true
  encryption_type                     = "KMS"
  kms_key_arn                         = module.echo_kms_key_owner.kms_key_arn
  creation_role_name                  = "echo-ecr-repo-creation-role"
}

output "kms_key_is_cross_account" {
  value = module.echo_ecr_cache.kms_key_is_cross_account
}
