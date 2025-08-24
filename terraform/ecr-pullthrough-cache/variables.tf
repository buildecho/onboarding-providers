variable "create" {
  type        = bool
  description = "Whether to provision the resources under this module"
  default     = true
}

variable "source_registry_account_id" {
  description = "The AWS account ID of the source ECR registry (Echo registry) - Get this from Echo platform"
  type        = string

  validation {
    condition     = can(regex("^[0-9]{12}$", var.source_registry_account_id))
    error_message = "Source registry account ID must be a valid 12-digit AWS account ID."
  }
}

variable "source_registry_region" {
  description = "The AWS region of the source ECR registry (Echo registry) - Get this from Echo platform"
  type        = string
  default     = "us-east-1"

  validation {
    condition = contains([
      "us-east-1"
    ], var.source_registry_region)
    error_message = "Source registry region must be us-east-1."
  }
}

variable "repository_name_prefix" {
  description = "Repository prefix for cached images - This will be the prefix in your registry"
  type        = string
  default     = "echo-mirror"

  validation {
    condition     = can(regex("^[a-z0-9]+([._-][a-z0-9]+)*$", var.repository_name_prefix))
    error_message = "Repository prefix must contain only lowercase letters, numbers, periods, hyphens, and underscores."
  }
}

variable "cache_rule_name" {
  description = "Name for the pullthrough cache rule"
  type        = string
  default     = "echo-mirror-cache-rule"

  validation {
    condition     = can(regex("^[a-z0-9]+([._-][a-z0-9]+)*$", var.cache_rule_name))
    error_message = "Cache rule name must contain only lowercase letters, numbers, periods, hyphens, and underscores."
  }
}

variable "tags" {
  description = "A map of tags to assign to the resources"
  type        = map(string)
  default = {
    ManagedBy = "terraform"
    Purpose   = "echo-registry-integration"
    Component = "pullthrough-cache"
  }
}
