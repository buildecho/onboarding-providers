output "registry_id" {
  description = "The ID of the Harbor registry"
  value       = var.create ? harbor_registry.echo_registry[0].registry_id : null
}

output "registry_name" {
  description = "The name of the Harbor registry"
  value       = var.create ? harbor_registry.echo_registry[0].name : null
}

output "project_id" {
  description = "The ID of the Harbor project"
  value       = var.create ? harbor_project.echo_proxy_cache[0].project_id : null
}

output "project_name" {
  description = "The name of the Harbor project"
  value       = var.create ? harbor_project.echo_proxy_cache[0].name : null
}


output "usage_instructions" {
  description = "Instructions for using the Harbor proxy cache"
  value = var.create ? (
    "docker pull <harbor-instance>/${harbor_project.echo_proxy_cache[0].name}/static:latest"
  ) : null
}
