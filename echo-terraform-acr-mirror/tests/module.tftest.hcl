mock_provider "azurerm" {
  override_data {
    target = data.azurerm_container_registry.target[0]
    values = {
      login_server = "myregistry.azurecr.io"
    }
  }

  mock_resource "azurerm_container_registry_credential_set" {
    defaults = {
      id = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-rg/providers/Microsoft.ContainerRegistry/registries/myregistry/credentialSets/echo-registry"
      identity = {
        principal_id = "11111111-1111-1111-1111-111111111111"
        tenant_id    = "22222222-2222-2222-2222-222222222222"
      }
    }
  }

  mock_resource "azurerm_key_vault_secret" {
    defaults = {
      versionless_id = "https://my-vault.vault.azure.net/secrets/mock"
    }
  }
}

variables {
  container_registry_id = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-rg/providers/Microsoft.ContainerRegistry/registries/myregistry"
  key_vault_id          = "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-rg/providers/Microsoft.KeyVault/vaults/my-vault"
  echo_image_key_name   = "key-name"
  echo_image_key_value  = "key-value"
  images                = ["python", "bitnami/redis"]
}

run "credential_set_points_at_echo" {
  command = apply

  assert {
    condition     = azurerm_container_registry_credential_set.echo[0].login_server == "reg.echohq.com"
    error_message = "The credential set must sign in to reg.echohq.com."
  }

  assert {
    condition     = azurerm_key_vault_secret.echo_key_name[0].name == "echo-images-key-name" && azurerm_key_vault_secret.echo_key_value[0].name == "echo-images-key"
    error_message = "Secret names must match the documented defaults."
  }
}

run "cache_rules_per_image" {
  command = apply

  assert {
    condition     = length(azurerm_container_registry_cache_rule.echo) == 2
    error_message = "One cache rule per image is expected."
  }

  assert {
    condition     = azurerm_container_registry_cache_rule.echo["python"].source_repo == "reg.echohq.com/python" && azurerm_container_registry_cache_rule.echo["python"].target_repo == "echo/python"
    error_message = "python must cache reg.echohq.com/python under echo/python."
  }

  assert {
    condition     = azurerm_container_registry_cache_rule.echo["bitnami/redis"].name == "echo-bitnami-redis"
    error_message = "Nested image paths must produce a valid cache rule name."
  }

  assert {
    condition     = output.pull_references["python"] == "myregistry.azurecr.io/echo/python:<tag>"
    error_message = "Pull references must use the registry login server."
  }
}

run "rbac_vault_scopes_roles_to_secrets" {
  command = apply

  assert {
    condition     = length(azurerm_role_assignment.credential_set_secret_reader) == 2 && length(azurerm_key_vault_access_policy.credential_set_secret_reader) == 0
    error_message = "RBAC vaults get two role assignments and no access policy."
  }

  assert {
    condition     = azurerm_role_assignment.credential_set_secret_reader["key_value"].scope == "${var.key_vault_id}/secrets/echo-images-key"
    error_message = "Role assignments must be scoped to the individual secret."
  }

  assert {
    condition     = azurerm_role_assignment.credential_set_secret_reader["key_value"].principal_id == "11111111-1111-1111-1111-111111111111"
    error_message = "Role assignments must target the credential set identity."
  }
}

run "access_policy_vault" {
  command = apply

  variables {
    key_vault_rbac_enabled = false
  }

  assert {
    condition     = length(azurerm_role_assignment.credential_set_secret_reader) == 0 && length(azurerm_key_vault_access_policy.credential_set_secret_reader) == 1
    error_message = "Access-policy vaults get one access policy and no role assignments."
  }
}

run "root_target_prefix" {
  command = apply

  variables {
    target_prefix = ""
  }

  assert {
    condition     = azurerm_container_registry_cache_rule.echo["python"].target_repo == "python"
    error_message = "An empty target_prefix caches at the registry root."
  }
}

run "create_false_creates_nothing" {
  command = apply

  variables {
    create = false
  }

  assert {
    condition     = length(azurerm_container_registry_cache_rule.echo) == 0 && length(azurerm_container_registry_credential_set.echo) == 0 && length(azurerm_key_vault_secret.echo_key_name) == 0
    error_message = "create = false must not create resources."
  }
}

run "rejects_image_with_tag" {
  command = plan

  variables {
    images = ["python:3.12"]
  }

  expect_failures = [var.images]
}

run "rejects_short_credential_set_name" {
  command = plan

  variables {
    credential_set_name = "echo"
  }

  expect_failures = [var.credential_set_name]
}

run "rejects_registry_host_with_scheme" {
  command = plan

  variables {
    echo_registry_host = "https://reg.echohq.com"
  }

  expect_failures = [var.echo_registry_host]
}
