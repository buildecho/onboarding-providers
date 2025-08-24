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
  description = "Name for the Harbor registry. If not provided, will use resource_prefix with '-registry' suffix"
  type        = string
  default     = ""
}

variable "project_name" {
  description = "Name for the Harbor project. If not provided, will use resource_prefix with '-project' suffix"
  type        = string
  default     = ""
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
