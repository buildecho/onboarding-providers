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

variable "repository_id" {
  description = "The ID of the repository"
  type        = string

  validation {
    condition     = can(regex("^[a-z]([a-z0-9-]*[a-z0-9])?$", var.repository_id))
    error_message = "Repository ID must contain only lowercase letters, numbers, and hyphens, and must start with a letter."
  }
}

variable "service_name" {
  description = "Name of the service for identification"
  type        = string
  default     = "Echo Registry"
}

variable "remote_registry_type" {
  description = "Type of remote registry (public or private)"
  type        = string
  default     = "private"

  validation {
    condition     = contains(["public", "private"], var.remote_registry_type)
    error_message = "Remote registry type must be either 'public' or 'private'."
  }
}

variable "remote_registry_url" {
  description = "URL of the remote registry"
  type        = string

  validation {
    condition     = can(regex("^https?://", var.remote_registry_url))
    error_message = "Remote registry URL must be a valid HTTP or HTTPS URL."
  }
}

variable "registry_username" {
  description = "Username for authenticating with the remote registry (required for private registries)"
  type        = string
  default     = ""
}

variable "registry_password" {
  description = "Password for authenticating with the remote registry (required for private registries)"
  type        = string
  default     = ""
  sensitive   = true
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
