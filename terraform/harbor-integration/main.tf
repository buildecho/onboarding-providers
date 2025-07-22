terraform {
  required_version = ">= 1.0"
  required_providers {
    harbor = {
      source  = "goharbor/harbor"
      version = ">= 3.9"
    }
  }
}

# Configure the Harbor Provider
provider "harbor" {
  url      = var.harbor_url
  username = var.harbor_username
  password = var.harbor_password
  insecure = var.harbor_insecure
}

# Harbor Project for Echo registry integration
resource "harbor_project" "our_service_project" {
  count = var.create_project ? 1 : 0

  name                   = var.project_name
  public                 = var.project_public
  vulnerability_scanning = var.vulnerability_scanning_enabled

  dynamic "cve_allowlist" {
    for_each = var.cve_allowlist != null ? [var.cve_allowlist] : []
    content {
      project_id = harbor_project.our_service_project[0].project_id
      items      = cve_allowlist.value
    }
  }
}

# Registry for Echo registry
resource "harbor_registry" "our_service_registry" {
  provider_name = var.registry_provider_name
  name          = var.registry_name
  endpoint_url  = var.remote_registry_url
  description   = "Registry for ${var.service_name} integration"
  insecure      = var.registry_insecure

  dynamic "credential" {
    for_each = var.remote_registry_username != "" ? [1] : []
    content {
      type          = "basic"
      access_key    = var.remote_registry_username
      access_secret = var.remote_registry_password
    }
  }
}

# Replication Policy - Pull from Echo registry to Harbor
resource "harbor_replication" "our_service_pull_replication" {
  count = var.enable_pull_replication ? 1 : 0

  name           = "${var.service_name}-pull-replication"
  description    = "Pull replication from ${var.service_name} to Harbor"
  action         = "pull"
  registry_id    = harbor_registry.our_service_registry.registry_id
  dest_namespace = var.create_project ? harbor_project.our_service_project[0].name : var.destination_namespace

  # Filters
  dynamic "filters" {
    for_each = var.replication_filters != null ? [var.replication_filters] : []
    content {
      name = filters.value.name
      tag  = filters.value.tag
    }
  }

  # Trigger settings
  trigger {
    type = var.replication_trigger_type

    dynamic "trigger_settings" {
      for_each = var.replication_trigger_type == "scheduled" ? [var.replication_schedule] : []
      content {
        cron = trigger_settings.value
      }
    }
  }

  # Advanced settings
  deletion      = var.replication_deletion
  override      = var.replication_override
  enabled       = var.replication_enabled
  copy_by_chunk = var.replication_copy_by_chunk
  speed         = var.replication_speed
}

# Replication Policy - Push from Harbor to Echo registry (optional)
resource "harbor_replication" "our_service_push_replication" {
  count = var.enable_push_replication ? 1 : 0

  name          = "${var.service_name}-push-replication"
  description   = "Push replication from Harbor to ${var.service_name}"
  action        = "push"
  registry_id   = harbor_registry.our_service_registry.registry_id
  src_namespace = var.create_project ? harbor_project.our_service_project[0].name : var.source_namespace

  # Filters
  dynamic "filters" {
    for_each = var.push_replication_filters != null ? [var.push_replication_filters] : []
    content {
      name = filters.value.name
      tag  = filters.value.tag
    }
  }

  # Trigger settings
  trigger {
    type = var.push_replication_trigger_type

    dynamic "trigger_settings" {
      for_each = var.push_replication_trigger_type == "scheduled" ? [var.push_replication_schedule] : []
      content {
        cron = trigger_settings.value
      }
    }
  }

  # Advanced settings
  deletion      = var.push_replication_deletion
  override      = var.push_replication_override
  enabled       = var.push_replication_enabled
  copy_by_chunk = var.push_replication_copy_by_chunk
  speed         = var.push_replication_speed
}

# Webhook for notifications (optional)
resource "harbor_webhook" "our_service_webhook" {
  count = var.enable_webhook ? 1 : 0

  project_id       = var.create_project ? harbor_project.our_service_project[0].project_id : var.webhook_project_id
  name             = "${var.service_name}-webhook"
  description      = "Webhook for ${var.service_name} notifications"
  address          = var.webhook_url
  auth_header      = var.webhook_auth_header
  skip_cert_verify = var.webhook_skip_cert_verify

  notify_type = var.webhook_notify_types
  enabled     = var.webhook_enabled
}

# Robot Account for programmatic access (optional)
resource "harbor_robot_account" "our_service_robot" {
  count = var.create_robot_account ? 1 : 0

  name        = "${var.service_name}-robot"
  description = "Robot account for ${var.service_name} integration"
  level       = var.robot_account_level
  duration    = var.robot_account_duration

  dynamic "permissions" {
    for_each = var.robot_account_permissions
    content {
      access {
        action   = permissions.value.action
        resource = permissions.value.resource
      }
      namespace = permissions.value.namespace
    }
  }
}
