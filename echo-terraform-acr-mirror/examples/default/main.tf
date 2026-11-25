provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

module "echo_acr_mirror" {
  source = "../.."

  container_registry_id = var.container_registry_id
  key_vault_id          = var.key_vault_id

  echo_image_key_name  = var.echo_image_key_name
  echo_image_key_value = var.echo_image_key_value

  images = var.images
}

output "pull_references" {
  value = module.echo_acr_mirror.pull_references
}

output "usage_instructions" {
  value = module.echo_acr_mirror.usage_instructions
}
