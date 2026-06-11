# Terraform version requirements moved to versions.tf

locals {
  # Image key: prefer the new echo_image_key_*, fall back to the deprecated
  # echo_access_key_* so existing image-only deployments keep working.
  image_key_name  = var.echo_image_key_name != "" ? var.echo_image_key_name : var.echo_access_key_name
  image_key_value = var.echo_image_key_value != "" ? var.echo_image_key_value : var.echo_access_key_value

  # Provision the Docker proxy when explicitly enabled, or (legacy) when a
  # deprecated access key was supplied.
  create_docker = var.create && (var.echo_images || nonsensitive(var.echo_access_key_name) != "")

  # Per-format repository keys (overridable, otherwise derived from the base).
  image_repository = var.echo_image_repository_name != "" ? var.echo_image_repository_name : var.repository_name
  # Library proxies are disabled for now; library locals + resources are
  # commented out below. Re-enable them when libraries are turned on.
  # pypi_repository  = var.echo_pypi_repository_name != "" ? var.echo_pypi_repository_name : "${var.repository_name}-pypi"
  # npm_repository   = var.echo_npm_repository_name != "" ? var.echo_npm_repository_name : "${var.repository_name}-npm"
  # maven_repository = var.echo_maven_repository_name != "" ? var.echo_maven_repository_name : "${var.repository_name}-maven"
}

# Docker proxy repository for Echo
resource "nexus_repository_docker_proxy" "echo_proxy" {
  count = local.create_docker ? 1 : 0

  name   = local.image_repository
  online = var.repository_online

  # Docker configuration
  docker {
    force_basic_auth = var.docker_force_basic_auth
    http_port        = var.docker_http_port
    https_port       = var.docker_https_port
    v1_enabled       = var.docker_v1_enabled
  }

  # Docker proxy index configuration
  docker_proxy {
    index_type = var.docker_index_type
    index_url  = var.docker_index_url
  }

  # Storage configuration
  storage {
    blob_store_name                = var.blob_store_name
    strict_content_type_validation = var.strict_content_type_validation
  }

  # Proxy configuration
  proxy {
    remote_url       = var.echo_registry_url
    content_max_age  = var.proxy_content_max_age
    metadata_max_age = var.proxy_metadata_max_age
  }

  # HTTP client configuration
  http_client {
    blocked    = var.http_client_blocked
    auto_block = var.http_client_auto_block

    # Connection settings
    connection {
      retries                   = var.connection_retries
      user_agent_suffix         = var.connection_user_agent_suffix
      timeout                   = var.connection_timeout
      enable_circular_redirects = var.connection_enable_circular_redirects
      enable_cookies            = var.connection_enable_cookies
      use_trust_store           = var.connection_use_trust_store
    }

    # Authentication
    authentication {
      type        = "username"
      username    = local.image_key_name
      password    = local.image_key_value
      ntlm_host   = var.authentication_ntlm_host
      ntlm_domain = var.authentication_ntlm_domain
    }
  }

  # Negative cache configuration
  negative_cache {
    enabled = var.negative_cache_enabled
    ttl     = var.negative_cache_ttl
  }


  # Routing rule
  routing_rule = var.routing_rule
}


# Library proxies (PyPI / npm / Maven) DISABLED for now.
/*
# PyPI proxy repository for Echo's PyPI index
resource "nexus_repository_pypi_proxy" "echo_pypi" {
  count = var.create && var.echo_library_pypi ? 1 : 0

  name   = local.pypi_repository
  online = var.repository_online

  storage {
    blob_store_name                = var.blob_store_name
    strict_content_type_validation = var.strict_content_type_validation
  }

  proxy {
    remote_url       = var.echo_pypi_url
    content_max_age  = var.proxy_content_max_age
    metadata_max_age = var.proxy_metadata_max_age
  }

  negative_cache {
    enabled = var.negative_cache_enabled
    ttl     = var.negative_cache_ttl
  }

  http_client {
    blocked    = var.http_client_blocked
    auto_block = var.http_client_auto_block

    authentication {
      type     = "username"
      username = var.echo_library_key_name
      password = var.echo_library_key_value
    }
  }

  routing_rule = var.routing_rule
}

# npm proxy repository for Echo's npm index
resource "nexus_repository_npm_proxy" "echo_npm" {
  count = var.create && var.echo_library_npm ? 1 : 0

  name   = local.npm_repository
  online = var.repository_online

  storage {
    blob_store_name                = var.blob_store_name
    strict_content_type_validation = var.strict_content_type_validation
  }

  proxy {
    remote_url       = var.echo_npm_url
    content_max_age  = var.proxy_content_max_age
    metadata_max_age = var.proxy_metadata_max_age
  }

  negative_cache {
    enabled = var.negative_cache_enabled
    ttl     = var.negative_cache_ttl
  }

  http_client {
    blocked    = var.http_client_blocked
    auto_block = var.http_client_auto_block

    authentication {
      type     = "username"
      username = var.echo_library_key_name
      password = var.echo_library_key_value
    }
  }

  routing_rule = var.routing_rule
}

# Maven proxy repository for Echo's Maven index
resource "nexus_repository_maven_proxy" "echo_maven" {
  count = var.create && var.echo_library_maven ? 1 : 0

  name   = local.maven_repository
  online = var.repository_online

  maven {
    version_policy = var.maven_version_policy
    layout_policy  = var.maven_layout_policy
  }

  storage {
    blob_store_name                = var.blob_store_name
    strict_content_type_validation = var.strict_content_type_validation
  }

  proxy {
    remote_url       = var.echo_maven_url
    content_max_age  = var.proxy_content_max_age
    metadata_max_age = var.proxy_metadata_max_age
  }

  negative_cache {
    enabled = var.negative_cache_enabled
    ttl     = var.negative_cache_ttl
  }

  http_client {
    blocked    = var.http_client_blocked
    auto_block = var.http_client_auto_block

    authentication {
      type     = "username"
      username = var.echo_library_key_name
      password = var.echo_library_key_value
    }
  }

  routing_rule = var.routing_rule
}
*/

# Optional: Create a content selector for the repository
resource "nexus_security_content_selector" "echo_selector" {
  count = var.create && var.create_content_selector ? 1 : 0

  name        = "${var.repository_name}-selector"
  description = "Content selector for Echo Docker proxy repository"
  expression  = var.content_selector_expression != "" ? var.content_selector_expression : "format == \"docker\" and path =~ \"^/v2/${var.repository_name}/.*\""
}

# Optional: Create repository privilege (Docker proxy only)
resource "nexus_privilege_repository_view" "echo_privilege" {
  count = local.create_docker && var.create_repository_privilege ? 1 : 0

  name        = "${var.repository_name}-view"
  description = "View privilege for Echo Docker proxy repository"
  format      = "docker"
  repository  = nexus_repository_docker_proxy.echo_proxy[0].name
  actions     = var.privilege_actions
}
