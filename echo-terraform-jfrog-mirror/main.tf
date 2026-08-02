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
  deb_repository   = var.echo_deb_repository_name != "" ? var.echo_deb_repository_name : "${var.remote_repository_name}-deb"
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

# Library remotes (PyPI / npm / Maven) authenticate to Echo with Basic auth: the
# username is the library access-key SUBJECT (echo_library_key_name, "et-<id>")
# and the password is the key value. JFrog remotes send credentials preemptively,
# so the correct subject username authenticates. Unlike the Docker remote there
# is no `enable_token_authentication` toggle on these repo types — the provider
# does not expose it (docker-only; jfrog provider issue #1389). If Echo requires
# Bearer instead of Basic, the workaround is a post-create REST PATCH against the
# repo config with {"enableTokenAuthentication":true}.

# PyPI topology: JFrog now supports a pypi *remote* whose upstream is a virtual,
# so PyPI collapses to a single smart remote (like npm/Maven) pointing at Echo's
# `pypi` virtual. pip resolves against it:
#   pip install --index-url .../artifactory/api/pypi/<pypi>/simple <pkg>
# A pypi remote has two URL fields: `url` (plain, no api/pypi) and
# `pypi_registry_url` (with api/pypi).
resource "artifactory_remote_pypi_repository" "echo_pypi" {
  count = var.create && var.echo_library_pypi ? 1 : 0

  key               = local.pypi_repository
  url               = "${var.echo_pypi_base_url}/${var.echo_pypi_repo}"
  pypi_registry_url = "${var.echo_pypi_base_url}/api/pypi/${var.echo_pypi_repo}"
  username          = var.echo_library_key_name
  password          = var.echo_library_key_value
  description       = var.description
  notes             = var.notes

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

# Debian remote repository for Echo's OS packages. Consumers are Echo-based
# images, which already carry Echo's apt signing key and source; they only swap
# the source URL to point here.
resource "artifactory_remote_debian_repository" "echo_deb" {
  count = var.create && var.echo_os_packages ? 1 : 0

  key         = local.deb_repository
  url         = var.echo_os_packages_url
  description = var.description
  notes       = var.notes

  store_artifacts_locally        = var.store_artifacts_locally
  socket_timeout_millis          = var.socket_timeout_millis
  retrieval_cache_period_seconds = var.retrieval_cache_period_seconds
  missed_cache_period_seconds    = var.missed_cache_period_seconds
  hard_fail                      = var.hard_fail
  offline                        = var.offline

  # A precondition rather than a variable validation: the rule depends on a
  # second variable, which validation blocks only support from Terraform 1.9.
  lifecycle {
    precondition {
      condition     = var.echo_os_packages_url != ""
      error_message = "echo_os_packages_url must be set when echo_os_packages is enabled. Copy the repository URL from the Integrations page in the Echo platform."
    }
  }
}
