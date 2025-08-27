output "usage_instructions" {
  description = "Example Docker pull command"
  value       = var.create ? "docker pull <nexus-host>${coalesce(var.docker_http_port, var.docker_https_port) != null ? ":${coalesce(var.docker_http_port, var.docker_https_port)}" : ""}/static:latest" : null
}
