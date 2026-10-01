variable "create" {
  type        = bool
  description = "Whether to provision the resources under this module"
  default     = true
}

variable "namespace" {
  type        = string
  description = "Cloudsmith namespace (organization slug) that owns the repositories."
}

variable "repository_name" {
  type        = string
  description = "Base name for the Cloudsmith repositories. Per-format repositories derive from it (e.g. <name>, <name>-pypi, <name>-npm, <name>-maven) unless overridden."
  default     = "echo"
}

# ---------------------------------------------------------------------------
# Images (container registry)
# ---------------------------------------------------------------------------

variable "echo_images" {
  type        = bool
  description = "Provision the Docker repository + upstream that proxies Echo's image registry."
  default     = false
}

variable "echo_image_key_name" {
  type        = string
  description = "Echo image access key name (username) for the Docker upstream auth."
  default     = ""
  sensitive   = true
}

variable "echo_image_key_value" {
  type        = string
  description = "Echo image access key value (secret) for the Docker upstream auth."
  default     = ""
  sensitive   = true
}

variable "echo_image_repository_name" {
  type        = string
  description = "Optional override for the Docker repository slug. Defaults to repository_name."
  default     = ""
}

variable "echo_registry_url" {
  type        = string
  description = "URL of the Echo image registry."
  default     = "https://reg.echohq.com"
}

# ---------------------------------------------------------------------------
# Libraries (package registries) — one shared library key across ecosystems
# ---------------------------------------------------------------------------

variable "echo_library_pypi" {
  type        = bool
  description = "Provision the PyPI repository + upstream that proxies Echo's PyPI index."
  default     = false
}

variable "echo_library_npm" {
  type        = bool
  description = "Provision the npm repository + upstream that proxies Echo's npm index."
  default     = false
}

variable "echo_library_maven" {
  type        = bool
  description = "Provision the Maven repository + upstream that proxies Echo's Maven index."
  default     = false
}

variable "echo_library_key_name" {
  type        = string
  description = "Echo library access key name (username) for the library upstream auth."
  default     = ""
  sensitive   = true
}

variable "echo_library_key_value" {
  type        = string
  description = "Echo library access key value (secret) for the library upstream auth."
  default     = ""
  sensitive   = true
}

variable "echo_pypi_url" {
  type        = string
  description = "URL of the Echo PyPI index."
  default     = "https://pypi.echohq.com"
}

variable "echo_npm_url" {
  type        = string
  description = "URL of the Echo npm index."
  default     = "https://npm.echohq.com"
}

variable "echo_maven_url" {
  type        = string
  description = "URL of the Echo Maven index."
  default     = "https://maven.echohq.com"
}

variable "echo_pypi_repository_name" {
  type        = string
  description = "Optional override for the PyPI repository slug. Defaults to <repository_name>-pypi."
  default     = ""
}

variable "echo_npm_repository_name" {
  type        = string
  description = "Optional override for the npm repository slug. Defaults to <repository_name>-npm."
  default     = ""
}

variable "echo_maven_repository_name" {
  type        = string
  description = "Optional override for the Maven repository slug. Defaults to <repository_name>-maven."
  default     = ""
}

# ---------------------------------------------------------------------------
# Shared repository configuration
# ---------------------------------------------------------------------------

variable "description" {
  type        = string
  description = "Description applied to the Cloudsmith repositories."
  default     = "Echo mirror repository (managed by Terraform)"
}

variable "repository_type" {
  type        = string
  description = "Cloudsmith repository visibility type."
  default     = "Private"

  validation {
    condition     = contains(["Public", "Private", "Open-Source"], var.repository_type)
    error_message = "repository_type must be one of: Public, Private, Open-Source."
  }
}

variable "upstream_mode" {
  type        = string
  description = "Operating mode for the upstreams."
  default     = "Cache and Proxy"

  validation {
    condition     = contains(["Proxy Only", "Cache and Proxy"], var.upstream_mode)
    error_message = "upstream_mode must be one of: Proxy Only, Cache and Proxy."
  }
}
