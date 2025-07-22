terraform {
  required_version = ">= 1.0"
  required_providers {
    harbor = {
      source  = "goharbor/harbor"
      version = ">= 3.10.21"
    }
  }
}

resource "harbor_registry" "echo_registry" {
  count = var.create ? 1 : 0

  provider_name = "docker-registry"
  endpoint_url  = var.echo_registry_url
  name          = "echo-registry"
  description   = "Echo Registry"
  access_id     = var.echo_access_key_name
  access_secret = var.echo_access_key_value
}

resource "harbor_project" "echo_proxy_cache" {
  count = var.create ? 1 : 0

  name        = "echo"
  registry_id = harbor_registry.echo_registry[0].registry_id
}
