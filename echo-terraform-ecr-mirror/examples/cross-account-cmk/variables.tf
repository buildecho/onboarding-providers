variable "region" {
  description = "AWS Region of the ECR registry that runs the pull-through cache."
  type        = string
  default     = "us-east-1"
}

variable "echo_registry_account_id" {
  description = "Echo registry account ID (provided by Echo)."
  type        = string
}

variable "cache_namespace" {
  description = "Pull-through cache prefix. IAM role, policy and KMS alias names are derived from it, so examples applied in the same account do not collide."
  type        = string
  default     = "echo-tf-cross-account-cmk"
}

variable "key_owner_profile" {
  description = "AWS CLI profile for the KMS key owner account (null = default credentials)."
  type        = string
  default     = null
}

variable "key_owner_assume_role_arn" {
  description = "Optional role to assume in the KMS key owner account."
  type        = string
  default     = null
}

variable "consumer_profile" {
  description = "AWS CLI profile for the pull-through cache (consumer) account (null = default credentials)."
  type        = string
  default     = null
}
