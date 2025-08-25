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

variable "cache_repository_name" {
  description = "Repository name for cached images - This will be the name of your repository"
  type        = string
  default     = "echo"

  validation {
    condition     = can(regex("^[a-z]([a-z0-9-]*[a-z0-9])?$", var.cache_repository_name))
    error_message = "Repository name must contain only lowercase letters, numbers, and hyphens, and must start with a letter."
  }
}

variable "description" {
  description = "Description for the Artifact Registry repository"
  type        = string
  default     = "Remote repository for Echo Registry integration"
}

variable "echo_registry_url" {
  description = "URL of the Echo registry"
  type        = string
  default     = "https://reg.echohq.com"

  validation {
    condition     = can(regex("^https://", var.echo_registry_url))
    error_message = "Echo registry URL must be a valid HTTPS URL."
  }
}

variable "echo_access_key_name" {
  description = "The name of the Echo access key (used as username for authentication)"
  type        = string
}

variable "echo_access_key_value" {
  description = "The value of the Echo access key (used as password for authentication)"
  type        = string
  sensitive   = true
}

variable "echo_access_key_secret_name" {
  description = "Custom secret name for the Echo access key. If not provided, defaults to '{repository_name}-echo-access-key'"
  type        = string
  default     = "echo-gar-mirror-secret"
}

variable "reader_members" {
  description = "List of members to grant read access to the repository"
  type        = list(string)
  default     = []
}

variable "writer_members" {
  description = "List of members to grant write access to the repository"
  type        = list(string)
  default     = []
}

variable "labels" {
  description = "A map of labels to assign to the resources"
  type        = map(string)
  default     = {}
}
