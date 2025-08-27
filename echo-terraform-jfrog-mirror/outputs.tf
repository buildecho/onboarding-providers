

output "usage_instructions" {
  description = "Instructions for using the Artifactory proxy cache"
  value       = var.create ? "docker pull <JFrog instance URL>/${var.repository_name}/static:latest" : null
}
