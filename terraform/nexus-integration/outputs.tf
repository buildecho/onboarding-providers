output "repository_name" {
  description = "Name of the created Docker proxy repository"
  value       = var.create ? nexus_repository_docker_proxy.echo_proxy[0].name : null
}

output "repository_url" {
  description = "URL of the Docker proxy repository"
  value       = var.create ? "${var.echo_registry_url}/${nexus_repository_docker_proxy.echo_proxy[0].name}" : null
}

output "repository_format" {
  description = "Format of the repository"
  value       = "docker"
}

output "repository_type" {
  description = "Type of the repository"
  value       = "proxy"
}


output "content_selector_name" {
  description = "Name of the content selector (if created)"
  value       = var.create && var.create_content_selector ? nexus_security_content_selector.echo_selector[0].name : null
}

output "repository_privilege_name" {
  description = "Name of the repository privilege (if created)"
  value       = var.create && var.create_repository_privilege ? nexus_privilege_repository_view.echo_privilege[0].name : null
}

output "docker_pull_command" {
  description = "Example Docker pull command"
  value       = var.create ? "docker pull ${var.repository_name}/<image>:<tag>" : null
}

output "configuration_summary" {
  description = "Summary of the repository configuration"
  value = var.create ? {
    repository_name   = nexus_repository_docker_proxy.echo_proxy[0].name
    remote_url        = var.echo_registry_url
    docker_v1_enabled = var.docker_v1_enabled
    http_port         = var.docker_http_port
    https_port        = var.docker_https_port
    blob_store        = var.blob_store_name
    negative_cache    = var.negative_cache_enabled
  } : null
}
