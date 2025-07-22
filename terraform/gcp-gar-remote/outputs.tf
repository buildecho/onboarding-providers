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
