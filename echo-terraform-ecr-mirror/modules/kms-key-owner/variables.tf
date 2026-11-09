variable "consumer_account_id" {
  description = "AWS account ID that runs the Echo ECR pull-through cache (the account whose ECR registry will use this key)."
  type        = string

  validation {
    condition     = can(regex("^[0-9]{12}$", var.consumer_account_id))
    error_message = "consumer_account_id must be a 12-digit AWS account ID."
  }
}

variable "consumer_creation_role_name" {
  description = "Name of the repository creation role in the consumer account. Must match creation_role_name (or the role in creation_role_arn) of the echo-terraform-ecr-mirror module there."
  type        = string
  default     = "echo-ecr-repo-creation-role"

  validation {
    condition     = can(regex("^[a-zA-Z0-9+=,.@_/-]{1,512}$", var.consumer_creation_role_name))
    error_message = "consumer_creation_role_name must be an IAM role name (optionally with a path, e.g. my/path/role-name)."
  }
}

variable "create_kms_key" {
  description = "Create a new KMS key with a key policy that already allows the consumer. Set to false to only render the key policy statement for an existing key (output consumer_key_policy_statement)."
  type        = bool
  default     = true
}

variable "require_ecr_via_service" {
  description = "Add a kms:ViaService = ecr.<region>.amazonaws.com condition to the consumer statement so the key can only be used through ECR. Optional hardening; verify in a non-production account first (see README)."
  type        = bool
  default     = false
}

variable "kms_key_alias" {
  description = "Alias for the created key. Set to null to skip."
  type        = string
  default     = "alias/echo-ecr-mirror"

  validation {
    condition     = try(can(regex("^alias/[a-zA-Z0-9/_-]+$", var.kms_key_alias)) && !startswith(var.kms_key_alias, "alias/aws/"), var.kms_key_alias == null)
    error_message = "kms_key_alias must start with \"alias/\" and must not start with \"alias/aws/\"."
  }
}

variable "kms_key_deletion_window_in_days" {
  description = "Waiting period (7-30 days) before the created key is deleted after it is scheduled for deletion."
  type        = number
  default     = 30

  validation {
    condition     = var.kms_key_deletion_window_in_days >= 7 && var.kms_key_deletion_window_in_days <= 30
    error_message = "kms_key_deletion_window_in_days must be between 7 and 30."
  }
}

variable "kms_key_enable_key_rotation" {
  description = "Enable automatic yearly rotation for the created key."
  type        = bool
  default     = true
}

variable "tags" {
  description = "Tags to apply to the created key."
  type        = map(string)
  default     = {}
}
