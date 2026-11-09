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
  default     = "echo-tf-same-account-cmk"
}

variable "kms_key_arn" {
  description = "Full ARN of an existing KMS key in this account and Region."
  type        = string
}
