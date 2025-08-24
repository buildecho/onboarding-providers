terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.0"
    }
  }
}

# Configure the Google Cloud Provider
provider "google" {
  project = var.project_id
  region  = var.region
}

# Use the GCP GAR remote repository module
module "gar_echo_remote" {
  source = "../.."

  create                = true
  project_id            = var.project_id
  location              = var.location
  repository_id         = var.repository_id
  echo_access_key_name  = var.echo_access_key_name
  echo_access_key_value = var.echo_access_key_value

  reader_members = var.reader_members
  writer_members = var.writer_members

  labels = var.labels
}

# Variables
variable "project_id" {
  type        = string
  description = "GCP project ID where resources will be created"
}

variable "region" {
  type        = string
  description = "GCP region for provider configuration"
  default     = "us-central1"
}

variable "location" {
  type        = string
  description = "Location for the Artifact Registry repository"
  default     = "us-central1"
}

variable "repository_id" {
  type        = string
  description = "ID for the Artifact Registry repository"
  default     = "echo-remote"
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

variable "reader_members" {
  type        = list(string)
  description = "List of members who should have read access to the repository"
  default     = []
}

variable "writer_members" {
  type        = list(string)
  description = "List of members who should have write access to the repository"
  default     = []
}

variable "labels" {
  type        = map(string)
  description = "Labels to apply to all resources"
  default = {
    environment = "production"
    managed-by  = "terraform"
  }
}

# Outputs
output "repository_id" {
  description = "The ID of the created repository"
  value       = module.gar_echo_remote.repository_id
}

output "repository_name" {
  description = "The full name of the created repository"
  value       = module.gar_echo_remote.repository_name
}

output "repository_url" {
  description = "The URL of the repository for docker operations"
  value       = module.gar_echo_remote.repository_url
}
