import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

/**
 * Configuration options for the Echo ECR Pull-Through Cache
 */
export interface EcrPullThroughCacheConfig {
    /**
     * Whether to create resources under this component
     * @default true
     */
    create?: boolean;

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
     * Repository prefix for cached images - This will be the prefix in your registry
     * @default "echo-mirror"
     */
    repositoryNamePrefix?: string;
    
    /**
     * Name for the pullthrough cache rule and associated resources
     * @default "echo-mirror-cache-rule"
     */
    cacheRuleName?: string;
    
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
    repositoryNamePrefix: pulumi.Output<string | undefined>;
    
    /**
     * ARN of the IAM role created for pull-through cache
     */
    accessRoleArn: pulumi.Output<string | undefined>;
    
    /**
     * The pull-through cache rule resource
     */
    cacheRule: aws.ecr.PullThroughCacheRule | undefined;
    
    /**
     * Name of the cache rule
     */
    cacheRuleName: pulumi.Output<string | undefined>;

    /**
     * Echo registry URL
     */
    upstreamRegistryUrl: pulumi.Output<string | undefined>;
    
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
 *     repositoryNamePrefix: "echo-mirror"
 * });
 * 
 * export const repositoryPrefix = cache.repositoryNamePrefix;
 * export const instructions = cache.usageInstructions;
 * ```
 */
export class EcrPullThroughCache extends pulumi.ComponentResource {
    public readonly repositoryNamePrefix: pulumi.Output<string | undefined>;
    public readonly accessRoleArn: pulumi.Output<string | undefined>;
    public readonly cacheRule: aws.ecr.PullThroughCacheRule | undefined;
    public readonly cacheRuleName: pulumi.Output<string | undefined>;
    public readonly upstreamRegistryUrl: pulumi.Output<string | undefined>;
    public readonly usageInstructions: pulumi.Output<string>;
    
    constructor(name: string, config: EcrPullThroughCacheConfig, opts?: pulumi.ComponentResourceOptions) {
        super("echo:ecr:PullThroughCache", name, {}, opts);
        
        // Set defaults
        const create = config.create ?? true;
        const sourceRegistryRegion = config.sourceRegistryRegion || "us-east-1";
        const repositoryNamePrefix = config.repositoryNamePrefix || "echo-mirror";
        const cacheRuleName = config.cacheRuleName || "echo-mirror-cache-rule";
        
        // Merge tags
        const defaultTags = {
            ManagedBy: "pulumi",
            Purpose: "echo-registry-integration",
            Component: "pullthrough-cache"
        };
        const tags = { ...defaultTags, ...config.tags };
        
        // Get current AWS environment
        const current = aws.getCallerIdentity({});
        const currentRegion = aws.getRegion({});
        
        let ecrPullThroughCacheRole: aws.iam.Role | undefined;
        let ecrPullPolicy: aws.iam.RolePolicy | undefined;
        
        if (create) {
            // Create IAM role for ECR pull-through cache
            ecrPullThroughCacheRole = new aws.iam.Role(`${name}-role`, {
                name: `${cacheRuleName}-access-role`,
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
            ecrPullPolicy = new aws.iam.RolePolicy(`${name}-policy`, {
                name: "ECRPullthroughCachePolicy",
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
                ecrRepositoryPrefix: repositoryNamePrefix,
                upstreamRegistryUrl: `${config.sourceRegistryAccountId}.dkr.ecr.${sourceRegistryRegion}.amazonaws.com`,
                customRoleArn: ecrPullThroughCacheRole.arn
            }, { parent: this, dependsOn: [ecrPullPolicy] });
        }
        
        // Set outputs
        this.repositoryNamePrefix = create ? pulumi.output(repositoryNamePrefix) : pulumi.output(undefined);
        this.accessRoleArn = create && ecrPullThroughCacheRole ? ecrPullThroughCacheRole.arn : pulumi.output(undefined);
        this.cacheRuleName = create ? pulumi.output(cacheRuleName) : pulumi.output(undefined);
        this.upstreamRegistryUrl = create ? pulumi.output(`${config.sourceRegistryAccountId}.dkr.ecr.${sourceRegistryRegion}.amazonaws.com`) : pulumi.output(undefined);
        
        // Generate usage instructions
        this.usageInstructions = create ? 
            pulumi.all([current, currentRegion]).apply(([account, region]) => {
                return this.generateUsageInstructions(account.accountId, region.name, repositoryNamePrefix);
            }) : 
            pulumi.output("");
        
        // Register outputs
        this.registerOutputs({
            repositoryNamePrefix: this.repositoryNamePrefix,
            accessRoleArn: this.accessRoleArn,
            cacheRuleName: this.cacheRuleName,
            upstreamRegistryUrl: this.upstreamRegistryUrl,
            usageInstructions: this.usageInstructions
        });
    }
    
    private generateUsageInstructions(accountId: string, region: string, prefix: string): string {
        return `
🎉 Echo Registry Pull-Through Cache Setup Complete!

Your ECR is now configured to cache Echo images locally for improved performance and reduced data transfer costs.

📦 How to Pull Echo Images:
─────────────────────────────
Use your local cache instead of pulling directly from Echo registry:

  docker pull ${accountId}.dkr.ecr.${region}.amazonaws.com/${prefix}/<image-name>:<tag>

Example:
  docker pull ${accountId}.dkr.ecr.${region}.amazonaws.com/${prefix}/nginx:latest

💡 Benefits:
- ⚡ Faster image pulls (cached locally in your AWS region)
- 🔒 Enhanced security with your own AWS IAM access controls
- 📊 Better visibility into image usage through AWS CloudTrail
- 🔄 Automatic cache updates every 24 hours
- 💰 Reduced data transfer costs

⚠️  Important: Grant your services/applications these IAM permissions:
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

📚 Additional Notes:
- The first pull will fetch from Echo and cache in your ECR
- Subsequent pulls use the cached version for faster performance
- Configure ECR lifecycle policies to manage storage costs
- Enable ECR image scanning for additional security

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
        repositoryNamePrefix: cache.repositoryNamePrefix,
        accessRoleArn: cache.accessRoleArn,
        cacheRule: cache.cacheRule,
        cacheRuleName: cache.cacheRuleName,
        upstreamRegistryUrl: cache.upstreamRegistryUrl,
        usageInstructions: cache.usageInstructions
    };
}

// Re-export AWS types that users might need
export { aws }; 