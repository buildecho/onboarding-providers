# Terraform version requirements moved to versions.tf

# Docker proxy repository for Echo
resource "nexus_repository_docker_proxy" "echo_proxy" {
  count = var.create ? 1 : 0

  name   = var.repository_name
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
      username    = var.echo_access_key_name
      password    = var.echo_access_key_value
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


# Optional: Create a content selector for the repository
resource "nexus_security_content_selector" "echo_selector" {
  count = var.create && var.create_content_selector ? 1 : 0

  name        = "${var.repository_name}-selector"
  description = "Content selector for Echo Docker proxy repository"
  expression  = var.content_selector_expression != "" ? var.content_selector_expression : "format == \"docker\" and path =~ \"^/v2/${var.repository_name}/.*\""
}

# Optional: Create repository privilege
resource "nexus_privilege_repository_view" "echo_privilege" {
  count = var.create && var.create_repository_privilege ? 1 : 0

  name        = "${var.repository_name}-view"
  description = "View privilege for Echo Docker proxy repository"
  format      = "docker"
  repository  = nexus_repository_docker_proxy.echo_proxy[0].name
  actions     = var.privilege_actions
}
