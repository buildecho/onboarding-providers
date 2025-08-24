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
  name          = var.registry_name
  description   = var.registry_description
  access_id     = var.echo_access_key_name
  access_secret = var.echo_access_key_value
}

resource "harbor_project" "echo_proxy_cache" {
  count = var.create ? 1 : 0

  name                      = var.project_name
  registry_id              = harbor_registry.echo_registry[0].registry_id
  public                   = var.project_public
  vulnerability_scanning   = var.vulnerability_scanning
  enable_content_trust     = var.enable_content_trust
  enable_content_trust_cosign = var.enable_content_trust_cosign
  auto_sbom_generation     = var.auto_sbom_generation

  depends_on = [harbor_registry.echo_registry]
}
