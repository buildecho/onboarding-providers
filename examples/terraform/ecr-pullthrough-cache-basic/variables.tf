variable "source_registry_account_id" {
  description = "The AWS account ID of Echo's ECR registry"
  type        = string
  # Example: "123456789012"
}

variable "source_registry_region" {
  description = "The AWS region of Echo's ECR registry"
  type        = string
  default     = "us-east-1"
}

variable "repository_prefix" {
  description = "Prefix for cached repository names"
  type        = string
  default     = "echo"
}

variable "cache_rule_name" {
  description = "Name for the pullthrough cache rule"
  type        = string
  default     = "echo-registry-cache"
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default = {
    Environment = "development"
    ManagedBy   = "terraform"
    Purpose     = "container-registry-integration"
  }
}
