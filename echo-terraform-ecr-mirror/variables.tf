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

# -----------------------------------------------------------------------------
# Repository creation template (optional)
#
# ECR creates a cache repository the first time an image is pulled through the
# rule. A repository creation template whose prefix equals `cache_namespace`
# controls the settings of those repositories. Templates only affect
# repositories created AFTER the template exists.
# -----------------------------------------------------------------------------

variable "create_repository_creation_template" {
  description = <<-EOT
    Whether to manage an ECR repository creation template for the cache namespace
    (prefix = cache_namespace, applied_for = PULL_THROUGH_CACHE). Required for every
    other repository-template input below. When false (default), ECR creates cache
    repositories with its defaults: AES256 encryption, MUTABLE tags, no policies.
  EOT
  type        = bool
  default     = false
}

variable "repository_creation_template_description" {
  description = "Description of the repository creation template (max 256 characters)."
  type        = string
  default     = "Echo pull-through cache repositories (managed by echo-terraform-ecr-mirror)"

  validation {
    condition     = length(var.repository_creation_template_description) <= 256
    error_message = "Input repository_creation_template_description must be at most 256 characters."
  }
}

variable "encryption_type" {
  description = <<-EOT
    Encryption for new cache repositories: "AES256" (default, ECR-managed S3 keys) or
    "KMS" (customer managed KMS key). With "KMS", set exactly one of `kms_key_arn` or
    `create_kms_key = true`.
  EOT
  type        = string
  default     = "AES256"

  validation {
    condition     = contains(["AES256", "KMS"], var.encryption_type)
    error_message = "Input encryption_type must be \"AES256\" or \"KMS\". (KMS_DSSE is only available in AWS GovCloud, where the Echo registry cannot be used as an upstream.)."
  }
}

variable "kms_key_arn" {
  description = <<-EOT
    Full ARN of an existing customer managed KMS key used when encryption_type = "KMS".
    The key must be in the same Region as this ECR registry. It may be owned by this
    account or by another AWS account (see README "Cross-account KMS key").
    Aliases and key IDs are not accepted by ECR creation templates.
  EOT
  type        = string
  default     = null

  validation {
    condition     = var.kms_key_arn == null || can(regex("^arn:aws[a-z0-9-]*:kms:[a-z0-9-]+:[0-9]{12}:key/[a-zA-Z0-9-]+$", var.kms_key_arn))
    error_message = "Input kms_key_arn must be a full KMS key ARN, e.g. arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab. Aliases (alias/...) and bare key IDs are not supported by ECR repository creation templates."
  }
}

variable "create_kms_key" {
  description = "Create a customer managed KMS key in this account (with a key policy that allows the repository creation role) and use it for the cache repositories. Requires encryption_type = \"KMS\"."
  type        = bool
  default     = false
}

variable "kms_key_alias" {
  description = "Alias for the KMS key created when create_kms_key = true. Set to null to skip creating an alias."
  type        = string
  default     = "alias/echo-ecr-mirror"

  validation {
    condition     = try(can(regex("^alias/[a-zA-Z0-9/_-]+$", var.kms_key_alias)) && substr(var.kms_key_alias, 0, 10) != "alias/aws/", var.kms_key_alias == null)
    error_message = "Input kms_key_alias must start with \"alias/\", contain only letters, numbers, /, _ and -, and must not start with the reserved prefix \"alias/aws/\"."
  }
}

variable "kms_key_deletion_window_in_days" {
  description = "Waiting period (7-30 days) before the module-created KMS key is deleted after it is scheduled for deletion."
  type        = number
  default     = 30

  validation {
    condition     = var.kms_key_deletion_window_in_days >= 7 && var.kms_key_deletion_window_in_days <= 30
    error_message = "Input kms_key_deletion_window_in_days must be between 7 and 30."
  }
}

variable "kms_key_enable_key_rotation" {
  description = "Enable automatic yearly rotation for the module-created KMS key."
  type        = bool
  default     = true
}

variable "creation_role_arn" {
  description = <<-EOT
    ARN of an existing IAM role that ECR assumes when it creates cache repositories
    (the template's customRoleArn). Leave null to let the module create a least-privilege
    role automatically whenever it is required (encryption_type = "KMS" or non-empty
    repository_tags). A supplied role must trust ecr.amazonaws.com and allow
    ecr:CreateRepository, ecr:TagResource and, for KMS, kms:CreateGrant,
    kms:RetireGrant and kms:DescribeKey on the key.
  EOT
  type        = string
  default     = null

  validation {
    condition     = var.creation_role_arn == null || can(regex("^arn:aws[a-z0-9-]*:iam::[0-9]{12}:role/.+$", var.creation_role_arn))
    error_message = "Input creation_role_arn must be a full IAM role ARN, e.g. arn:aws:iam::111122223333:role/my-ecr-creation-role."
  }
}

variable "creation_role_name" {
  description = "Name of the IAM role the module creates for the repository creation template (only created when required and creation_role_arn is null)."
  type        = string
  default     = "echo-ecr-repo-creation-role"

  validation {
    condition     = can(regex("^[a-zA-Z0-9+=,.@_-]{1,64}$", var.creation_role_name))
    error_message = "Input creation_role_name must be 1-64 characters: letters, numbers and +=,.@_-."
  }
}

variable "creation_policy_name" {
  description = "Name of the inline IAM policy attached to the module-created repository creation role."
  type        = string
  default     = "echo-ecr-repo-creation-policy"

  validation {
    condition     = can(regex("^[a-zA-Z0-9+=,.@_-]{1,128}$", var.creation_policy_name))
    error_message = "Input creation_policy_name must be 1-128 characters: letters, numbers and +=,.@_-."
  }
}

variable "image_tag_mutability" {
  description = "Tag mutability for new cache repositories: \"MUTABLE\" (default, recommended for pull-through cache so ECR can refresh cached tags) or \"IMMUTABLE\"."
  type        = string
  default     = "MUTABLE"

  validation {
    condition     = contains(["MUTABLE", "IMMUTABLE"], var.image_tag_mutability)
    error_message = "Input image_tag_mutability must be \"MUTABLE\" or \"IMMUTABLE\"."
  }
}

variable "lifecycle_policy" {
  description = "Optional ECR lifecycle policy JSON document applied to new cache repositories (e.g. jsonencode({ rules = [...] }))."
  type        = string
  default     = null

  validation {
    condition     = var.lifecycle_policy == null || can(jsondecode(var.lifecycle_policy))
    error_message = "Input lifecycle_policy must be a valid JSON document. Tip: build it with jsonencode({ rules = [...] })."
  }
}

variable "repository_policy" {
  description = "Optional ECR repository policy JSON document applied to new cache repositories (e.g. to grant other accounts pull access)."
  type        = string
  default     = null

  validation {
    condition     = var.repository_policy == null || can(jsondecode(var.repository_policy))
    error_message = "Input repository_policy must be a valid JSON document. Tip: build it with jsonencode({ Version = \"2012-10-17\", Statement = [...] })."
  }
}

variable "repository_tags" {
  description = "Tags applied to new cache repositories created by ECR. Non-empty tags require a repository creation role (created automatically unless creation_role_arn is set)."
  type        = map(string)
  default     = {}
}
