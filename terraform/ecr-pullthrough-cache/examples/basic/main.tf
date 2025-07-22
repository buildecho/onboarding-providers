terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = var.aws_region
}

# Use the ECR pull-through cache module
module "ecr_pullthrough_cache" {
  source = "../.."

  create                     = true
  cache_rule_name            = var.cache_rule_name
  repository_prefix          = var.repository_prefix
  source_registry_account_id = var.source_registry_account_id
  source_registry_region     = var.source_registry_region

  tags = var.tags
}

# Variables
variable "aws_region" {
  type        = string
  description = "AWS region where resources will be created"
  default     = "us-east-1"
}

variable "cache_rule_name" {
  type        = string
  description = "Name for the ECR pull-through cache rule"
  default     = "echo-cache"
}

variable "repository_prefix" {
  type        = string
  description = "Repository prefix for the cache rule"
  default     = "echo"
}

variable "source_registry_account_id" {
  type        = string
  description = "AWS account ID of the source ECR registry"
}

variable "source_registry_region" {
  type        = string
  description = "AWS region of the source ECR registry"
  default     = "us-east-1"
}

variable "tags" {
  type        = map(string)
  description = "Tags to apply to all resources"
  default = {
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# Outputs
output "cache_rule_registry_id" {
  description = "The registry ID of the pull-through cache rule"
  value       = module.ecr_pullthrough_cache.cache_rule_registry_id
}

output "cache_rule_upstream_registry_url" {
  description = "The upstream registry URL of the pull-through cache rule"
  value       = module.ecr_pullthrough_cache.cache_rule_upstream_registry_url
}

output "iam_role_arn" {
  description = "ARN of the IAM role used for ECR access"
  value       = module.ecr_pullthrough_cache.iam_role_arn
}
