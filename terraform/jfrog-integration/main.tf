terraform {
  required_version = ">= 1.0"
  required_providers {
    artifactory = {
      source  = "jfrog/artifactory"
      version = ">= 10.0"
    }
  }
}

# Configure the Artifactory Provider
provider "artifactory" {
  url          = var.artifactory_url
  access_token = var.artifactory_access_token
  # Alternative authentication
  username = var.artifactory_username
  password = var.artifactory_password
}

# Docker Remote Repository for Echo registry
resource "artifactory_remote_docker_repository" "our_service_remote" {
  key         = var.repository_key
  url         = var.remote_registry_url
  username    = var.remote_registry_username
  password    = var.remote_registry_password
  description = "Remote repository for ${var.service_name} integration"

  # Repository configuration
  notes            = "Managed by Terraform - ${var.service_name} integration"
  includes_pattern = var.includes_pattern
  excludes_pattern = var.excludes_pattern
  repo_layout_ref  = "simple-default"

  # Docker specific settings
  enable_token_authentication    = var.enable_token_authentication
  external_dependencies_enabled  = var.external_dependencies_enabled
  external_dependencies_patterns = var.external_dependencies_patterns

  # Caching and performance
  missed_cache_period_seconds     = var.missed_cache_period_seconds
  retrieval_cache_period_seconds  = var.retrieval_cache_period_seconds
  metadata_retrieval_timeout_secs = var.metadata_retrieval_timeout_secs

  # Advanced settings
  hard_fail               = var.hard_fail
  offline                 = var.offline
  blacked_out             = var.blacked_out
  store_artifacts_locally = var.store_artifacts_locally
  socket_timeout_millis   = var.socket_timeout_millis
  local_address           = var.local_address
  priority_resolution     = var.priority_resolution

  # Content synchronization
  content_synchronisation {
    enabled                         = var.content_sync_enabled
    statistics_enabled              = var.content_sync_statistics_enabled
    properties_enabled              = var.content_sync_properties_enabled
    source_origin_absence_detection = var.content_sync_source_origin_absence_detection
  }

  # Property sets
  property_sets = var.property_sets
}

# Virtual Repository (optional) - combines local and remote repositories
resource "artifactory_virtual_docker_repository" "our_service_virtual" {
  count = var.create_virtual_repository ? 1 : 0

  key                     = "${var.repository_key}-virtual"
  description             = "Virtual repository for ${var.service_name} (combines local and remote)"
  repositories            = concat([artifactory_remote_docker_repository.our_service_remote.key], var.additional_repositories)
  default_deployment_repo = var.default_deployment_repo

  # Virtual repository specific settings
  force_nuget_authentication                         = false
  artifactory_requests_can_retrieve_remote_artifacts = var.virtual_retrieve_remote_artifacts
  key_pair                                           = var.virtual_key_pair
  pom_repository_references_cleanup_policy           = var.virtual_pom_cleanup_policy

  # Docker specific virtual settings
  resolve_docker_tags_by_timestamp = var.virtual_resolve_docker_tags_by_timestamp

  notes = "Managed by Terraform - ${var.service_name} virtual repository"
}

# Local Repository (optional) - for caching and local artifacts
resource "artifactory_local_docker_v2_repository" "our_service_local" {
  count = var.create_local_repository ? 1 : 0

  key         = "${var.repository_key}-local"
  description = "Local repository for ${var.service_name} cached artifacts"

  # Docker V2 specific settings
  tag_retention   = var.local_tag_retention
  max_unique_tags = var.local_max_unique_tags

  # General settings
  notes            = "Managed by Terraform - ${var.service_name} local cache"
  includes_pattern = var.includes_pattern
  excludes_pattern = var.excludes_pattern
  repo_layout_ref  = "simple-default"

  # Archive browsing
  archive_browsing_enabled = var.local_archive_browsing_enabled

  # Property sets
  property_sets = var.property_sets
}
