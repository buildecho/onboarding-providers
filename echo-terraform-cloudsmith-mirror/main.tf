# Terraform version requirements live in versions.tf

locals {
  # Gate each format on the module-level create flag plus its own toggle.
  create_docker = var.create && var.echo_images
  create_pypi   = var.create && var.echo_library_pypi
  create_npm    = var.create && var.echo_library_npm
  create_maven  = var.create && var.echo_library_maven

  # Per-format repository slugs (overridable, otherwise derived from the base).
  image_repository = var.echo_image_repository_name != "" ? var.echo_image_repository_name : var.repository_name
  pypi_repository  = var.echo_pypi_repository_name != "" ? var.echo_pypi_repository_name : "${var.repository_name}-pypi"
  npm_repository   = var.echo_npm_repository_name != "" ? var.echo_npm_repository_name : "${var.repository_name}-npm"
  maven_repository = var.echo_maven_repository_name != "" ? var.echo_maven_repository_name : "${var.repository_name}-maven"
}

# ---------------------------------------------------------------------------
# Images (Docker)
# ---------------------------------------------------------------------------

resource "cloudsmith_repository" "echo_image" {
  count = local.create_docker ? 1 : 0

  name            = local.image_repository
  slug            = local.image_repository
  namespace       = var.namespace
  description     = var.description
  repository_type = var.repository_type
}

resource "cloudsmith_repository_upstream" "echo_image" {
  count = local.create_docker ? 1 : 0

  name          = "Echo Images"
  namespace     = var.namespace
  repository    = cloudsmith_repository.echo_image[0].slug_perm
  upstream_type = "docker"
  upstream_url  = var.echo_registry_url
  mode          = var.upstream_mode
  auth_mode     = "Username and Password"
  auth_username = var.echo_image_key_name
  auth_secret   = var.echo_image_key_value
}

# ---------------------------------------------------------------------------
# Libraries (PyPI / npm / Maven) — one shared library key
# ---------------------------------------------------------------------------

resource "cloudsmith_repository" "echo_pypi" {
  count = local.create_pypi ? 1 : 0

  name            = local.pypi_repository
  slug            = local.pypi_repository
  namespace       = var.namespace
  description     = var.description
  repository_type = var.repository_type
}

resource "cloudsmith_repository_upstream" "echo_pypi" {
  count = local.create_pypi ? 1 : 0

  name          = "Echo PyPI"
  namespace     = var.namespace
  repository    = cloudsmith_repository.echo_pypi[0].slug_perm
  upstream_type = "python"
  upstream_url  = var.echo_pypi_url
  mode          = var.upstream_mode
  auth_mode     = "Username and Password"
  auth_username = var.echo_library_key_name
  auth_secret   = var.echo_library_key_value
}

resource "cloudsmith_repository" "echo_npm" {
  count = local.create_npm ? 1 : 0

  name            = local.npm_repository
  slug            = local.npm_repository
  namespace       = var.namespace
  description     = var.description
  repository_type = var.repository_type
}

resource "cloudsmith_repository_upstream" "echo_npm" {
  count = local.create_npm ? 1 : 0

  name          = "Echo npm"
  namespace     = var.namespace
  repository    = cloudsmith_repository.echo_npm[0].slug_perm
  upstream_type = "npm"
  upstream_url  = var.echo_npm_url
  mode          = var.upstream_mode
  auth_mode     = "Username and Password"
  auth_username = var.echo_library_key_name
  auth_secret   = var.echo_library_key_value
}

resource "cloudsmith_repository" "echo_maven" {
  count = local.create_maven ? 1 : 0

  name            = local.maven_repository
  slug            = local.maven_repository
  namespace       = var.namespace
  description     = var.description
  repository_type = var.repository_type
}

resource "cloudsmith_repository_upstream" "echo_maven" {
  count = local.create_maven ? 1 : 0

  name          = "Echo Maven"
  namespace     = var.namespace
  repository    = cloudsmith_repository.echo_maven[0].slug_perm
  upstream_type = "maven"
  upstream_url  = var.echo_maven_url
  mode          = var.upstream_mode
  auth_mode     = "Username and Password"
  auth_username = var.echo_library_key_name
  auth_secret   = var.echo_library_key_value
}
