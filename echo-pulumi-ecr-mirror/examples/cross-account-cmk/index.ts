// KMS key owned by a DIFFERENT account. EcrKmsKeyOwner runs with a provider for
// the key owner account; EcrPullThroughCache runs with the default provider
// (the pull-through cache account). Both must use the same Region.
//
//   pulumi stack init test
//   pulumi config set aws:region us-east-1
//   pulumi config set aws:profile <profile for the pull-through cache account>
//   pulumi config set echoRegistryAccountId <echo registry account id>
//   pulumi config set keyOwnerProfile <profile for the key owner account>
//   # optional: pulumi config set keyOwnerAssumeRoleArn arn:aws:iam::<key owner account id>:role/<role>
//   pulumi up
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { EcrKmsKeyOwner, EcrPullThroughCache } from "../../index";

const config = new pulumi.Config();
const cacheNamespace = config.require("cacheNamespace");
const keyOwnerProfile = config.get("keyOwnerProfile");
const keyOwnerAssumeRoleArn = config.get("keyOwnerAssumeRoleArn");
const creationRoleName = `${cacheNamespace}-repo-creation-role`;

const keyOwnerProvider = new aws.Provider("key-owner", {
    region: aws.config.requireRegion(),
    profile: keyOwnerProfile || undefined,
    assumeRole: keyOwnerAssumeRoleArn ? { roleArn: keyOwnerAssumeRoleArn } : undefined,
});

const keyOwner = new EcrKmsKeyOwner("echo-kms-key-owner", {
    consumerAccountId: aws.getCallerIdentityOutput().accountId,
    consumerCreationRoleName: creationRoleName,
    kmsKeyAlias: `alias/${cacheNamespace}`,
}, { providers: { aws: keyOwnerProvider } });

const cache = new EcrPullThroughCache("echo-cache", {
    echoRegistryAccountId: config.require("echoRegistryAccountId"),
    cacheNamespace,
    roleName: `${cacheNamespace}-ptc-role`,
    policyName: `${cacheNamespace}-ptc-policy`,

    createRepositoryCreationTemplate: true,
    encryptionType: "KMS",
    kmsKeyArn: keyOwner.kmsKeyArn.apply(arn => arn!),
    creationRoleName,
});

export const usage = cache.usageInstructions;
export const kmsKeyArn = cache.kmsKeyArn;
export const kmsKeyIsCrossAccount = cache.kmsKeyIsCrossAccount;
