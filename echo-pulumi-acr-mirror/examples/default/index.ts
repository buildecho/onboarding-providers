// Default: cache two Echo images in an existing registry, with the Images key
// stored in an existing RBAC Key Vault.
//
//   pulumi stack init test
//   pulumi config set azure-native:subscriptionId <subscription id>
//   pulumi config set containerRegistryId <registry resource id>
//   pulumi config set keyVaultId <key vault resource id>
//   pulumi config set --secret echoImageKeyName <Images key name>
//   pulumi config set --secret echoImageKeyValue <Images key value>
//   pulumi up
import * as pulumi from "@pulumi/pulumi";
// In your own program: import { AcrArtifactCache } from "@buildecho/echo-pulumi-acr-mirror";
import { AcrArtifactCache } from "../../index";

const config = new pulumi.Config();

const cache = new AcrArtifactCache("echo-acr", {
    containerRegistryId: config.require("containerRegistryId"),
    keyVaultId: config.require("keyVaultId"),
    echoImageKeyName: config.requireSecret("echoImageKeyName"),
    echoImageKeyValue: config.requireSecret("echoImageKeyValue"),
    images: ["python", "node"],
});

export const pullReferences = cache.pullReferences;
export const usage = cache.usageInstructions;
