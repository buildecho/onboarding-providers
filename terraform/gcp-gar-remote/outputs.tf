output "repository_name" {
  description = "Repository name for cached images"
  value       = var.create ? google_artifact_registry_repository.echo_remote_repo[0].repository_id : null
}

output "repository_full_name" {
  description = "The full name of the created Artifact Registry repository"
  value       = var.create ? google_artifact_registry_repository.echo_remote_repo[0].name : null
}

output "repository_url" {
  description = "The URL of the created Artifact Registry repository for pulling images"
  value       = var.create ? "${var.location}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.echo_remote_repo[0].repository_id}" : null
}

output "secret_name" {
  description = "The name of the created secret containing the Echo access key"
  value       = var.create ? google_secret_manager_secret.echo_access_key[0].secret_id : null
}

output "secret_version_name" {
  description = "The full resource name of the secret version"
  value       = var.create ? google_secret_manager_secret_version.echo_access_key[0].name : null
}

output "location" {
  description = "The location of the Artifact Registry repository"
  value       = var.create ? var.location : null
}

output "project_id" {
  description = "The GCP project ID where resources were created"
  value       = var.create ? var.project_id : null
}

output "usage_instructions" {
  description = "Instructions for using the Echo registry remote repository"
  value = var.create ? (
    <<-EOT
🎉 Echo Registry Remote Repository Setup Complete!

Your Google Artifact Registry is now configured to proxy Echo images for improved performance and reduced data transfer costs.

📦 How to Pull Echo Images:
─────────────────────────────
Use your GAR remote repository instead of pulling directly from Echo registry:

  docker pull ${var.location}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.echo_remote_repo[0].repository_id}/<image-name>:<tag>

Example:
  docker pull ${var.location}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.echo_remote_repo[0].repository_id}/nginx:latest

💡 Benefits:
- ⚡ Faster image pulls (cached locally in your GCP region)
- 🔒 Enhanced security with GCP IAM access controls
- 📊 Better visibility into image usage through GCP Cloud Logging
- 🌍 Leverage GCP's global infrastructure for faster access
- 💰 Reduced data transfer costs

🔐 Authentication:
─────────────────
1. Configure Docker authentication with GCP:
   gcloud auth configure-docker ${var.location}-docker.pkg.dev

2. Ensure your account/service has appropriate permissions:
   - roles/artifactregistry.reader (to pull images)
   - roles/artifactregistry.writer (to push images, if needed)

📚 Additional Notes:
- The first pull will fetch from Echo and cache in your GAR
- Subsequent pulls use the cached version for faster performance
- Configure Artifact Registry cleanup policies to manage storage costs
- Enable vulnerability scanning for additional security
- Set up IAM policies to control access to your repository

🔧 Repository Configuration:
- Repository: ${google_artifact_registry_repository.echo_remote_repo[0].repository_id}
- Location: ${var.location}
- Format: Docker
- Mode: Remote Repository
- Upstream: ${var.echo_registry_url}

Need help? Contact Echo support at support@echohq.com.
EOT
  ) : null
}
