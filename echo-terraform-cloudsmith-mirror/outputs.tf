output "usage_instructions" {
  description = "Instructions for consuming the Echo repositories provisioned in Cloudsmith."
  value = var.create ? join("\n", compact([
    local.create_docker ? "Images:  docker pull docker.cloudsmith.io/${var.namespace}/${local.image_repository}/<image>:<tag>" : "",
    local.create_pypi ? "PyPI:    pip install --index-url https://dl.cloudsmith.io/<token>/${var.namespace}/${local.pypi_repository}/python/simple/ <package>" : "",
    local.create_npm ? "npm:     npm install --registry https://npm.cloudsmith.io/${var.namespace}/${local.npm_repository}/ <package>" : "",
    local.create_maven ? "Maven:   add https://dl.cloudsmith.io/<token>/${var.namespace}/${local.maven_repository}/maven/ as a repository in your pom.xml / settings.xml" : "",
  ])) : null
}

output "image_repository_name" {
  description = "Slug of the Docker repository, if created."
  value       = local.create_docker ? local.image_repository : null
}

output "library_repository_names" {
  description = "Slugs of the library repositories that were created."
  value = compact([
    local.create_pypi ? local.pypi_repository : "",
    local.create_npm ? local.npm_repository : "",
    local.create_maven ? local.maven_repository : "",
  ])
}
