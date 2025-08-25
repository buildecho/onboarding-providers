output "repository_id" {
  description = "The ID of the created Artifact Registry repository"
  value       = var.create ? google_artifact_registry_repository.echo_remote_repo[0].repository_id : null
}

output "repository_name" {
  description = "The full name of the created Artifact Registry repository"
  value       = var.create ? google_artifact_registry_repository.echo_remote_repo[0].name : null
}

output "repository_url" {
  description = "The URL of the created Artifact Registry repository"
  value       = var.create ? "${var.location}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.echo_remote_repo[0].repository_id}" : null
}

output "secret_id" {
  description = "The ID of the created secret containing the Echo access key"
  value       = var.create ? google_secret_manager_secret.echo_access_key[0].secret_id : null
}

output "secret_version" {
  description = "The full resource name of the secret version"
  value       = var.create ? google_secret_manager_secret_version.echo_access_key[0].name : null
}

output "resource_arns" {
  description = "Resource identifiers of all resources created by this module"
  value = var.create ? {
    repository_id   = google_artifact_registry_repository.echo_remote_repo[0].id
    repository_name = google_artifact_registry_repository.echo_remote_repo[0].name
    secret_id       = google_secret_manager_secret.echo_access_key[0].id
    secret_version  = google_secret_manager_secret_version.echo_access_key[0].name
  } : null
}

output "usage_instructions" {
  description = "Instructions for using the GAR remote repository"
  value = var.create ? (
    <<-EOT
# Echo GAR Remote Repository Setup Complete!

## 🚀 Quick Start
Configure Docker to use this remote repository:
```bash
# Configure authentication
gcloud auth configure-docker ${var.location}-docker.pkg.dev

# Pull images through the remote repository
docker pull ${var.location}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.echo_remote_repo[0].repository_id}/[IMAGE_NAME]:[TAG]
```

## 📋 Examples
```bash
# Pull a sample image
docker pull ${var.location}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.echo_remote_repo[0].repository_id}/my-app:latest

# List repositories
gcloud artifacts repositories list --location=${var.location}

# List images in repository
gcloud artifacts docker images list ${var.location}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.echo_remote_repo[0].repository_id}
```

## 🔧 Configuration
- **Repository ID**: ${google_artifact_registry_repository.echo_remote_repo[0].repository_id}
- **Location**: ${var.location}
- **Project ID**: ${var.project_id}
- **Repository URL**: ${var.location}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.echo_remote_repo[0].repository_id}

## 📝 Notes
- Images are automatically cached on first pull from Echo Registry
- Subsequent pulls will be served from the cache for faster access
- Ensure appropriate IAM permissions for your users/service accounts
- The secret containing Echo credentials is stored in Google Secret Manager
EOT
  ) : null
}
