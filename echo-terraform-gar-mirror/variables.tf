variable "create" {
  type        = bool
  description = "Whether to provision the resources under this module"
  default     = true
}

variable "project_id" {
  description = "The GCP project ID where the repository will be created"
  type        = string
}

variable "location" {
  description = "The location for the Artifact Registry repository"
  type        = string
  default     = "us-central1"

  validation {
    condition = contains([
      "us-central1", "us-east1", "us-east4", "us-west1", "us-west2",
      "europe-west1", "europe-west2", "europe-west3", "europe-west4",
      "asia-east1", "asia-northeast1", "asia-southeast1"
    ], var.location)
    error_message = "Location must be a valid Artifact Registry location."
  }
}

variable "repository_name" {
  description = "Base repository name. Per-format repositories derive from it (e.g. <name>, <name>-pypi, <name>-npm, <name>-maven) unless overridden."
  type        = string
  default     = "echo"

  validation {
    condition     = can(regex("^[a-z]([a-z0-9-]*[a-z0-9])?$", var.repository_name))
    error_message = "Repository name must contain only lowercase letters, numbers, and hyphens, and must start with a letter."
  }
}

variable "description" {
  description = "Description for the Artifact Registry repositories"
  type        = string
  default     = "Remote repository for Echo Registry integration"
}

# ---------------------------------------------------------------------------
# Images (container registry)
# ---------------------------------------------------------------------------

variable "echo_images" {
  description = "Provision the Docker remote repository that proxies Echo's image registry."
  type        = bool
  default     = false
}

variable "echo_image_key_name" {
  description = "Echo image access key name (username) for the Docker remote."
  type        = string
  default     = ""
  sensitive   = true
}

variable "echo_image_key_value" {
  description = "Echo image access key value (password) for the Docker remote."
  type        = string
  default     = ""
  sensitive   = true
}

variable "echo_image_repository_name" {
  description = "Optional override for the Docker remote repository id. Defaults to repository_name."
  type        = string
  default     = ""
}

variable "echo_registry_url" {
  description = "URL of the Echo image registry."
  type        = string
  default     = "https://reg.echohq.com"

  validation {
    condition     = can(regex("^https://", var.echo_registry_url))
    error_message = "Echo registry URL must be a valid HTTPS URL."
  }
}

# Deprecated: kept for backwards compatibility with the original image-only
# module. When set (and the new echo_image_key_* are empty) it provisions the
# Docker remote. Prefer echo_images + echo_image_key_name/value.
variable "echo_access_key_name" {
  description = "Deprecated. Use echo_image_key_name. Echo access key name (used as username for authentication)."
  type        = string
  default     = ""
  sensitive   = true
}

variable "echo_access_key_value" {
  description = "Deprecated. Use echo_image_key_value. Echo access key value (used as password for authentication)."
  type        = string
  default     = ""
  sensitive   = true
}

variable "echo_access_key_secret_name" {
  description = "Secret Manager secret name for the Echo image access key."
  type        = string
  default     = "echo-gar-mirror-secret"
}

# ---------------------------------------------------------------------------
# Libraries (package registries) — one shared library key across ecosystems
# ---------------------------------------------------------------------------

variable "echo_library_pypi" {
  description = "Provision the PyPI (PYTHON) remote repository that proxies Echo's PyPI index."
  type        = bool
  default     = false
}

variable "echo_library_npm" {
  description = "Provision the npm (NPM) remote repository that proxies Echo's npm index."
  type        = bool
  default     = false
}

variable "echo_library_maven" {
  description = "Provision the Maven (MAVEN) remote repository that proxies Echo's Maven index."
  type        = bool
  default     = false
}

variable "echo_library_key_name" {
  description = "Echo library access key name (username) for the library remotes."
  type        = string
  default     = ""
  sensitive   = true
}

variable "echo_library_key_value" {
  description = "Echo library access key value (password) for the library remotes."
  type        = string
  default     = ""
  sensitive   = true
}

variable "echo_library_key_secret_name" {
  description = "Secret Manager secret name for the Echo library access key."
  type        = string
  default     = "echo-gar-mirror-library-secret"
}

variable "echo_pypi_url" {
  description = "URL of the Echo PyPI index."
  type        = string
  default     = "https://pypi.echohq.com"

  validation {
    condition     = can(regex("^https://", var.echo_pypi_url))
    error_message = "Echo PyPI URL must be a valid HTTPS URL."
  }
}

variable "echo_npm_url" {
  description = "URL of the Echo npm index."
  type        = string
  default     = "https://npm.echohq.com"

  validation {
    condition     = can(regex("^https://", var.echo_npm_url))
    error_message = "Echo npm URL must be a valid HTTPS URL."
  }
}

variable "echo_maven_url" {
  description = "URL of the Echo Maven index."
  type        = string
  default     = "https://maven.echohq.com"

  validation {
    condition     = can(regex("^https://", var.echo_maven_url))
    error_message = "Echo Maven URL must be a valid HTTPS URL."
  }
}

variable "echo_pypi_repository_name" {
  description = "Optional override for the PyPI remote repository id. Defaults to <repository_name>-pypi."
  type        = string
  default     = ""
}

variable "echo_npm_repository_name" {
  description = "Optional override for the npm remote repository id. Defaults to <repository_name>-npm."
  type        = string
  default     = ""
}

variable "echo_maven_repository_name" {
  description = "Optional override for the Maven remote repository id. Defaults to <repository_name>-maven."
  type        = string
  default     = ""
}

# ---------------------------------------------------------------------------
# IAM
# ---------------------------------------------------------------------------

variable "reader_members" {
  description = "List of members to grant read access to the created repositories"
  type        = list(string)
  default     = []
}

variable "writer_members" {
  description = "List of members to grant write access to the created repositories"
  type        = list(string)
  default     = []
}

variable "labels" {
  description = "A map of labels to assign to the resources"
  type        = map(string)
  default     = {}
}
