variable "subscription_id" {
  description = "Azure subscription that holds the registry and Key Vault."
  type        = string
}

variable "container_registry_id" {
  description = "Resource ID of the existing Azure Container Registry."
  type        = string
}

variable "key_vault_id" {
  description = "Resource ID of the existing Key Vault."
  type        = string
}

variable "echo_image_key_name" {
  description = "Echo Images key name."
  type        = string
  sensitive   = true
}

variable "echo_image_key_value" {
  description = "Echo Images key value."
  type        = string
  sensitive   = true
}

variable "images" {
  description = "Echo images to cache."
  type        = list(string)
  default     = ["python", "node"]
}
