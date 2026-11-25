terraform {
  required_version = ">= 1.7"

  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      # azurerm_container_registry_credential_set was added in 4.16.0.
      version = ">= 4.16.0"
    }
  }
}
