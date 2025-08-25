"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aws = exports.EcrPullThroughCache = void 0;
exports.createEcrPullThroughCache = createEcrPullThroughCache;
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
exports.aws = aws;
/**
 * Echo ECR Pull-Through Cache Component
 *
 * This component sets up an ECR pull-through cache to integrate with Echo's registry,
 * allowing you to cache Echo images locally in your AWS account.
 *
 * @example
 * ```typescript
 * import { EcrPullThroughCache } from "@echo/pulumi-ecr-cache";
 *
 * const cache = new EcrPullThroughCache("echo-cache", {
 *     create: true,
 *     sourceRegistryAccountId: "123456789012",
 *     repositoryPrefix: "echo"
 * });
 *
 * export const cachePrefix = cache.cachePrefix;
 * export const usage = cache.usageInstruction;
 * ```
 */
class EcrPullThroughCache extends pulumi.ComponentResource {
    constructor(name, args, opts) {
        super("echo-pulumi-ecr-mirror:index:EcrPullThroughCache", name, args, opts);
        // Set defaults
        const echoRegistryRegion = args.echoRegistryRegion || "us-east-1";
        const cacheNamespace = args.cacheNamespace || "echo";
        const roleName = args.roleName || "echo-ecr-mirror-role";
        const policyName = args.policyName || "echo-ecr-mirror-policy";
        const tags = Object.assign({}, args.tags);
        // Get current AWS environment
        const current = aws.getCallerIdentity({});
        const currentRegion = aws.getRegion({});
        // Create IAM role for ECR pull-through cache
        const ecrPullThroughCacheRole = new aws.iam.Role(`${name}-${roleName}`, {
            name: roleName,
            description: "Allows ECR to pull images from Echo's registry",
            assumeRolePolicy: JSON.stringify({
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Principal: {
                            Service: "pullthroughcache.ecr.amazonaws.com"
                        },
                        Action: "sts:AssumeRole"
                    }
                ]
            }),
            tags: tags
        }, { parent: this });
        // Attach policy to allow pulling from Echo's registry
        const ecrPullPolicy = new aws.iam.RolePolicy(`${name}-${policyName}`, {
            name: policyName,
            role: ecrPullThroughCacheRole.id,
            policy: JSON.stringify({
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Action: [
                            "ecr:GetAuthorizationToken",
                            "ecr:BatchCheckLayerAvailability",
                            "ecr:GetDownloadUrlForLayer",
                            "ecr:BatchGetImage",
                            "ecr:BatchImportUpstreamImage",
                            "ecr:GetImageCopyStatus",
                            "ecr:InitiateLayerUpload",
                            "ecr:UploadLayerPart",
                            "ecr:CompleteLayerUpload",
                            "ecr:PutImage"
                        ],
                        Resource: "*"
                    }
                ]
            })
        }, { parent: this });
        // Create the pull-through cache rule
        const cacheRule = new aws.ecr.PullThroughCacheRule(`${name}-rule`, {
            ecrRepositoryPrefix: cacheNamespace,
            upstreamRegistryUrl: `${args.echoRegistryAccountId}.dkr.ecr.${echoRegistryRegion}.amazonaws.com`,
            customRoleArn: ecrPullThroughCacheRole.arn
        }, { parent: this, dependsOn: [ecrPullThroughCacheRole, ecrPullPolicy] });
        // Set outputs
        this.cacheNamespace = pulumi.output(cacheNamespace);
        this.roleArn = ecrPullThroughCacheRole.arn;
        this.policyArn = ecrPullPolicy.id;
        this.usageInstruction = pulumi.all([current, currentRegion, pulumi.output(cacheNamespace)]).apply(([account, region, ns]) => `docker pull ${account.accountId}.dkr.ecr.${region.name}.amazonaws.com/${ns}/<image>:<tag>`);
        // Register outputs
        this.registerOutputs({
            cacheNamespace: this.cacheNamespace,
            roleArn: this.roleArn,
            usageInstruction: this.usageInstruction
        });
    }
}
exports.EcrPullThroughCache = EcrPullThroughCache;
/**
 * Helper function to create ECR pull-through cache with minimal configuration
 *
 * @example
 * ```typescript
 * import { createEcrPullThroughCache } from "@echo/pulumi-ecr-cache";
 *
 * const cache = createEcrPullThroughCache("echo-cache", {
 *     echoRegistryAccountId: "123456789012"
 * });
 * ```
 */
function createEcrPullThroughCache(name, config, opts) {
    const cache = new EcrPullThroughCache(name, config, opts);
    return {
        roleArn: cache.roleArn,
        policyArn: cache.policyArn,
        usageInstruction: cache.usageInstruction
    };
}
//# sourceMappingURL=index.js.map