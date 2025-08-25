output "repository_name" {
  description = "Name of the created Docker proxy repository"
  value       = var.create ? nexus_repository_docker_proxy.echo_proxy[0].name : null
}


output "usage_instructions" {
  description = "Example Docker pull command"
  value       = var.create ? "docker pull <nexus-host>${coalesce(var.docker_http_port, var.docker_https_port) != null ? ":${coalesce(var.docker_http_port, var.docker_https_port)}" : ""}/${var.repository_name}/static:latest" : null
}
