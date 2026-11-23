// Existing customer managed KMS key in the SAME account and Region. The component
// creates the repository creation role and grants it kms:CreateGrant /
// kms:RetireGrant / kms:DescribeKey on the key via IAM (works when the key policy
// delegates to IAM, as the default key policy does).
//
//   pulumi stack init test
//   pulumi config set aws:region us-east-1
//   pulumi config set echoRegistryAccountId <echo registry account id>
//   pulumi config set kmsKeyArn arn:aws:kms:us-east-1:<this account id>:key/<key id>
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
    kmsKeyArn: config.require("kmsKeyArn"),
    creationRoleName: `${cacheNamespace}-repo-creation-role`,

    lifecyclePolicy: JSON.stringify({
        rules: [{
            rulePriority: 1,
            description: "Expire untagged images after 14 days",
            selection: { tagStatus: "untagged", countType: "sinceImagePushed", countUnit: "days", countNumber: 14 },
            action: { type: "expire" },
        }],
    }),
    repositoryTags: { "managed-by": "echo-pulumi-ecr-mirror" },
});

export const usage = cache.usageInstructions;
export const creationRoleArn = cache.repositoryCreationRoleArn;
