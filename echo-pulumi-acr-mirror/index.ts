import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure-native";

/** Built-in "Key Vault Secrets User" role definition (same GUID in every tenant). */
export const KEY_VAULT_SECRETS_USER_ROLE_ID = "4633458b-17de-408a-b874-0445c86b69e6";

// ACR rejects credential set and cache rule names that are not 5-49 characters
// of letters, digits and single hyphens starting with a letter
// (GenericResourceNameWithHyphenInvalid). Verified against a live registry.
const ACR_CHILD_NAME = /^[a-zA-Z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*$/;
const IMAGE_PATH = /^[a-z0-9]+([._/-][a-z0-9]+)*$/;
const REGISTRY_ID = /^\/subscriptions\/([^/]+)\/resourceGroups\/([^/]+)\/providers\/Microsoft\.ContainerRegistry\/registries\/([^/]+)$/i;
const KEY_VAULT_ID = /^\/subscriptions\/([^/]+)\/resourceGroups\/([^/]+)\/providers\/Microsoft\.KeyVault\/vaults\/([^/]+)$/i;

export interface AcrArtifactCacheInput {
    /**
     * Resource ID of the existing Azure Container Registry that will cache Echo images.
     * The registry and the Key Vault must be in the azure-native provider's subscription.
     */
    containerRegistryId: string;

    /** Resource ID of the existing Key Vault that will hold the Echo Images key. */
    keyVaultId: string;

    /**
     * true when the Key Vault uses Azure RBAC (the default for new vaults): the
     * credential set identity gets Key Vault Secrets User on each Echo secret.
     * false when it uses access policies: an access policy with Get on secrets.
     * @default true
     */
    keyVaultRbacEnabled?: boolean;

    /** Echo Images key name (the username ACR signs in to Echo with). */
    echoImageKeyName: pulumi.Input<string>;

    /** Echo Images key value (the password ACR signs in to Echo with). */
    echoImageKeyValue: pulumi.Input<string>;

    /** @default "echo-images-key-name" */
    keyNameSecretName?: string;

    /** @default "echo-images-key" */
    keyValueSecretName?: string;

    /**
     * Echo images to cache, one cache rule per image, e.g. ["python", "node"].
     * Each rule covers every tag of that image. ACR allows 1,000 rules per registry.
     */
    images: string[];

    /**
     * ACR namespace for cached images: <registry>.azurecr.io/<targetPrefix>/<image>:<tag>.
     * Set to "" to cache at the registry root.
     * @default "echo"
     */
    targetPrefix?: string;

    /** Credential set name, 5-49 characters. @default "echo-registry" */
    credentialSetName?: string;

    /** Echo image registry URL; ACR uses its host name. @default "https://reg.echohq.com" */
    echoRegistryUrl?: string;

    /** Tags for the Key Vault secrets. */
    tags?: Record<string, string>;
}

export interface AcrArtifactCacheOutputs {
    /** Login server of the target registry. */
    registryLoginServer: pulumi.Output<string>;
    /** Resource ID of the Echo credential set. */
    credentialSetId: pulumi.Output<string>;
    /** Object ID of the credential set's managed identity. */
    credentialSetPrincipalId: pulumi.Output<string>;
    /** Per image, the reference to use instead of reg.echohq.com/<image>:<tag>. */
    pullReferences: pulumi.Output<Record<string, string>>;
    /** Commands to check the credential set and pull an image. */
    usageInstructions: pulumi.Output<string>;
}

export interface CacheRuleSpec {
    name: string;
    sourceRepo: string;
    targetRepo: string;
}

/** Cache rule name for an image, e.g. "bitnami/redis" -> "echo-bitnami-redis". */
export function cacheRuleName(image: string): string {
    return `echo-${image}`.replace(/[^a-zA-Z0-9]+/g, "-").slice(0, 49).replace(/-+$/, "");
}

export function buildCacheRules(images: string[], registryHost: string, targetPrefix: string): CacheRuleSpec[] {
    const prefix = targetPrefix === "" ? "" : `${targetPrefix}/`;
    return images.map(image => ({
        name: cacheRuleName(image),
        sourceRepo: `${registryHost}/${image}`,
        targetRepo: `${prefix}${image}`,
    }));
}

/** Throws on inputs ACR would reject, so mistakes fail at preview rather than mid-deploy. */
export function validateArgs(args: AcrArtifactCacheInput): void {
    const errors: string[] = [];
    if (!REGISTRY_ID.test(args.containerRegistryId)) {
        errors.push("containerRegistryId must be /subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.ContainerRegistry/registries/<name>");
    }
    if (!KEY_VAULT_ID.test(args.keyVaultId)) {
        errors.push("keyVaultId must be /subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.KeyVault/vaults/<name>");
    }
    if (args.images.length === 0 || args.images.length > 1000) {
        errors.push("images must list between 1 and 1000 images");
    }
    for (const image of args.images) {
        if (!IMAGE_PATH.test(image)) {
            errors.push(`image "${image}" must be a lowercase repository path such as "python" or "bitnami/redis", without a tag or registry host`);
        }
    }
    const names = args.images.map(cacheRuleName);
    const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
    if (duplicates.length > 0) {
        errors.push(`images produce duplicate cache rule names: ${[...new Set(duplicates)].join(", ")}`);
    }
    const credentialSetName = args.credentialSetName ?? "echo-registry";
    if (!ACR_CHILD_NAME.test(credentialSetName) || credentialSetName.length < 5 || credentialSetName.length > 49) {
        errors.push("credentialSetName must be 5-49 characters, start with a letter, and contain only letters, digits and single hyphens");
    }
    const prefix = args.targetPrefix ?? "echo";
    if (prefix !== "" && !IMAGE_PATH.test(prefix)) {
        errors.push("targetPrefix must be empty or a lowercase repository path without leading or trailing slashes");
    }
    if (!/^https:\/\/[a-z0-9.-]+\/?$/.test(args.echoRegistryUrl ?? "https://reg.echohq.com")) {
        errors.push("echoRegistryUrl must be an HTTPS URL with no path, such as https://reg.echohq.com");
    }
    if (errors.length > 0) {
        throw new Error(`AcrArtifactCache: invalid arguments:\n- ${errors.join("\n- ")}`);
    }
}

/**
 * Configures Azure Container Registry artifact cache to pull Echo images:
 * Key Vault secrets for the Images key, a credential set that signs in to
 * reg.echohq.com, read access for its identity, and one cache rule per image.
 */
export class AcrArtifactCache extends pulumi.ComponentResource {
    public readonly registryLoginServer: pulumi.Output<string>;
    public readonly credentialSetId: pulumi.Output<string>;
    public readonly credentialSetPrincipalId: pulumi.Output<string>;
    public readonly cacheRules: Record<string, CacheRuleSpec>;
    public readonly pullReferences: pulumi.Output<Record<string, string>>;
    public readonly usageInstructions: pulumi.Output<string>;

    constructor(name: string, args: AcrArtifactCacheInput, opts?: pulumi.ComponentResourceOptions) {
        super("echo-pulumi-acr-mirror:index:AcrArtifactCache", name, args, opts);
        validateArgs(args);

        const [, , registryRg, registryName] = REGISTRY_ID.exec(args.containerRegistryId)!;
        const [, vaultSub, vaultRg, vaultName] = KEY_VAULT_ID.exec(args.keyVaultId)!;
        const registryHost = (args.echoRegistryUrl ?? "https://reg.echohq.com").replace(/^https:\/\//, "").replace(/\/$/, "");
        const credentialSetName = args.credentialSetName ?? "echo-registry";
        const keyNameSecret = args.keyNameSecretName ?? "echo-images-key-name";
        const keyValueSecret = args.keyValueSecretName ?? "echo-images-key";
        const rbac = args.keyVaultRbacEnabled ?? true;
        const tags = { ...(args.tags ?? {}), purpose: "echo-registry-authentication" };
        const child = { parent: this };

        // Registries with a domain name label scope have a hashed login server,
        // so read it instead of deriving it from the name.
        this.registryLoginServer = azure.containerregistry
            .getRegistryOutput({ registryName, resourceGroupName: registryRg }, child)
            .apply(r => r.loginServer);

        // Key Vault secrets (ACR reads Echo credentials only from Key Vault).
        // Written through the Azure Resource Manager API, so the deploying
        // identity needs Contributor (or Key Vault Contributor) on the vault.
        const secret = (resourceName: string, secretName: string, value: pulumi.Input<string>, contentType: string) =>
            new azure.keyvault.Secret(`${name}-${resourceName}`, {
                resourceGroupName: vaultRg,
                vaultName,
                secretName,
                properties: { value: pulumi.secret(value), contentType },
                tags,
            }, child);
        const keyName = secret("key-name", keyNameSecret, args.echoImageKeyName, "Echo Images key name");
        const keyValue = secret("key-value", keyValueSecret, args.echoImageKeyValue, "Echo Images key");

        // Credential set: how ACR signs in to Echo.
        const credentialSet = new azure.containerregistry.CredentialSet(`${name}-credential-set`, {
            registryName,
            resourceGroupName: registryRg,
            credentialSetName,
            loginServer: registryHost,
            identity: { type: azure.containerregistry.ResourceIdentityType.SystemAssigned },
            authCredentials: [{
                name: azure.containerregistry.CredentialName.Credential1,
                // The secret URIs aren't sensitive; unsecret them so the credential
                // set's state and diffs stay readable.
                usernameSecretIdentifier: pulumi.unsecret(keyName.properties.apply(p => p.secretUri)),
                passwordSecretIdentifier: pulumi.unsecret(keyValue.properties.apply(p => p.secretUri)),
            }],
        }, child);

        this.credentialSetId = credentialSet.id;
        this.credentialSetPrincipalId = credentialSet.identity.apply(i => {
            if (!i?.principalId) throw new Error("credential set has no managed identity");
            return i.principalId;
        });

        // Let the credential set identity read the two Echo secrets.
        const readers: pulumi.Resource[] = [];
        if (rbac) {
            for (const [resourceName, secretName, dependsOn] of [
                ["key-name", keyNameSecret, keyName],
                ["key-value", keyValueSecret, keyValue],
            ] as const) {
                readers.push(new azure.authorization.RoleAssignment(`${name}-${resourceName}-reader`, {
                    scope: `${args.keyVaultId}/secrets/${secretName}`,
                    roleDefinitionId: `/subscriptions/${vaultSub}/providers/Microsoft.Authorization/roleDefinitions/${KEY_VAULT_SECRETS_USER_ROLE_ID}`,
                    principalId: this.credentialSetPrincipalId,
                    principalType: azure.authorization.PrincipalType.ServicePrincipal,
                }, { ...child, dependsOn: [dependsOn] }));
            }
        } else {
            // Access policies can't be scoped to single secrets.
            readers.push(new azure.keyvault.AccessPolicy(`${name}-secret-reader`, {
                resourceGroupName: vaultRg,
                vaultName,
                policy: {
                    tenantId: credentialSet.identity.apply(i => i!.tenantId!),
                    objectId: this.credentialSetPrincipalId,
                    permissions: { secrets: ["get"] },
                },
            }, child));
        }

        // Cache rules: one per Echo image.
        const rules = buildCacheRules(args.images, registryHost, args.targetPrefix ?? "echo");
        this.cacheRules = Object.fromEntries(args.images.map((image, i) => [image, rules[i]]));
        for (const rule of rules) {
            new azure.containerregistry.CacheRule(`${name}-${rule.name}`, {
                registryName,
                resourceGroupName: registryRg,
                cacheRuleName: rule.name,
                credentialSetResourceId: credentialSet.id,
                sourceRepository: rule.sourceRepo,
                targetRepository: rule.targetRepo,
            }, { ...child, dependsOn: readers });
        }

        this.pullReferences = this.registryLoginServer.apply(host =>
            Object.fromEntries(Object.entries(this.cacheRules).map(([image, rule]) => [image, `${host}/${rule.targetRepo}:<tag>`])));

        const prefix = (args.targetPrefix ?? "echo") === "" ? "" : `${args.targetPrefix ?? "echo"}/`;
        this.usageInstructions = this.registryLoginServer.apply(host => [
            `az acr credential-set show --registry ${registryName} --name ${credentialSetName} --query "authCredentials[0].credentialHealth.status" --output tsv   # expect Healthy`,
            `az acr login --name ${registryName}`,
            `docker pull ${host}/${prefix}<image>:<tag>`,
        ].join("\n"));

        this.registerOutputs({
            registryLoginServer: this.registryLoginServer,
            credentialSetId: this.credentialSetId,
            credentialSetPrincipalId: this.credentialSetPrincipalId,
            pullReferences: this.pullReferences,
            usageInstructions: this.usageInstructions,
        });
    }
}
