output "registry_id" {
  description = "The Harbor registry ID for reference"
  value       = var.create ? harbor_registry.echo_registry[0].registry_id : null
}

output "registry_name" {
  description = "The name of the Harbor registry"
  value       = var.create ? var.registry_name : null
}

output "project_name" {
  description = "The name of the Harbor project"
  value       = var.create ? var.project_name : null
}

output "echo_registry_url" {
  description = "The Echo registry URL being proxied"
  value       = var.create ? var.echo_registry_url : null
}

output "project_public" {
  description = "Whether the project is public"
  value       = var.create ? var.project_public : null
}

output "vulnerability_scanning_enabled" {
  description = "Whether vulnerability scanning is enabled"
  value       = var.create ? var.vulnerability_scanning : null
}

output "usage_instructions" {
  description = "Instructions for using the Echo registry Harbor integration"
  value = var.create ? (
    <<-EOT
🎉 Echo Registry Harbor Integration Setup Complete!

Your Harbor instance is now configured to proxy Echo Registry images for improved performance and enhanced security.

📦 How to Pull Echo Images through Harbor:
─────────────────────────────────────────────
Use your Harbor proxy cache instead of pulling directly from Echo registry:

  docker pull <your-harbor-instance>/${var.project_name}/<image-name>:<tag>

Example:
  docker pull harbor.example.com/${var.project_name}/nginx:latest

Instead of:
  docker pull ${replace(var.echo_registry_url, "https://", "")}/nginx:latest

💡 Benefits:
- ⚡ Faster image pulls (cached locally in Harbor)
- 🔒 Enhanced security with Harbor's vulnerability scanning and policies
- 📊 Better visibility and control over image usage
- 🛡️ Comprehensive vulnerability scanning with Harbor's integrated scanners
- 📋 SBOM generation for supply chain security
- 🔐 Content trust enforcement options
- 💰 Reduced data transfer costs from upstream registry

🔐 Authentication:
─────────────────
1. Log in to your Harbor instance:
   docker login <your-harbor-instance>

2. Use your Harbor credentials or robot accounts for programmatic access

📚 Additional Notes:
- The first pull will fetch from Echo and cache in Harbor
- Subsequent pulls use the cached version for faster performance
- Configure Harbor's cleanup policies to manage storage
- Set up Harbor's replication rules for multi-registry scenarios
- Enable Harbor's webhook notifications for CI/CD integration

🔧 Harbor Configuration:
- Registry Name: ${var.registry_name}
- Project Name: ${var.project_name}
- Project Type: Proxy Cache Project
- Upstream Registry: ${var.echo_registry_url}
- Project Public: ${var.project_public ? "Yes" : "No"}
- Vulnerability Scanning: ${var.vulnerability_scanning ? "Enabled" : "Disabled"}
- Content Trust: ${var.enable_content_trust ? "Enabled" : "Disabled"}
- SBOM Generation: ${var.auto_sbom_generation ? "Enabled" : "Disabled"}

⚙️ Advanced Harbor Features:
You can configure additional Harbor features like:
- Custom vulnerability scanning policies
- Content trust requirements with Notary/Cosign
- Automated cleanup and retention policies
- Webhook notifications for image events
- Replication rules for multi-site deployments
- Robot accounts for service authentication
- LDAP/OIDC integration for user management

Need help? Contact Echo support at support@echohq.com.
EOT
  ) : null
}