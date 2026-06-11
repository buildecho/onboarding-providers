output "usage_instructions" {
  description = "Instructions for using the Echo proxy repositories provisioned in Nexus. Replace <nexus-host> with your Nexus host."
  value = var.create ? join("\n", compact([
    local.create_docker ? "Images:  docker pull <nexus-host>${coalesce(var.docker_http_port, var.docker_https_port) != null ? ":${coalesce(var.docker_http_port, var.docker_https_port)}" : ""}/static:latest" : "",
    # Library proxies disabled for now:
    # var.echo_library_pypi ? "PyPI:    pip install --index-url https://<nexus-host>/repository/${local.pypi_repository}/simple <package>" : "",
    # var.echo_library_npm ? "npm:     npm install --registry https://<nexus-host>/repository/${local.npm_repository}/ <package>" : "",
    # var.echo_library_maven ? "Maven:   add https://<nexus-host>/repository/${local.maven_repository} as a repository in your settings.xml" : "",
  ])) : null
}

output "image_repository_key" {
  description = "Name of the Docker proxy repository, if created."
  value       = local.create_docker ? local.image_repository : null
}

# Library proxies disabled for now.
/*
output "library_repository_keys" {
  description = "Names of the library proxy repositories that were created."
  value = compact([
    var.echo_library_pypi ? local.pypi_repository : "",
    var.echo_library_npm ? local.npm_repository : "",
    var.echo_library_maven ? local.maven_repository : "",
  ])
}
*/
