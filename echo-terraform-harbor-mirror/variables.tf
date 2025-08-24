variable "create" {
  type        = bool
  description = "Whether to provision the resources under this module"
  default     = true
}

variable "resource_prefix" {
  description = "Prefix for all resource names created by this module"
  type        = string
  default     = "echo-mirror"

  validation {
    condition     = can(regex("^[a-z0-9]+([._-][a-z0-9]+)*$", var.resource_prefix))
    error_message = "Resource prefix must contain only lowercase letters, numbers, periods, hyphens, and underscores."
  }
}

variable "registry_name" {
  description = "Name for the Harbor registry"
  type        = string
  default     = "echo-registry"

  validation {
    condition     = can(regex("^[a-z0-9]+([._-][a-z0-9]+)*$", var.registry_name))
    error_message = "Registry name must contain only lowercase letters, numbers, periods, hyphens, and underscores."
  }
}

variable "project_name" {
  description = "Name for the Harbor project"
  type        = string
  default     = "echo"

  validation {
    condition     = can(regex("^[a-z0-9]+([._-][a-z0-9]+)*$", var.project_name))
    error_message = "Project name must contain only lowercase letters, numbers, periods, hyphens, and underscores."
  }
}

variable "echo_registry_url" {
  type        = string
  description = "The URL of the Echo registry"
  default     = "https://reg.echohq.com"
}

variable "echo_access_key_name" {
  type        = string
  description = "The name of the Echo access key"
  sensitive   = true
}

variable "echo_access_key_value" {
  type        = string
  description = "The value of the Echo access key"
  sensitive   = true
}

# Optional configuration aligned with Pulumi defaults
variable "registry_description" {
  description = "Description for the Echo registry in Harbor"
  type        = string
  default     = "Echo Registry"
}

variable "project_public" {
  description = "Whether to make the project public"
  type        = bool
  default     = false
}

variable "vulnerability_scanning" {
  description = "Enable vulnerability scanning for the project"
  type        = bool
  default     = true
}

variable "enable_content_trust" {
  description = "Enable content trust for the project"
  type        = bool
  default     = false
}

variable "enable_content_trust_cosign" {
  description = "Enable content trust cosign for the project"
  type        = bool
  default     = false
}

variable "auto_sbom_generation" {
  description = "Automatically generate SBOM for images pushed to this project"
  type        = bool
  default     = false
}
