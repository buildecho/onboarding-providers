output "usage_instructions" {
  description = "Instructions for using the Echo remote repositories provisioned in Artifactory. Replace <your-jfrog-domain> with your Artifactory host."
  value = var.create ? join("\n", compact([
    local.create_docker ? "Images:  docker pull <your-jfrog-domain>/${local.image_repository}/static:latest" : "",
    var.echo_library_pypi ? "PyPI:    pip install --index-url https://<your-jfrog-domain>/artifactory/api/pypi/${local.pypi_repository}/simple <package>" : "",
    var.echo_library_npm ? "npm:     npm install --registry https://<your-jfrog-domain>/artifactory/api/npm/${local.npm_repository}/ <package>" : "",
    var.echo_library_maven ? "Maven:   add https://<your-jfrog-domain>/artifactory/${local.maven_repository} as a repository in your settings.xml" : "",
  ])) : null
}

output "image_repository_key" {
  description = "Key of the Docker remote repository, if created."
  value       = local.create_docker ? local.image_repository : null
}

output "library_repository_keys" {
  description = "Keys of the library remote repositories that were created."
  value = compact([
    var.echo_library_pypi ? local.pypi_repository : "",
    var.echo_library_npm ? local.npm_repository : "",
    var.echo_library_maven ? local.maven_repository : "",
  ])
}
