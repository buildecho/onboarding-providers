# Terraform version requirements moved to versions.tf

# Secret Manager for Echo access key
resource "google_secret_manager_secret" "echo_access_key" {
  count = var.create ? 1 : 0

  secret_id = var.echo_access_key_secret_name != "" ? var.echo_access_key_secret_name : "${var.repository_name}-echo-access-key"

  replication {
    auto {}
  }

  labels = merge(var.labels, {
    purpose = "echo-registry-authentication"
  })
}

resource "google_secret_manager_secret_version" "echo_access_key" {
  count = var.create ? 1 : 0

  secret      = google_secret_manager_secret.echo_access_key[0].id
  secret_data = var.echo_access_key_value
}

# Artifact Registry Repository for Echo remote integration
resource "google_artifact_registry_repository" "echo_remote_repo" {
  count = var.create ? 1 : 0

  project       = var.project_id
  location      = var.location
  repository_id = var.repository_name
  description   = var.description != "" ? var.description : "Remote repository for Echo Registry integration"
  format        = "DOCKER"
  mode          = "REMOTE_REPOSITORY"

  remote_repository_config {
    description = "Remote repository pointing to Echo Registry (reg.echohq.com)"

    docker_repository {
      custom_repository {
        uri = var.echo_registry_url
      }
    }

    upstream_credentials {
      username_password_credentials {
        username                = var.echo_access_key_name
        password_secret_version = google_secret_manager_secret_version.echo_access_key[0].name
      }
    }
  }

  labels = merge(var.labels, {
    integration = "echo-registry"
    remote-type = "custom"
  })
}

# IAM binding for Secret Manager access (required for GAR to read the secret)
resource "google_secret_manager_secret_iam_member" "gar_secret_accessor" {
  count = var.create ? 1 : 0

  secret_id = google_secret_manager_secret.echo_access_key[0].id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:service-${data.google_project.current.number}@gcp-sa-artifactregistry.iam.gserviceaccount.com"
}

# Data source to get current project number
data "google_project" "current" {
  project_id = var.project_id
}

# IAM bindings for Artifact Registry repository access
resource "google_artifact_registry_repository_iam_binding" "readers" {
  count = var.create && length(var.reader_members) > 0 ? 1 : 0

  project    = var.project_id
  location   = google_artifact_registry_repository.echo_remote_repo[0].location
  repository = google_artifact_registry_repository.echo_remote_repo[0].name
  role       = "roles/artifactregistry.reader"
  members    = var.reader_members
}

resource "google_artifact_registry_repository_iam_binding" "writers" {
  count = var.create && length(var.writer_members) > 0 ? 1 : 0

  project    = var.project_id
  location   = google_artifact_registry_repository.echo_remote_repo[0].location
  repository = google_artifact_registry_repository.echo_remote_repo[0].name
  role       = "roles/artifactregistry.writer"
  members    = var.writer_members
}
