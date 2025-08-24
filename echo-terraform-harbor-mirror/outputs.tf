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

output "resource_prefix" {
  description = "The resource prefix used for naming resources"
  value       = var.create ? var.resource_prefix : null
}

output "resource_identifiers" {
  description = "Resource identifiers of all resources created by this module"
  value = var.create ? {
    registry_id   = harbor_registry.echo_registry[0].registry_id
    registry_name = harbor_registry.echo_registry[0].name
    project_id    = harbor_project.echo_proxy_cache[0].project_id
    project_name  = harbor_project.echo_proxy_cache[0].name
  } : null
}

output "usage_instructions" {
  description = "Instructions for using the Harbor proxy cache"
  value = var.create ? (
    <<-EOT
# Echo Harbor Proxy Cache Setup Complete!

## 🚀 Quick Start
Configure Docker to use Harbor as a proxy cache:
```bash
# Login to your Harbor instance
docker login [YOUR_HARBOR_URL]

# Pull images through the proxy cache project
docker pull [YOUR_HARBOR_URL]/${local.project_name}/[IMAGE_NAME]:[TAG]
```

## 📋 Examples
```bash
# Pull a sample image
docker pull [YOUR_HARBOR_URL]/${local.project_name}/my-app:latest

# Tag and push to your Harbor registry
docker tag my-app:latest [YOUR_HARBOR_URL]/${local.project_name}/my-app:latest
docker push [YOUR_HARBOR_URL]/${local.project_name}/my-app:latest
```

## 🔧 Configuration
- **Registry Name**: ${local.registry_name}
- **Project Name**: ${local.project_name}
- **Registry ID**: ${harbor_registry.echo_registry[0].registry_id}
- **Project ID**: ${harbor_project.echo_proxy_cache[0].project_id}
- **Echo Registry URL**: ${var.echo_registry_url}

## 📝 Notes
- Images are automatically pulled from Echo Registry when requested
- Harbor acts as a proxy cache, storing images locally for faster subsequent access
- Configure your Harbor instance URL in the docker commands above
- Ensure proper Harbor authentication and project permissions
- The registry configuration points to Echo Registry as the upstream source
EOT
  ) : null
}
