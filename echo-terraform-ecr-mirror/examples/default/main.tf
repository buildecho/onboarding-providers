# Default: pull-through cache rule only. ECR creates cache repositories with
# its defaults (AES256, MUTABLE tags, no policies). Identical to the module's
# behaviour before repository creation template support was added.
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
  # In your own configuration use:
  # source = "git@github.com:buildecho/onboarding-providers.git//echo-terraform-ecr-mirror"
  source = "../../"

  echo_registry_account_id = var.echo_registry_account_id
  cache_namespace          = var.cache_namespace
  role_name                = "${var.cache_namespace}-ptc-role"
  policy_name              = "${var.cache_namespace}-ptc-policy"
}

output "how_to_use" {
  value = module.echo_ecr_cache.usage_instructions
}
