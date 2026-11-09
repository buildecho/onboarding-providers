# Default: pull-through cache rule only. ECR creates cache repositories with
# its defaults (AES256, MUTABLE tags, no policies). Identical to the module's
# behaviour before repository creation template support was added.

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
  # In your own configuration use:
  # source = "git@github.com:buildecho/onboarding-providers.git//echo-terraform-ecr-mirror"
  source = "../../"

  echo_registry_account_id = "123456789012"
}

output "how_to_use" {
  value = module.echo_ecr_cache.usage_instructions
}
