locals {
  # /subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.ContainerRegistry/registries/<name>
  registry_id_parts = split("/", var.container_registry_id)
  registry_rg       = local.registry_id_parts[4]
  registry_name     = local.registry_id_parts[8]
  # Read from the registry: registries with a domain name label scope have a
  # hashed login server (<name>-<hash>.azurecr.io), so it can't be derived.
  registry_login_host = one(data.azurerm_container_registry.target[*].login_server)

  target_prefix = var.target_prefix == "" ? "" : "${var.target_prefix}/"

  # Cache rule names allow letters, digits and single hyphens only, and are
  # limited to 50 characters, so image paths such as "bitnami/redis" or
  # "my.image" are normalised (e.g. "echo-bitnami-redis").
  cache_rules = var.create ? {
    for image in var.images : image => {
      name        = substr(trim(replace("echo-${image}", "/[^a-zA-Z0-9]+/", "-"), "-"), 0, 50)
      source_repo = "${var.echo_registry_host}/${image}"
      target_repo = "${local.target_prefix}${image}"
    }
  } : {}

  secrets = var.create ? {
    key_name  = var.key_name_secret_name
    key_value = var.key_value_secret_name
  } : {}
}

data "azurerm_container_registry" "target" {
  count = var.create ? 1 : 0

  name                = local.registry_name
  resource_group_name = local.registry_rg
}

# ---------------------------------------------------------------------------
# Key Vault: Echo Images key (ACR reads credentials only from Key Vault)
# ---------------------------------------------------------------------------

resource "azurerm_key_vault_secret" "echo_key_name" {
  count = var.create ? 1 : 0

  name         = var.key_name_secret_name
  value        = var.echo_image_key_name
  key_vault_id = var.key_vault_id
  content_type = "Echo Images key name"
  tags         = merge(var.tags, { purpose = "echo-registry-authentication" })
}

resource "azurerm_key_vault_secret" "echo_key_value" {
  count = var.create ? 1 : 0

  name         = var.key_value_secret_name
  value        = var.echo_image_key_value
  key_vault_id = var.key_vault_id
  content_type = "Echo Images key"
  tags         = merge(var.tags, { purpose = "echo-registry-authentication" })
}

# ---------------------------------------------------------------------------
# Credential set: how ACR signs in to Echo
# ---------------------------------------------------------------------------

resource "azurerm_container_registry_credential_set" "echo" {
  count = var.create ? 1 : 0

  name                  = var.credential_set_name
  container_registry_id = var.container_registry_id
  login_server          = var.echo_registry_host

  identity {
    type = "SystemAssigned"
  }

  authentication_credentials {
    username_secret_id = azurerm_key_vault_secret.echo_key_name[0].versionless_id
    password_secret_id = azurerm_key_vault_secret.echo_key_value[0].versionless_id
  }
}

# ---------------------------------------------------------------------------
# Let the credential set's identity read the two Echo secrets
# ---------------------------------------------------------------------------

# RBAC vaults: Key Vault Secrets User scoped to each secret, so the identity
# cannot read anything else in the vault.
resource "azurerm_role_assignment" "credential_set_secret_reader" {
  for_each = var.key_vault_rbac_enabled ? local.secrets : {}

  scope                = "${var.key_vault_id}/secrets/${each.value}"
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_container_registry_credential_set.echo[0].identity[0].principal_id
  principal_type       = "ServicePrincipal"

  depends_on = [
    azurerm_key_vault_secret.echo_key_name,
    azurerm_key_vault_secret.echo_key_value,
  ]
}

# Access-policy vaults: access policies cannot be scoped to single secrets.
resource "azurerm_key_vault_access_policy" "credential_set_secret_reader" {
  count = var.create && !var.key_vault_rbac_enabled ? 1 : 0

  key_vault_id       = var.key_vault_id
  tenant_id          = azurerm_container_registry_credential_set.echo[0].identity[0].tenant_id
  object_id          = azurerm_container_registry_credential_set.echo[0].identity[0].principal_id
  secret_permissions = ["Get"]
}

# ---------------------------------------------------------------------------
# Cache rules: one per Echo image
# ---------------------------------------------------------------------------

resource "azurerm_container_registry_cache_rule" "echo" {
  for_each = local.cache_rules

  name                  = each.value.name
  container_registry_id = var.container_registry_id
  credential_set_id     = azurerm_container_registry_credential_set.echo[0].id
  source_repo           = each.value.source_repo
  target_repo           = each.value.target_repo

  # The credential set must be able to read its secrets before a rule is used.
  depends_on = [
    azurerm_role_assignment.credential_set_secret_reader,
    azurerm_key_vault_access_policy.credential_set_secret_reader,
  ]
}
