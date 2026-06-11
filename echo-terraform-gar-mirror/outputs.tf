output "repository_id" {
  description = "The ID of the created Docker (image) Artifact Registry repository, if created."
  value       = local.create_docker ? google_artifact_registry_repository.echo_remote_repo[0].repository_id : null
}

output "repository_name" {
  description = "The name of the created Docker (image) Artifact Registry repository, if created."
  value       = local.create_docker ? google_artifact_registry_repository.echo_remote_repo[0].name : null
}

output "image_repository_key" {
  description = "Repository id of the Docker (image) remote, if created."
  value       = local.create_docker ? local.image_repository : null
}

# Library remotes disabled for now.
/*
output "library_repository_keys" {
  description = "Repository ids of the library remotes that were created."
  value = compact([
    var.echo_library_pypi ? local.pypi_repository : "",
    var.echo_library_npm ? local.npm_repository : "",
    var.echo_library_maven ? local.maven_repository : "",
  ])
}
*/

output "secret_id" {
  description = "The ID of the secret containing the Echo image access key, if created."
  value       = local.create_docker ? google_secret_manager_secret.echo_access_key[0].secret_id : null
}

output "secret_version" {
  description = "The full resource name of the image secret version, if created."
  value       = local.create_docker ? google_secret_manager_secret_version.echo_access_key[0].name : null
}

# Library secret disabled for now.
/*
output "library_secret_id" {
  description = "The ID of the secret containing the Echo library access key, if created."
  value       = local.create_library ? google_secret_manager_secret.echo_library_key[0].secret_id : null
}
*/

output "usage_instructions" {
  description = "Instructions for using the Echo remote repositories provisioned in GAR."
  value = var.create ? join("\n", compact([
    local.create_docker ? "Images:  docker pull ${var.location}-docker.pkg.dev/${var.project_id}/${local.image_repository}/static:latest" : "",
    # Library remotes disabled for now:
    # var.echo_library_pypi ? "PyPI:    pip install --index-url https://${var.location}-python.pkg.dev/${var.project_id}/${local.pypi_repository}/simple/ <package>" : "",
    # var.echo_library_npm ? "npm:     npm install --registry https://${var.location}-npm.pkg.dev/${var.project_id}/${local.npm_repository}/ <package>" : "",
    # var.echo_library_maven ? "Maven:   add https://${var.location}-maven.pkg.dev/${var.project_id}/${local.maven_repository} as a repository in your settings.xml" : "",
  ])) : null
}
