import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

/**
 * Configuration options for the Echo ECR Pull-Through Cache
 */
export interface EcrPullThroughCacheConfig {
    /**
     * The AWS account ID of the source ECR registry (Echo registry)
     */
    sourceRegistryAccountId: string;
    
    /**
     * The AWS region of the source ECR registry (Echo registry)
     * @default "us-east-1"
     */
    sourceRegistryRegion?: string;
    
    /**
     * Prefix for cached repository names - This will be the prefix in your registry
     * @default "echo"
     */
    repositoryPrefix?: string;
    
    /**
     * Name for the IAM role that will be created
     * @default "echo-pullthrough-cache-role"
     */
    roleName?: string;
    
    /**
     * Additional tags to apply to created resources
     */
    tags?: Record<string, string>;
}

/**
 * Outputs from the ECR Pull-Through Cache component
 */
export interface EcrPullThroughCacheOutputs {
    /**
     * The repository prefix used for cached images
     */
    cachePrefix: pulumi.Output<string>;
    
    /**
     * ARN of the IAM role created for pull-through cache
     */
    roleArn: pulumi.Output<string>;
    
    /**
     * The pull-through cache rule resource
     */
    cacheRule: aws.ecr.PullThroughCacheRule;
    
    /**
     * Human-readable usage instructions
     */
    usageInstructions: pulumi.Output<string>;
}

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
export class EcrPullThroughCache extends pulumi.ComponentResource {
    public readonly cachePrefix: pulumi.Output<string>;
    public readonly roleArn: pulumi.Output<string>;
    public readonly cacheRule: aws.ecr.PullThroughCacheRule;
    public readonly usageInstructions: pulumi.Output<string>;
    
    constructor(name: string, config: EcrPullThroughCacheConfig, opts?: pulumi.ComponentResourceOptions) {
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
    
    private generateUsageInstructions(accountId: string, region: string, prefix: string): string {
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
export function createEcrPullThroughCache(
    name: string, 
    config: EcrPullThroughCacheConfig, 
    opts?: pulumi.ComponentResourceOptions
): EcrPullThroughCacheOutputs {
    const cache = new EcrPullThroughCache(name, config, opts);
    
    return {
        cachePrefix: cache.cachePrefix,
        roleArn: cache.roleArn,
        cacheRule: cache.cacheRule,
        usageInstructions: cache.usageInstructions
    };
}

// Re-export AWS types that users might need
export { aws }; 