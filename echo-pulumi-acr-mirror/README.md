# Echo ACR Artifact Cache - Pulumi Component

Configures Azure Container Registry (ACR) [artifact cache](https://learn.microsoft.com/en-us/azure/container-registry/artifact-cache-overview)
to pull Echo images through your own registry. ACR fetches an Echo image from
`reg.echohq.com` the first time a tag is pulled, then serves it from
`<your-registry>.azurecr.io`. Built on `@pulumi/azure-native` 3.x.

The component:

1. Stores your Images key name and value as two Key Vault secrets.
2. Creates an ACR **credential set** (`echo-registry`) that signs in to `reg.echohq.com`
   with those secrets, using a system-assigned managed identity.
3. Lets that identity read the two secrets: **Key Vault Secrets User** scoped to
   each secret on RBAC vaults, or a `Get` access policy on access-policy vaults.
4. Creates one **cache rule** per Echo image, for example
   `reg.echohq.com/python` → `echo/python`.

Images only: ACR artifact cache does not proxy PyPI, npm or Maven.

## Prerequisites

- An existing container registry and Key Vault, both in the subscription the
  `azure-native` provider is configured for.
- The identity running Pulumi needs:
  - **Contributor** on the container registry, to create the credential set and cache rules.
  - **Contributor** or **Key Vault Contributor** on the Key Vault. The secrets are written
    through the Azure Resource Manager API, so data-plane roles such as Key Vault Secrets
    Officer are not enough on their own.
  - **Owner**, **User Access Administrator** or **Role Based Access Control Administrator**
    on the Key Vault, to grant the credential set access to the secrets (RBAC vaults only).

## Install
```bash
pulumi package add github.com/buildecho/onboarding-providers/echo-pulumi-acr-mirror
```

## Usage
```ts
import * as pulumi from "@pulumi/pulumi";
import { AcrArtifactCache } from "@buildecho/echo-pulumi-acr-mirror";

const config = new pulumi.Config();

const cache = new AcrArtifactCache("echo-acr", {
  containerRegistryId: registry.id,
  keyVaultId: vault.id,
  echoImageKeyName: config.requireSecret("echoImageKeyName"),
  echoImageKeyValue: config.requireSecret("echoImageKeyValue"),
  images: ["python", "node", "nginx"],
});

export const pullReferences = cache.pullReferences;
```

A runnable example is in [`examples/default`](./examples/default).

## Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `containerRegistryId` | string | required | Resource ID of the existing registry |
| `keyVaultId` | string | required | Resource ID of the existing Key Vault |
| `echoImageKeyName` | Input<string> (secret) | required | Images key name |
| `echoImageKeyValue` | Input<string> (secret) | required | Images key value |
| `images` | string[] | required | Echo images to cache, one rule each (max 1,000 per registry) |
| `keyVaultRbacEnabled` | boolean | `true` | `false` for vaults that use access policies |
| `targetPrefix` | string | `"echo"` | ACR namespace for cached images; `""` caches at the root |
| `credentialSetName` | string | `"echo-registry"` | Credential set name (5-49 characters, ACR's limit) |
| `keyNameSecretName` | string | `"echo-images-key-name"` | Key Vault secret for the key name |
| `keyValueSecretName` | string | `"echo-images-key"` | Key Vault secret for the key value |
| `echoRegistryHost` | string | `"reg.echohq.com"` | Echo registry host |
| `tags` | Record<string, string> | `{}` | Tags for the Key Vault secrets |

Invalid inputs fail at `pulumi preview`. Cache rule names are `echo-<image>` with other
characters replaced by `-` (`bitnami/redis` → `echo-bitnami-redis`).

## Outputs

- `pullReferences`: per image, the reference to use instead of `reg.echohq.com/<image>:<tag>`
- `usageInstructions`: commands to check the credential set and pull an image
- `cacheRules`: per image, the rule name, source and target repository
- `credentialSetId` / `credentialSetPrincipalId`
- `registryLoginServer`

## Test

```bash
# Should print Healthy. A new role assignment can take a few minutes to apply.
az acr credential-set show --registry <registry> --name echo-registry \
  --query "authCredentials[0].credentialHealth.status" --output tsv

az acr login --name <registry>
docker pull <registry>.azurecr.io/echo/python:<tag>
```

Unit tests use Pulumi mocks and need no Azure access: `npm install && npm test`.

## Troubleshooting

- **Credential set shows `Unhealthy`**: wait a few minutes for the role assignments to apply,
  then check that the secrets hold a valid Images key that hasn't been revoked.
- **Rotating the key**: update the two config secrets and run `pulumi up`. The credential set
  reads the latest secret version, so it needs no other changes.
