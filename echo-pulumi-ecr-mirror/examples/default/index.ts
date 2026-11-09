// Default: pull-through cache rule only. ECR creates cache repositories with its
// defaults (AES256, MUTABLE tags, no policies).
//
//   pulumi stack init test
//   pulumi config set aws:region us-east-1
//   pulumi config set echoRegistryAccountId <echo registry account id>
//   pulumi up
import * as pulumi from "@pulumi/pulumi";
// In your own program: import { EcrPullThroughCache } from "@buildecho/echo-pulumi-ecr-mirror";
import { EcrPullThroughCache } from "../../index";

const config = new pulumi.Config();
const cacheNamespace = config.require("cacheNamespace");

const cache = new EcrPullThroughCache("echo-cache", {
    echoRegistryAccountId: config.require("echoRegistryAccountId"),
    cacheNamespace,
    roleName: `${cacheNamespace}-ptc-role`,
    policyName: `${cacheNamespace}-ptc-policy`,
});

export const usage = cache.usageInstructions;
