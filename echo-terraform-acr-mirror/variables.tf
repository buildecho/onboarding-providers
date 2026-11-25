variable "create" {
  description = "Whether to provision the resources under this module."
  type        = bool
  default     = true
}

# ---------------------------------------------------------------------------
# Target registry and Key Vault (both must already exist)
# ---------------------------------------------------------------------------

variable "container_registry_id" {
  description = "Resource ID of the existing Azure Container Registry that will cache Echo images."
  type        = string

  validation {
    condition     = can(regex("(?i)^/subscriptions/[^/]+/resourceGroups/[^/]+/providers/Microsoft\\.ContainerRegistry/registries/[^/]+$", var.container_registry_id))
    error_message = "container_registry_id must be a registry resource ID: /subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.ContainerRegistry/registries/<name>."
  }
}

variable "key_vault_id" {
  description = "Resource ID of the existing Key Vault that will hold the Echo Images key. Any vault works, including a new, empty one."
  type        = string

  validation {
    condition     = can(regex("(?i)^/subscriptions/[^/]+/resourceGroups/[^/]+/providers/Microsoft\\.KeyVault/vaults/[^/]+$", var.key_vault_id))
    error_message = "key_vault_id must be a Key Vault resource ID: /subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.KeyVault/vaults/<name>."
  }
}

variable "key_vault_rbac_enabled" {
  description = "Set to true when the Key Vault uses Azure RBAC (the default for new vaults). Set to false when it uses access policies; the module then adds an access policy with Get on secrets instead of role assignments."
  type        = bool
  default     = true
}

# ---------------------------------------------------------------------------
# Echo credentials
# ---------------------------------------------------------------------------

variable "echo_image_key_name" {
  description = "Echo Images key name (used as the username when ACR signs in to Echo)."
  type        = string
  sensitive   = true

  validation {
    condition     = length(var.echo_image_key_name) > 0
    error_message = "echo_image_key_name must not be empty."
  }
}

variable "echo_image_key_value" {
  description = "Echo Images key value (used as the password when ACR signs in to Echo)."
  type        = string
  sensitive   = true

  validation {
    condition     = length(var.echo_image_key_value) > 0
    error_message = "echo_image_key_value must not be empty."
  }
}

variable "key_name_secret_name" {
  description = "Name of the Key Vault secret that stores the Echo Images key name."
  type        = string
  default     = "echo-images-key-name"
}

variable "key_value_secret_name" {
  description = "Name of the Key Vault secret that stores the Echo Images key value."
  type        = string
  default     = "echo-images-key"
}

# ---------------------------------------------------------------------------
# Artifact cache
# ---------------------------------------------------------------------------

variable "echo_registry_host" {
  description = "Host name of the Echo image registry (no scheme)."
  type        = string
  default     = "reg.echohq.com"

  validation {
    condition     = can(regex("^[a-z0-9.-]+$", var.echo_registry_host))
    error_message = "echo_registry_host must be a bare host name such as reg.echohq.com (no https://, no path)."
  }
}

variable "credential_set_name" {
  description = "Name of the ACR credential set that holds the Echo sign-in."
  type        = string
  default     = "echo"

  validation {
    condition     = can(regex("^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$", var.credential_set_name))
    error_message = "credential_set_name may contain only letters, digits and single hyphens."
  }
}

variable "images" {
  description = "Echo images to cache, one cache rule per image (for example [\"python\", \"node\", \"nginx\"]). Each rule covers every tag of that image."
  type        = list(string)

  validation {
    condition     = length(var.images) > 0 && length(var.images) <= 1000
    error_message = "images must list between 1 and 1000 images (ACR allows up to 1,000 cache rules per registry)."
  }

  validation {
    condition     = alltrue([for i in var.images : can(regex("^[a-z0-9]+([._/-][a-z0-9]+)*$", i))])
    error_message = "Each image must be a lowercase repository path such as \"python\" or \"bitnami/redis\", without a tag or registry host."
  }
}

variable "target_prefix" {
  description = "Repository namespace in ACR under which Echo images are cached. Images are pulled as <registry>.azurecr.io/<target_prefix>/<image>:<tag>. Set to \"\" to cache at the registry root."
  type        = string
  default     = "echo"

  validation {
    condition     = var.target_prefix == "" || can(regex("^[a-z0-9]+([._/-][a-z0-9]+)*$", var.target_prefix))
    error_message = "target_prefix must be empty or a lowercase repository path without leading or trailing slashes."
  }
}

variable "tags" {
  description = "Tags to apply to the Key Vault secrets."
  type        = map(string)
  default     = {}
}
