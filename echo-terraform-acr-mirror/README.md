# Echo ACR Artifact Cache - Terraform Module

Configures Azure Container Registry (ACR) [artifact cache](https://learn.microsoft.com/en-us/azure/container-registry/artifact-cache-overview)
to pull Echo images through your own registry. ACR fetches an Echo image from
`reg.echohq.com` the first time a tag is pulled, then serves it from
`<your-registry>.azurecr.io`.

The module does the same steps as the Azure CLI setup in the Echo docs:

1. Stores your Images key name and value as two Key Vault secrets.
2. Creates an ACR **credential set** (`echo`) that signs in to `reg.echohq.com`
   with those secrets, using a system-assigned managed identity.
3. Lets that identity read the two secrets: **Key Vault Secrets User** scoped to
   each secret on RBAC vaults, or a `Get` access policy on access-policy vaults.
4. Creates one **cache rule** per Echo image, for example
   `reg.echohq.com/python` → `echo/python`.

Images only: ACR artifact cache does not proxy PyPI, npm or Maven.

## Prerequisites

- An existing container registry and Key Vault (any vault works, including a new, empty one).
- `azurerm` provider 4.16.0 or later.
- The identity running Terraform needs:
  - **Contributor** on the container registry, to create the credential set and cache rules.
  - **Key Vault Secrets Officer** on the Key Vault, to write the secrets (or `Set`/`Get`
    secret permissions on an access-policy vault). Subscription Owner or Contributor alone
    is not enough on an RBAC vault.
  - **Owner**, **User Access Administrator** or **Role Based Access Control Administrator**
    on the Key Vault, to grant the credential set access to the secrets (RBAC vaults only).

## Quickstart

```hcl
module "echo_acr_mirror" {
  source = "git@github.com:buildecho/onboarding-providers.git//echo-terraform-acr-mirror"

  container_registry_id = azurerm_container_registry.this.id
  key_vault_id          = azurerm_key_vault.this.id

  echo_image_key_name  = var.echo_image_key_name
  echo_image_key_value = var.echo_image_key_value

  images = ["python", "node", "nginx"]
}

output "pull_references" {
  value = module.echo_acr_mirror.pull_references
}
```

```bash
terraform init && terraform apply
```

A runnable example is in [`examples/default`](./examples/default).

## Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `container_registry_id` | string | required | Resource ID of the existing registry |
| `key_vault_id` | string | required | Resource ID of the existing Key Vault |
| `echo_image_key_name` | string (sensitive) | required | Images key name |
| `echo_image_key_value` | string (sensitive) | required | Images key value |
| `images` | list(string) | required | Echo images to cache, one rule each (max 1,000 per registry) |
| `key_vault_rbac_enabled` | bool | `true` | `false` for vaults that use access policies |
| `target_prefix` | string | `"echo"` | ACR namespace for cached images; `""` caches at the root |
| `credential_set_name` | string | `"echo"` | Credential set name |
| `key_name_secret_name` | string | `"echo-images-key-name"` | Key Vault secret for the key name |
| `key_value_secret_name` | string | `"echo-images-key"` | Key Vault secret for the key value |
| `echo_registry_host` | string | `"reg.echohq.com"` | Echo registry host |
| `create` | bool | `true` | Set to `false` to create nothing |
| `tags` | map(string) | `{}` | Tags for the Key Vault secrets |

Cache rule names allow only letters, digits and hyphens, so the module names
each rule `echo-<image>` with other characters replaced by `-`
(`bitnami/redis` → `echo-bitnami-redis`).

## Outputs

- `pull_references`: per image, the reference to use instead of `reg.echohq.com/<image>:<tag>`
- `usage_instructions`: commands to check the credential set and pull an image
- `cache_rules`: per image, the rule name, source and target repository
- `credential_set_id` / `credential_set_principal_id`
- `registry_login_server`

## Test

```bash
# Should print Healthy. A new role assignment can take a few minutes to apply.
az acr credential-set show --registry <registry> --name echo \
  --query "authCredentials[0].credentialHealth.status" --output tsv

az acr login --name <registry>
docker pull <registry>.azurecr.io/echo/python:<tag>
```

The first pull of a tag is slower because ACR fetches it from Echo while serving it.

Module tests use a mocked provider and need no Azure access:

```bash
terraform init -backend=false && terraform test
```

## Troubleshooting

- **"The operation is not allowed by RBAC" when writing secrets**: the identity running
  Terraform needs **Key Vault Secrets Officer** on the vault.
- **Credential set shows `Unhealthy`**: wait a few minutes for the role assignments to apply,
  then check that the secrets hold a valid Images key that hasn't been revoked.
- **Rotating the key**: update `echo_image_key_name` / `echo_image_key_value` and apply.
  The credential set reads the latest secret version, so it needs no other changes.
