// The component creates a customer managed KMS key (with rotation and an alias)
// whose key policy allows the component-created repository creation role.
//
//   pulumi stack init test
//   pulumi config set aws:region us-east-1
//   pulumi config set echoRegistryAccountId <echo registry account id>
//   pulumi up
import * as pulumi from "@pulumi/pulumi";
import { EcrPullThroughCache } from "../../index";

const config = new pulumi.Config();
const cacheNamespace = config.require("cacheNamespace");

const cache = new EcrPullThroughCache("echo-cache", {
    echoRegistryAccountId: config.require("echoRegistryAccountId"),
    cacheNamespace,
    roleName: `${cacheNamespace}-ptc-role`,
    policyName: `${cacheNamespace}-ptc-policy`,

    createRepositoryCreationTemplate: true,
    encryptionType: "KMS",
    createKmsKey: true,
    kmsKeyAlias: `alias/${cacheNamespace}`,
    creationRoleName: `${cacheNamespace}-repo-creation-role`,
});

export const usage = cache.usageInstructions;
export const kmsKeyArn = cache.kmsKeyArn;
