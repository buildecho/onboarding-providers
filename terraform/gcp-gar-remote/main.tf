terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.0"
    }
  }
}

# Artifact Registry Repository for remote integration
resource "google_artifact_registry_repository" "remote_repo" {
  location      = var.location
  repository_id = var.repository_id
  description   = "Remote repository for ${var.service_name} integration"
  format        = "DOCKER"
  mode          = "REMOTE_REPOSITORY"

  remote_repository_config {
    description = "Remote repository pointing to ${var.service_name}"

    docker_repository {
      public_repository = var.remote_registry_type == "public" ? var.remote_registry_url : null

      dynamic "custom_repository" {
        for_each = var.remote_registry_type == "private" ? [1] : []
        content {
          uri = var.remote_registry_url
        }
      }
    }

    dynamic "upstream_credentials" {
      for_each = var.remote_registry_type == "private" ? [1] : []
      content {
        username_password_credentials {
          username                = var.registry_username
          password_secret_version = google_secret_manager_secret_version.registry_password[0].name
        }
      }
    }
  }

  labels = var.labels
}

# Secret Manager for registry credentials (only for private registries)
resource "google_secret_manager_secret" "registry_password" {
  count     = var.remote_registry_type == "private" ? 1 : 0
  secret_id = "${var.repository_id}-registry-password"

  replication {
    auto {}
  }

  labels = var.labels
}

resource "google_secret_manager_secret_version" "registry_password" {
  count       = var.remote_registry_type == "private" ? 1 : 0
  secret      = google_secret_manager_secret.registry_password[0].id
  secret_data = var.registry_password
}

# IAM binding for Artifact Registry access
resource "google_artifact_registry_repository_iam_binding" "readers" {
  count = length(var.reader_members) > 0 ? 1 : 0

  project    = var.project_id
  location   = google_artifact_registry_repository.remote_repo.location
  repository = google_artifact_registry_repository.remote_repo.name
  role       = "roles/artifactregistry.reader"
  members    = var.reader_members
}

resource "google_artifact_registry_repository_iam_binding" "writers" {
  count = length(var.writer_members) > 0 ? 1 : 0

  project    = var.project_id
  location   = google_artifact_registry_repository.remote_repo.location
  repository = google_artifact_registry_repository.remote_repo.name
  role       = "roles/artifactregistry.writer"
  members    = var.writer_members
} 
