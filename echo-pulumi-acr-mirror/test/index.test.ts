import { test, beforeEach } from "node:test";
import * as assert from "node:assert/strict";
import * as pulumi from "@pulumi/pulumi";

interface CreatedResource { type: string; name: string; inputs: any }
let created: CreatedResource[] = [];

const SUB = "00000000-0000-0000-0000-000000000000";
const REGISTRY_ID = `/subscriptions/${SUB}/resourceGroups/my-rg/providers/Microsoft.ContainerRegistry/registries/myregistry`;
const VAULT_ID = `/subscriptions/${SUB}/resourceGroups/my-rg/providers/Microsoft.KeyVault/vaults/my-vault`;

pulumi.runtime.setMocks({
    newResource(args) {
        created.push({ type: args.type, name: args.name, inputs: args.inputs });
        const state: Record<string, unknown> = { ...args.inputs };
        if (args.type === "azure-native:keyvault:Secret") {
            state.properties = { secretUri: `https://my-vault.vault.azure.net/secrets/${args.inputs.secretName}` };
        }
        if (args.type === "azure-native:containerregistry:CredentialSet") {
            state.identity = { type: "SystemAssigned", principalId: "11111111-1111-1111-1111-111111111111", tenantId: "22222222-2222-2222-2222-222222222222" };
        }
        return { id: `${args.name}-id`, state };
    },
    call(args) {
        if (args.token === "azure-native:containerregistry:getRegistry") {
            return { loginServer: `${args.inputs.registryName}.azurecr.io` };
        }
        return {};
    },
}, "project", "stack", false);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AcrArtifactCache, cacheRuleName, KEY_VAULT_SECRETS_USER_ROLE_ID } = require("../index") as typeof import("../index");

function value<T>(output: pulumi.Output<T>): Promise<T> {
    return (output as any).promise();
}

async function settle(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
}

const ofType = (type: string) => created.filter(r => r.type === type);
const base = {
    containerRegistryId: REGISTRY_ID,
    keyVaultId: VAULT_ID,
    echoImageKeyName: "key-name",
    echoImageKeyValue: "key-value",
    images: ["python", "bitnami/redis"],
};

beforeEach(() => { created = []; });

test("credential set signs in to reg.echohq.com with the two Key Vault secrets", async () => {
    const cache = new AcrArtifactCache("t", base);
    await value(cache.usageInstructions);
    await settle();
    const [cs] = ofType("azure-native:containerregistry:CredentialSet");
    assert.equal(cs.inputs.credentialSetName, "echo-registry");
    assert.equal(cs.inputs.loginServer, "reg.echohq.com");
    assert.equal(cs.inputs.identity.type, "SystemAssigned");
    assert.equal(cs.inputs.authCredentials[0].usernameSecretIdentifier, "https://my-vault.vault.azure.net/secrets/echo-images-key-name");
    assert.equal(cs.inputs.authCredentials[0].passwordSecretIdentifier, "https://my-vault.vault.azure.net/secrets/echo-images-key");
    assert.deepEqual(ofType("azure-native:keyvault:Secret").map(s => s.inputs.secretName).sort(), ["echo-images-key", "echo-images-key-name"]);
});

test("one cache rule per image under the echo/ prefix", async () => {
    const cache = new AcrArtifactCache("t", base);
    const pulls = await value(cache.pullReferences);
    await settle();
    const rules = ofType("azure-native:containerregistry:CacheRule").map(r => r.inputs);
    assert.deepEqual(rules.map(r => [r.cacheRuleName, r.sourceRepository, r.targetRepository]).sort(), [
        ["echo-bitnami-redis", "reg.echohq.com/bitnami/redis", "echo/bitnami/redis"],
        ["echo-python", "reg.echohq.com/python", "echo/python"],
    ]);
    assert.ok(rules.every(r => r.credentialSetResourceId === "t-credential-set-id"));
    assert.equal(pulls["python"], "myregistry.azurecr.io/echo/python:<tag>");
});

test("RBAC vault: Key Vault Secrets User scoped to each secret", async () => {
    const cache = new AcrArtifactCache("t", base);
    await value(cache.usageInstructions);
    await settle();
    const roles = ofType("azure-native:authorization:RoleAssignment").map(r => r.inputs);
    assert.deepEqual(roles.map(r => r.scope).sort(), [`${VAULT_ID}/secrets/echo-images-key`, `${VAULT_ID}/secrets/echo-images-key-name`]);
    assert.ok(roles.every(r => r.roleDefinitionId.endsWith(`/roleDefinitions/${KEY_VAULT_SECRETS_USER_ROLE_ID}`)));
    assert.ok(roles.every(r => r.principalId === "11111111-1111-1111-1111-111111111111"));
    assert.equal(ofType("azure-native:keyvault:AccessPolicy").length, 0);
});

test("access-policy vault: one Get policy, no role assignments", async () => {
    const cache = new AcrArtifactCache("t", { ...base, keyVaultRbacEnabled: false });
    await value(cache.usageInstructions);
    await settle();
    assert.equal(ofType("azure-native:authorization:RoleAssignment").length, 0);
    const [policy] = ofType("azure-native:keyvault:AccessPolicy");
    assert.deepEqual(policy.inputs.policy.permissions.secrets, ["get"]);
    assert.equal(policy.inputs.policy.objectId, "11111111-1111-1111-1111-111111111111");
});

test("empty targetPrefix caches at the registry root", async () => {
    const cache = new AcrArtifactCache("t", { ...base, images: ["python"], targetPrefix: "" });
    await value(cache.usageInstructions);
    await settle();
    assert.equal(ofType("azure-native:containerregistry:CacheRule")[0].inputs.targetRepository, "python");
});

test("cache rule names fit ACR's 5-49 character rule", () => {
    assert.equal(cacheRuleName("bitnami/redis"), "echo-bitnami-redis");
    const long = cacheRuleName("a".repeat(60));
    assert.ok(long.length <= 49 && long.length >= 5);
    assert.ok(!cacheRuleName("x".repeat(43) + "/yy").endsWith("-"));
});

test("rejects inputs ACR would refuse", () => {
    assert.throws(() => new AcrArtifactCache("bad1", { ...base, credentialSetName: "echo" }), /credentialSetName/);
    assert.throws(() => new AcrArtifactCache("bad2", { ...base, images: ["python:3.12"] }), /image "python:3.12"/);
    assert.throws(() => new AcrArtifactCache("bad3", { ...base, echoRegistryUrl: "reg.echohq.com" }), /echoRegistryUrl/);
    assert.throws(() => new AcrArtifactCache("bad4", { ...base, containerRegistryId: "myregistry" }), /containerRegistryId/);
    assert.throws(() => new AcrArtifactCache("bad5", { ...base, images: [] }), /between 1 and 1000/);
});
