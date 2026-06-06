# Terraform version requirements moved to versions.tf

locals {
  # Image key: prefer the new echo_image_key_*, fall back to the deprecated
  # echo_access_key_* so existing image-only deployments keep working.
  image_key_name  = var.echo_image_key_name != "" ? var.echo_image_key_name : var.echo_access_key_name
  image_key_value = var.echo_image_key_value != "" ? var.echo_image_key_value : var.echo_access_key_value

  # Provision the Docker remote when explicitly enabled, or (legacy) when a
  # deprecated access key was supplied.
  create_docker = var.create && (var.echo_images || nonsensitive(var.echo_access_key_name) != "")

  # Provision the library secret only when at least one library format is on.
  create_library = var.create && (var.echo_library_pypi || var.echo_library_npm || var.echo_library_maven)

  # Per-format repository ids (overridable, otherwise derived from the base).
  image_repository = var.echo_image_repository_name != "" ? var.echo_image_repository_name : var.repository_name
  pypi_repository  = var.echo_pypi_repository_name != "" ? var.echo_pypi_repository_name : "${var.repository_name}-pypi"
  npm_repository   = var.echo_npm_repository_name != "" ? var.echo_npm_repository_name : "${var.repository_name}-npm"
  maven_repository = var.echo_maven_repository_name != "" ? var.echo_maven_repository_name : "${var.repository_name}-maven"

  # Repositories created by this module, used to fan out the IAM bindings.
  created_repositories = merge(
    local.create_docker ? { image = google_artifact_registry_repository.echo_remote_repo[0] } : {},
    var.echo_library_pypi ? { pypi = google_artifact_registry_repository.echo_pypi[0] } : {},
    var.echo_library_npm ? { npm = google_artifact_registry_repository.echo_npm[0] } : {},
    var.echo_library_maven ? { maven = google_artifact_registry_repository.echo_maven[0] } : {},
  )
}

# Enable required APIs
resource "google_project_service" "secretmanager" {
  count = var.create ? 1 : 0

  project = var.project_id
  service = "secretmanager.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

resource "google_project_service" "artifactregistry" {
  count = var.create ? 1 : 0

  project = var.project_id
  service = "artifactregistry.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Data source to get current project number
data "google_project" "current" {
  project_id = var.project_id
}

# ---------------------------------------------------------------------------
# Secret Manager — image access key (existing resource addresses unchanged)
# ---------------------------------------------------------------------------

resource "google_secret_manager_secret" "echo_access_key" {
  count = local.create_docker ? 1 : 0

  secret_id = var.echo_access_key_secret_name

  replication {
    auto {}
  }

  labels = merge(var.labels, {
    purpose = "echo-registry-authentication"
  })

  depends_on = [google_project_service.secretmanager]
}

resource "google_secret_manager_secret_version" "echo_access_key" {
  count = local.create_docker ? 1 : 0

  secret      = google_secret_manager_secret.echo_access_key[0].id
  secret_data = local.image_key_value
}

# ---------------------------------------------------------------------------
# Secret Manager — library access key (shared across library formats)
# ---------------------------------------------------------------------------

resource "google_secret_manager_secret" "echo_library_key" {
  count = local.create_library ? 1 : 0

  secret_id = var.echo_library_key_secret_name

  replication {
    auto {}
  }

  labels = merge(var.labels, {
    purpose = "echo-library-authentication"
  })

  depends_on = [google_project_service.secretmanager]
}

resource "google_secret_manager_secret_version" "echo_library_key" {
  count = local.create_library ? 1 : 0

  secret      = google_secret_manager_secret.echo_library_key[0].id
  secret_data = var.echo_library_key_value
}

# ---------------------------------------------------------------------------
# Artifact Registry repositories
# ---------------------------------------------------------------------------

# Docker remote repository for Echo's image registry
resource "google_artifact_registry_repository" "echo_remote_repo" {
  count = local.create_docker ? 1 : 0

  project       = var.project_id
  location      = var.location
  repository_id = local.image_repository
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
        username                = local.image_key_name
        password_secret_version = google_secret_manager_secret_version.echo_access_key[0].name
      }
    }
  }

  labels = var.labels

  depends_on = [google_project_service.artifactregistry]
}

# PyPI (PYTHON) remote repository for Echo's PyPI index
resource "google_artifact_registry_repository" "echo_pypi" {
  count = var.create && var.echo_library_pypi ? 1 : 0

  project       = var.project_id
  location      = var.location
  repository_id = local.pypi_repository
  description   = var.description != "" ? var.description : "Remote repository for Echo PyPI integration"
  format        = "PYTHON"
  mode          = "REMOTE_REPOSITORY"

  remote_repository_config {
    description = "Remote repository pointing to Echo PyPI (pypi.echohq.com)"

    python_repository {
      custom_repository {
        uri = var.echo_pypi_url
      }
    }

    upstream_credentials {
      username_password_credentials {
        username                = var.echo_library_key_name
        password_secret_version = google_secret_manager_secret_version.echo_library_key[0].name
      }
    }
  }

  labels = var.labels

  depends_on = [google_project_service.artifactregistry]
}

# npm (NPM) remote repository for Echo's npm index
resource "google_artifact_registry_repository" "echo_npm" {
  count = var.create && var.echo_library_npm ? 1 : 0

  project       = var.project_id
  location      = var.location
  repository_id = local.npm_repository
  description   = var.description != "" ? var.description : "Remote repository for Echo npm integration"
  format        = "NPM"
  mode          = "REMOTE_REPOSITORY"

  remote_repository_config {
    description = "Remote repository pointing to Echo npm (npm.echohq.com)"

    npm_repository {
      custom_repository {
        uri = var.echo_npm_url
      }
    }

    upstream_credentials {
      username_password_credentials {
        username                = var.echo_library_key_name
        password_secret_version = google_secret_manager_secret_version.echo_library_key[0].name
      }
    }
  }

  labels = var.labels

  depends_on = [google_project_service.artifactregistry]
}

# Maven (MAVEN) remote repository for Echo's Maven index
resource "google_artifact_registry_repository" "echo_maven" {
  count = var.create && var.echo_library_maven ? 1 : 0

  project       = var.project_id
  location      = var.location
  repository_id = local.maven_repository
  description   = var.description != "" ? var.description : "Remote repository for Echo Maven integration"
  format        = "MAVEN"
  mode          = "REMOTE_REPOSITORY"

  remote_repository_config {
    description = "Remote repository pointing to Echo Maven (maven.echohq.com)"

    maven_repository {
      custom_repository {
        uri = var.echo_maven_url
      }
    }

    upstream_credentials {
      username_password_credentials {
        username                = var.echo_library_key_name
        password_secret_version = google_secret_manager_secret_version.echo_library_key[0].name
      }
    }
  }

  labels = var.labels

  depends_on = [google_project_service.artifactregistry]
}

# ---------------------------------------------------------------------------
# IAM — secret accessor for the GAR service account (per created secret)
# ---------------------------------------------------------------------------

resource "google_secret_manager_secret_iam_member" "gar_secret_accessor" {
  count = local.create_docker ? 1 : 0

  secret_id = google_secret_manager_secret.echo_access_key[0].id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:service-${data.google_project.current.number}@gcp-sa-artifactregistry.iam.gserviceaccount.com"

  depends_on = [google_project_service.artifactregistry]
}

resource "google_secret_manager_secret_iam_member" "gar_library_secret_accessor" {
  count = local.create_library ? 1 : 0

  secret_id = google_secret_manager_secret.echo_library_key[0].id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:service-${data.google_project.current.number}@gcp-sa-artifactregistry.iam.gserviceaccount.com"

  depends_on = [google_project_service.artifactregistry]
}

# ---------------------------------------------------------------------------
# IAM — repository reader/writer bindings (applied per created repository)
# ---------------------------------------------------------------------------

resource "google_artifact_registry_repository_iam_binding" "readers" {
  for_each = length(var.reader_members) > 0 ? local.created_repositories : {}

  project    = var.project_id
  location   = each.value.location
  repository = each.value.name
  role       = "roles/artifactregistry.reader"
  members    = var.reader_members
}

resource "google_artifact_registry_repository_iam_binding" "writers" {
  for_each = length(var.writer_members) > 0 ? local.created_repositories : {}

  project    = var.project_id
  location   = each.value.location
  repository = each.value.name
  role       = "roles/artifactregistry.writer"
  members    = var.writer_members
}
