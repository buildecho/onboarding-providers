terraform {
  required_version = ">= 1.0"
  required_providers {
    artifactory = {
      source  = "jfrog/artifactory"
      version = ">= 12.0.0"
    }
  }
}

# Docker Remote Repository for Echo registry
resource "artifactory_remote_docker_repository" "echo_remote" {
  count = var.create ? 1 : 0

  key         = var.repository_key
  url         = var.echo_registry_url
  username    = var.echo_access_key_name
  password    = var.echo_access_key_value
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
