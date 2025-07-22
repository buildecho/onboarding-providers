variable "create" {
  type        = bool
  description = "Whether to provision the resources under this module"
  default     = true
}

variable "echo_registry_account_id" {
  description = "The AWS account ID of the Echo ECR registry (12 digits)"
  type        = string

  validation {
    condition     = can(regex("^[0-9]{12}$", var.echo_registry_account_id))
    error_message = "Echo registry account ID must be a valid 12-digit AWS account ID."
  }
}

variable "echo_registry_region" {
  description = "The AWS region of the Echo ECR registry"
  type        = string
  default     = "us-east-1"

  validation {
    condition = contains([
      "us-east-1"
    ], var.echo_registry_region)
    error_message = "Echo registry region must be us-east-1."
  }
}

variable "cache_namespace" {
  description = "Namespace/prefix for cached repositories in your ECR"
  type        = string
  default     = "echo"

  validation {
    condition     = can(regex("^[a-z0-9]+([._-][a-z0-9]+)*$", var.cache_namespace))
    error_message = "Cache namespace must contain only lowercase letters, numbers, periods, hyphens, and underscores."
  }
}

variable "role_name" {
  description = "Prefix for all resource names created by this module"
  type        = string
  default     = "echo-ecr-mirror-role"

  validation {
    condition     = can(regex("^[a-z0-9]+([._-][a-z0-9]+)*$", var.role_name))
    error_message = "Role name must contain only lowercase letters, numbers, periods, hyphens, and underscores."
  }
}

variable "policy_name" {
  description = "Name for the IAM policy that will be created."
  type        = string
  default     = "echo-ecr-mirror-policy"

  validation {
    condition     = can(regex("^[a-z0-9]+([._-][a-z0-9]+)*$", var.policy_name))
    error_message = "Policy name must contain only lowercase letters, numbers, periods, hyphens, and underscores."
  }
}

variable "tags" {
  description = "A map of tags to assign to the resources"
  type        = map(string)
  default     = {}
}
