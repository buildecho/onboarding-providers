output "repository_key" {
  description = "The key of the created remote repository"
  value       = var.create ? artifactory_remote_docker_repository.echo_remote[0].key : null
}

output "repository_url" {
  description = "The URL of the created remote repository"
  value       = var.create ? artifactory_remote_docker_repository.echo_remote[0].url : null
}

output "pull_url" {
  description = "The URL to use for pulling images through Artifactory"
  value       = var.create ? "${var.artifactory_url}/${var.repository_key}" : null
}
