variable "create" {
  type        = bool
  description = "Whether to provision the resources under this module"
  default     = true
}

variable "remote_repository_name" {
  type        = string
  description = "The name for the remote repository in Artifactory"
  default     = "echo"
}

variable "echo_registry_url" {
  type        = string
  description = "The URL of the Echo registry"
  default     = "https://reg.echohq.com"
}

variable "echo_access_key_name" {
  type        = string
  description = "The name of the Echo access key (username)"
  sensitive   = true
}

variable "echo_access_key_value" {
  type        = string
  description = "The value of the Echo access key (password)"
  sensitive   = true
}

variable "description" {
  type        = string
  description = "Description for the remote repository"
  default     = "Echo Registry remote repository for container images"
}

variable "notes" {
  type        = string
  description = "Internal notes about the repository"
  default     = "Managed by Terraform - Echo Registry integration"
}

variable "includes_pattern" {
  type        = string
  description = "Comma-separated list of patterns to include when evaluating artifact requests"
  default     = "**/*"
}

variable "excludes_pattern" {
  type        = string
  description = "Comma-separated list of patterns to exclude when evaluating artifact requests"
  default     = ""
}

variable "repo_layout_ref" {
  type        = string
  description = "Repository layout reference"
  default     = "simple-default"
}

variable "block_mismatching_mime_types" {
  type        = bool
  description = "Block artifacts with mismatching MIME types"
  default     = true
}

variable "enable_token_authentication" {
  type        = bool
  description = "Enable token authentication for Docker repositories"
  default     = true
}

variable "store_artifacts_locally" {
  type        = bool
  description = "Store artifacts locally when proxying"
  default     = true
}

variable "socket_timeout_millis" {
  type        = number
  description = "Network socket timeout in milliseconds"
  default     = 15000
}

variable "retrieval_cache_period_seconds" {
  type        = number
  description = "Cache period for retrieval operations in seconds"
  default     = 7200
}

variable "missed_cache_period_seconds" {
  type        = number
  description = "Cache period for missed artifacts in seconds"
  default     = 1800
}

variable "hard_fail" {
  type        = bool
  description = "Fail the request if the remote repository is not available"
  default     = false
}

variable "offline" {
  type        = bool
  description = "Set the repository to offline mode"
  default     = false
}

variable "bypass_head_requests" {
  type        = bool
  description = "Bypass HEAD requests and directly perform GET requests"
  default     = false
}

variable "priority_resolution" {
  type        = bool
  description = "Enable priority resolution"
  default     = false
}

variable "xray_index" {
  type        = bool
  description = "Enable Xray indexing"
  default     = false
}

variable "property_sets" {
  type        = list(string)
  description = "List of property sets to apply to the repository"
  default     = []
}
