terraform {
  required_version = ">= 1.0"
  required_providers {
    harbor = {
      source  = "goharbor/harbor"
      version = ">= 3.10.21"
    }
  }
}

locals {
  registry_name = var.registry_name != "" ? var.registry_name : "${var.resource_prefix}-registry"
  project_name  = var.project_name != "" ? var.project_name : "${var.resource_prefix}-project"
}

resource "harbor_registry" "echo_registry" {
  count = var.create ? 1 : 0

  provider_name = "docker-registry"
  endpoint_url  = var.echo_registry_url
  name          = local.registry_name
  description   = "Echo Registry managed by ${var.resource_prefix}"
  access_id     = var.echo_access_key_name
  access_secret = var.echo_access_key_value
}

resource "harbor_project" "echo_proxy_cache" {
  count = var.create ? 1 : 0

  name        = local.project_name
  registry_id = harbor_registry.echo_registry[0].registry_id
}
