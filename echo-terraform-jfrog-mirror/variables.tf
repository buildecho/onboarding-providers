variable "create" {
  type        = bool
  description = "Whether to provision the resources under this module"
  default     = true
}

variable "remote_repository_name" {
  type        = string
  description = "Base name for the remote repositories in Artifactory. Per-format repositories derive from it (e.g. <name>, <name>-pypi, <name>-npm, <name>-maven) unless overridden."
  default     = "echo"
}

# ---------------------------------------------------------------------------
# Images (container registry)
# ---------------------------------------------------------------------------

variable "echo_images" {
  type        = bool
  description = "Provision the Docker remote repository that proxies Echo's image registry."
  default     = false
}

variable "echo_image_key_name" {
  type        = string
  description = "Echo image access key name (username) for the Docker remote."
  default     = ""
  sensitive   = true
}

variable "echo_image_key_value" {
  type        = string
  description = "Echo image access key value (password) for the Docker remote."
  default     = ""
  sensitive   = true
}

variable "echo_image_repository_name" {
  type        = string
  description = "Optional override for the Docker remote repository key. Defaults to remote_repository_name."
  default     = ""
}

variable "echo_registry_url" {
  type        = string
  description = "URL of the Echo image registry."
  default     = "https://reg.echohq.com"
}

# Deprecated: kept for backwards compatibility with the original image-only
# module. When set (and the new echo_image_key_* are empty) it provisions the
# Docker remote. Prefer echo_images + echo_image_key_name/value.
variable "echo_access_key_name" {
  type        = string
  description = "Deprecated. Use echo_image_key_name. Echo access key name (username)."
  default     = ""
  sensitive   = true
}

variable "echo_access_key_value" {
  type        = string
  description = "Deprecated. Use echo_image_key_value. Echo access key value (password)."
  default     = ""
  sensitive   = true
}

# ---------------------------------------------------------------------------
# Libraries (package registries) — one shared library key across ecosystems
# ---------------------------------------------------------------------------

variable "echo_library_pypi" {
  type        = bool
  description = "Provision the PyPI remote repository that proxies Echo's PyPI index."
  default     = false
}

variable "echo_library_npm" {
  type        = bool
  description = "Provision the npm remote repository that proxies Echo's npm index."
  default     = false
}

variable "echo_library_maven" {
  type        = bool
  description = "Provision the Maven remote repository that proxies Echo's Maven index."
  default     = false
}

variable "echo_library_key_name" {
  type = string
  # The Echo library access-key SUBJECT (deterministic per tenant, "et-<id>").
  # JFrog remotes send credentials preemptively, so Basic auth with this subject
  # as the username and echo_library_key_value as the password authenticates.
  description = "Echo library access key SUBJECT (et-<id>) used as the Basic auth username for the library remotes."
  default     = ""
  sensitive   = true
}

variable "echo_library_key_value" {
  type        = string
  description = "Echo library access key value (password) for the library remotes."
  default     = ""
  sensitive   = true
}

# Deprecated: replaced by the base-url + repo split (echo_pypi_base_url plus
# echo_pypi_prod_repo / echo_pypi_remote_repo). PyPI now resolves through a
# customer virtual that aggregates two smart remotes, so a single index URL no
# longer describes the topology.
variable "echo_pypi_url" {
  type        = string
  description = "Deprecated. Replaced by echo_pypi_base_url + echo_pypi_prod_repo/echo_pypi_remote_repo. URL of the Echo PyPI index."
  default     = "https://pypi.echohq.com"
}

variable "echo_pypi_base_url" {
  type        = string
  description = "Base URL of the Echo Artifactory host that backs the PyPI remotes. The prod/remote repo paths are appended to it."
  default     = "https://packages.echohq.com/artifactory"
}

variable "echo_pypi_prod_repo" {
  type        = string
  description = "Echo first-party local PyPI repo proxied by the echo-pypi-prod smart remote."
  default     = "prod-pypi"
}

variable "echo_pypi_remote_repo" {
  type        = string
  description = "Echo upstream cache PyPI repo proxied by the echo-pypi-remote smart remote."
  default     = "pypi-remote"
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
  description = "Optional override for the PyPI remote repository key. Defaults to <remote_repository_name>-pypi."
  default     = ""
}

variable "echo_npm_repository_name" {
  type        = string
  description = "Optional override for the npm remote repository key. Defaults to <remote_repository_name>-npm."
  default     = ""
}

variable "echo_maven_repository_name" {
  type        = string
  description = "Optional override for the Maven remote repository key. Defaults to <remote_repository_name>-maven."
  default     = ""
}

# ---------------------------------------------------------------------------
# Shared remote-repository configuration
# ---------------------------------------------------------------------------

variable "description" {
  type        = string
  description = "Description for the remote repositories"
  default     = "Echo remote repository"
}

variable "notes" {
  type        = string
  description = "Internal notes about the repositories"
  default     = "Managed by Terraform - Echo integration"
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
  description = "Repository layout reference for the Docker remote"
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
  description = "List of property sets to apply to the repositories"
  default     = []
}
