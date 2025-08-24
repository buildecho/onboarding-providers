terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "echo_ecr_cache" {
  source = "../.."

  create                   = true
  echo_registry_account_id = var.echo_registry_account_id
  echo_registry_region     = var.echo_registry_region
  cache_namespace          = var.cache_namespace

  tags = var.tags
}

variable "aws_region" {
  type        = string
  description = "AWS region where resources will be created"
  default     = "us-east-1"
}

variable "echo_registry_account_id" {
  type        = string
  description = "AWS account ID of the Echo registry"
}

variable "echo_registry_region" {
  type        = string
  description = "AWS region of the Echo registry"
  default     = "us-east-1"
}

variable "cache_namespace" {
  type        = string
  description = "Prefix/namespace for cached images"
  default     = "echo"
}

variable "tags" {
  type        = map(string)
  description = "Tags to apply to all resources"
  default = {
    Environment = "production"
    ManagedBy   = "terraform"
    Purpose     = "echo-registry-integration"
    Component   = "pullthrough-cache"
  }
}

output "mirror_url" {
  description = "Base URL of your mirror"
  value       = module.echo_ecr_cache.mirror_url
}

output "access_role_arn" {
  description = "ARN of the ECR access role"
  value       = module.echo_ecr_cache.access_role_arn
}

output "usage_instruction" {
  description = "Single-line docker pull command template"
  value       = module.echo_ecr_cache.usage_instruction
}
