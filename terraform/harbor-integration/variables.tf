variable "create" {
  type        = bool
  description = "Whether to provision the resources under this module"
  default     = true
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
