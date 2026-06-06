# Terraform version requirements live in versions.tf

locals {
  # Image key: prefer the new echo_image_key_*, fall back to the deprecated
  # echo_access_key_* so existing image-only deployments keep working.
  image_key_name  = var.echo_image_key_name != "" ? var.echo_image_key_name : var.echo_access_key_name
  image_key_value = var.echo_image_key_value != "" ? var.echo_image_key_value : var.echo_access_key_value

  # Provision the Docker remote when explicitly enabled, or (legacy) when a
  # deprecated access key was supplied.
  create_docker = var.create && (var.echo_images || nonsensitive(var.echo_access_key_name) != "")

  # Per-format repository keys (overridable, otherwise derived from the base).
  image_repository = var.echo_image_repository_name != "" ? var.echo_image_repository_name : var.remote_repository_name
  pypi_repository  = var.echo_pypi_repository_name != "" ? var.echo_pypi_repository_name : "${var.remote_repository_name}-pypi"
  npm_repository   = var.echo_npm_repository_name != "" ? var.echo_npm_repository_name : "${var.remote_repository_name}-npm"
  maven_repository = var.echo_maven_repository_name != "" ? var.echo_maven_repository_name : "${var.remote_repository_name}-maven"
}

# Docker remote repository for Echo's image registry
resource "artifactory_remote_docker_repository" "echo_remote" {
  count = local.create_docker ? 1 : 0

  key         = local.image_repository
  url         = var.echo_registry_url
  username    = local.image_key_name
  password    = local.image_key_value
  description = var.description

  # Repository configuration
  notes            = var.notes
  includes_pattern = var.includes_pattern
  excludes_pattern = var.excludes_pattern
  repo_layout_ref  = var.repo_layout_ref

  # Docker specific settings
  block_mismatching_mime_types = var.block_mismatching_mime_types
  enable_token_authentication  = var.enable_token_authentication

  # Caching and performance
  store_artifacts_locally        = var.store_artifacts_locally
  socket_timeout_millis          = var.socket_timeout_millis
  retrieval_cache_period_seconds = var.retrieval_cache_period_seconds
  missed_cache_period_seconds    = var.missed_cache_period_seconds

  # Advanced settings
  hard_fail            = var.hard_fail
  offline              = var.offline
  bypass_head_requests = var.bypass_head_requests
  priority_resolution  = var.priority_resolution

  # Xray integration
  xray_index = var.xray_index

  # Property sets
  property_sets = length(var.property_sets) > 0 ? var.property_sets : ["artifactory"]
}

# PyPI remote repository for Echo's PyPI index
resource "artifactory_remote_pypi_repository" "echo_pypi" {
  count = var.create && var.echo_library_pypi ? 1 : 0

  key         = local.pypi_repository
  url         = var.echo_pypi_url
  username    = var.echo_library_key_name
  password    = var.echo_library_key_value
  description = var.description
  notes       = var.notes

  store_artifacts_locally        = var.store_artifacts_locally
  socket_timeout_millis          = var.socket_timeout_millis
  retrieval_cache_period_seconds = var.retrieval_cache_period_seconds
  missed_cache_period_seconds    = var.missed_cache_period_seconds
  hard_fail                      = var.hard_fail
  offline                        = var.offline
}

# npm remote repository for Echo's npm index
resource "artifactory_remote_npm_repository" "echo_npm" {
  count = var.create && var.echo_library_npm ? 1 : 0

  key         = local.npm_repository
  url         = var.echo_npm_url
  username    = var.echo_library_key_name
  password    = var.echo_library_key_value
  description = var.description
  notes       = var.notes

  store_artifacts_locally        = var.store_artifacts_locally
  socket_timeout_millis          = var.socket_timeout_millis
  retrieval_cache_period_seconds = var.retrieval_cache_period_seconds
  missed_cache_period_seconds    = var.missed_cache_period_seconds
  hard_fail                      = var.hard_fail
  offline                        = var.offline
}

# Maven remote repository for Echo's Maven index
resource "artifactory_remote_maven_repository" "echo_maven" {
  count = var.create && var.echo_library_maven ? 1 : 0

  key         = local.maven_repository
  url         = var.echo_maven_url
  username    = var.echo_library_key_name
  password    = var.echo_library_key_value
  description = var.description
  notes       = var.notes

  store_artifacts_locally        = var.store_artifacts_locally
  socket_timeout_millis          = var.socket_timeout_millis
  retrieval_cache_period_seconds = var.retrieval_cache_period_seconds
  missed_cache_period_seconds    = var.missed_cache_period_seconds
  hard_fail                      = var.hard_fail
  offline                        = var.offline
}
