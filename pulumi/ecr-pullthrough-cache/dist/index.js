"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.aws = exports.EcrPullThroughCache = void 0;
exports.createEcrPullThroughCache = createEcrPullThroughCache;
const pulumi = __importStar(require("@pulumi/pulumi"));
const aws = __importStar(require("@pulumi/aws"));
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
 *     sourceRegistryAccountId: "123456789012",
 *     repositoryPrefix: "echo"
 * });
 *
 * export const cachePrefix = cache.cachePrefix;
 * export const instructions = cache.usageInstructions;
 * ```
 */
class EcrPullThroughCache extends pulumi.ComponentResource {
    constructor(name, config, opts) {
        super("echo:ecr:PullThroughCache", name, {}, opts);
        // Set defaults
        const sourceRegistryRegion = config.sourceRegistryRegion || "us-east-1";
        const repositoryPrefix = config.repositoryPrefix || "echo";
        const roleName = config.roleName || "echo-pullthrough-cache-role";
        // Merge tags
        const defaultTags = {
            ManagedBy: "pulumi",
            Purpose: "echo-ecr-pullthrough-cache",
            Vendor: "Echo",
            Component: name
        };
        const tags = { ...defaultTags, ...config.tags };
        // Get current AWS environment
        const current = aws.getCallerIdentity({});
        const currentRegion = aws.getRegion({});
        // Create IAM role for ECR pull-through cache
        const ecrPullThroughCacheRole = new aws.iam.Role(`${name}-role`, {
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
        const ecrPullPolicy = new aws.iam.RolePolicy(`${name}-policy`, {
            name: "EchoPullThroughCachePolicy",
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
        this.cacheRule = new aws.ecr.PullThroughCacheRule(`${name}-rule`, {
            ecrRepositoryPrefix: repositoryPrefix,
            upstreamRegistryUrl: `${config.sourceRegistryAccountId}.dkr.ecr.${sourceRegistryRegion}.amazonaws.com`,
            customRoleArn: ecrPullThroughCacheRole.arn
        }, { parent: this, dependsOn: [ecrPullPolicy] });
        // Set outputs
        this.cachePrefix = pulumi.output(repositoryPrefix);
        this.roleArn = ecrPullThroughCacheRole.arn;
        // Generate usage instructions
        this.usageInstructions = pulumi.all([current, currentRegion]).apply(([account, region]) => {
            return this.generateUsageInstructions(account.accountId, region.name, repositoryPrefix);
        });
        // Register outputs
        this.registerOutputs({
            cachePrefix: this.cachePrefix,
            roleArn: this.roleArn,
            usageInstructions: this.usageInstructions
        });
    }
    generateUsageInstructions(accountId, region, prefix) {
        return `
🎉 Echo Pull-Through Cache Setup Complete!

Your ECR is now configured to cache Echo images locally.

📦 How to Pull Echo Images:
─────────────────────────────
Instead of pulling directly from Echo's registry, use your local cache:

  docker pull ${accountId}.dkr.ecr.${region}.amazonaws.com/${prefix}/<image-name>:<tag>

Example:
  docker pull ${accountId}.dkr.ecr.${region}.amazonaws.com/${prefix}/static:latest

💡 Benefits:
- ⚡ Faster pulls (cached locally in your region)
- 🔒 Enhanced security with your own access controls
- 📊 Better visibility into image usage
- 🔄 Automatic updates every 24 hours

⚠️  Important: Grant your services / puller role these IAM permissions:
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:CreateRepository",
                "ecr:BatchImportUpstreamImage"
            ],
            "Resource": "arn:aws:ecr:*:*:repository/${prefix}/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage"
            ],
            "Resource": "*"
        }
    ]
}

Need help? Contact Echo support at support@echohq.com.
`;
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
 *     sourceRegistryAccountId: "123456789012"
 * });
 * ```
 */
function createEcrPullThroughCache(name, config, opts) {
    const cache = new EcrPullThroughCache(name, config, opts);
    return {
        cachePrefix: cache.cachePrefix,
        roleArn: cache.roleArn,
        cacheRule: cache.cacheRule,
        usageInstructions: cache.usageInstructions
    };
}
//# sourceMappingURL=index.js.map