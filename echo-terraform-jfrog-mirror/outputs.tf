output "usage_instructions" {
  description = "Instructions for using the Echo remote repositories provisioned in Artifactory. Replace <your-jfrog-domain> with your Artifactory host."
  value = var.create ? join("\n", compact([
    local.create_docker ? "Images:  docker pull <your-jfrog-domain>/${local.image_repository}/static:latest" : "",
    var.echo_library_pypi ? "PyPI:    pip install --index-url https://<your-jfrog-domain>/artifactory/api/pypi/${local.pypi_repository}/simple <package>" : "",
    var.echo_library_npm ? "npm:     npm install --registry https://<your-jfrog-domain>/artifactory/api/npm/${local.npm_repository}/ <package>" : "",
    var.echo_library_maven ? "Maven:   add https://<your-jfrog-domain>/artifactory/${local.maven_repository} as a repository in your settings.xml" : "",
    var.echo_library_nuget ? "NuGet:   add https://<your-jfrog-domain>/artifactory/api/nuget/v3/${local.nuget_repository}/index.json to nuget.config with protocol version 3; test with: dotnet add package <package> --source https://<your-jfrog-domain>/artifactory/api/nuget/v3/${local.nuget_repository}/index.json" : "",
    var.echo_library_golang ? "Go:      go env -w GOPROXY=https://<your-jfrog-domain>/artifactory/api/go/${local.go_virtual_repository}; if Artifactory requires client auth, add 'machine <your-jfrog-domain> login <jfrog-username> password <jfrog-token-or-password>' to ~/.netrc; test with: go mod download -x -json github.com/gin-gonic/gin@v1.10.0" : "",
    var.echo_os_packages ? "OS pkgs: in a Dockerfile built FROM an Echo image, run: echo-apt-mirror https://<your-jfrog-domain>/artifactory/${local.deb_repository}" : "",
  ])) : null
}

output "image_repository_key" {
  description = "Key of the Docker remote repository, if created."
  value       = local.create_docker ? local.image_repository : null
}

output "library_repository_keys" {
  description = "Client-facing keys of the library repositories that were created. For Go this includes only the virtual repository."
  value = compact([
    var.echo_library_pypi ? local.pypi_repository : "",
    var.echo_library_npm ? local.npm_repository : "",
    var.echo_library_maven ? local.maven_repository : "",
    var.echo_library_nuget ? local.nuget_repository : "",
    var.echo_library_golang ? local.go_virtual_repository : "",
  ])
}

output "os_package_repository_key" {
  description = "Key of the Debian remote repository, if created."
  value       = var.echo_os_packages ? local.deb_repository : null
}
