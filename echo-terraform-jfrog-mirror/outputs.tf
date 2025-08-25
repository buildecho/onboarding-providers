
output "repository_url" {
  description = "The URL of the created remote repository"
  value       = var.create ? artifactory_remote_docker_repository.echo_remote[0].url : null
}

output "usage_instructions" {
  description = "Instructions for using the Artifactory proxy cache"
  value       = var.create ? "docker pull ${artifactory_remote_docker_repository.echo_remote[0].url}/static:latest" : null
}
