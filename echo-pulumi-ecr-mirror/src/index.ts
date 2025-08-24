import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

/**
 * Configuration options for the Echo ECR Pull-Through Cache
 */
export interface EcrPullThroughCacheConfig {
    /**
     * Whether to create the resources
     * @default true
     */
    create?: boolean;
    
    /**
     * Prefix for all resource names created by this component
     * @default "echo-mirror"
     */
    resourcePrefix?: string;
    
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
     * Name for the pullthrough cache rule. If not provided, will use resourcePrefix with '-ecr-cache' suffix
     */
    cacheRuleName?: string;
    
    /**
     * Name for the IAM role that will be created. If not provided, will use cacheRuleName with '-role' suffix
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
     * The resource prefix used for naming resources
     */
    resourcePrefix: pulumi.Output<string>;
    
    /**
     * The cache rule name used
     */
    cacheRuleName: pulumi.Output<string>;
    
    /**
     * The repository prefix used for cached images
     */
    repositoryPrefix: pulumi.Output<string>;
    
    /**
     * ARN of the IAM role created for pull-through cache
     */
    roleArn: pulumi.Output<string | undefined>;
    
    /**
     * ARN of the IAM policy for pull-through cache
     */
    policyArn: pulumi.Output<string | undefined>;
    
    /**
     * ARN of the pull-through cache rule
     */
    cacheRuleArn: pulumi.Output<string | undefined>;
    
    /**
     * The pull-through cache rule resource
     */
    cacheRule: aws.ecr.PullThroughCacheRule | undefined;
    
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
    public readonly resourcePrefix: pulumi.Output<string>;
    public readonly cacheRuleName: pulumi.Output<string>;
    public readonly repositoryPrefix: pulumi.Output<string>;
    public readonly roleArn: pulumi.Output<string | undefined>;
    public readonly policyArn: pulumi.Output<string | undefined>;
    public readonly cacheRuleArn: pulumi.Output<string | undefined>;
    public readonly cacheRule: aws.ecr.PullThroughCacheRule | undefined;
    public readonly usageInstructions: pulumi.Output<string>;
    
    constructor(name: string, config: EcrPullThroughCacheConfig, opts?: pulumi.ComponentResourceOptions) {
        super("echo:ecr:PullThroughCache", name, {}, opts);
        
        // Set defaults
        const create = config.create !== false; // default to true
        const resourcePrefix = config.resourcePrefix || "echo-mirror";
        const sourceRegistryRegion = config.sourceRegistryRegion || "us-east-1";
        const repositoryPrefix = config.repositoryPrefix || "echo";
        const cacheRuleName = config.cacheRuleName || `${resourcePrefix}-ecr-cache`;
        const roleName = config.roleName || `${cacheRuleName}-role`;
        
        // Merge tags
        const defaultTags = {
            ManagedBy: "pulumi",
            Purpose: "echo-ecr-pullthrough-cache",
            Vendor: "Echo",
            Component: name,
            ResourcePrefix: resourcePrefix
        };
        const tags = { ...defaultTags, ...config.tags };
        
        // Get current AWS environment
        const current = aws.getCallerIdentity({});
        const currentRegion = aws.getRegion({});
        
        // Conditionally create resources
        let ecrPullThroughCacheRole: aws.iam.Role | undefined;
        let ecrPullPolicy: aws.iam.RolePolicy | undefined;
        let cacheRule: aws.ecr.PullThroughCacheRule | undefined;
        
        if (create) {
            // Create IAM role for ECR pull-through cache
            ecrPullThroughCacheRole = new aws.iam.Role(`${name}-role`, {
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
            ecrPullPolicy = new aws.iam.RolePolicy(`${name}-policy`, {
                name: `${cacheRuleName}-policy`,
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
            cacheRule = new aws.ecr.PullThroughCacheRule(`${name}-rule`, {
                ecrRepositoryPrefix: repositoryPrefix,
                upstreamRegistryUrl: `${config.sourceRegistryAccountId}.dkr.ecr.${sourceRegistryRegion}.amazonaws.com`,
                customRoleArn: ecrPullThroughCacheRole.arn
            }, { parent: this, dependsOn: [ecrPullPolicy] });
        }
        
        this.cacheRule = cacheRule;
        
        // Set outputs
        this.resourcePrefix = pulumi.output(resourcePrefix);
        this.cacheRuleName = pulumi.output(cacheRuleName);
        this.repositoryPrefix = pulumi.output(repositoryPrefix);
        this.roleArn = ecrPullThroughCacheRole ? ecrPullThroughCacheRole.arn : pulumi.output(undefined);
        this.policyArn = ecrPullPolicy ? ecrPullPolicy.arn : pulumi.output(undefined);
        
        // Generate cache rule ARN
        this.cacheRuleArn = create ? 
            pulumi.all([current, currentRegion]).apply(([account, region]) => {
                return `arn:aws:ecr:${region.name}:${account.accountId}:pull-through-cache-rule/${cacheRuleName}`;
            }) : pulumi.output(undefined);
        
        // Generate usage instructions
        this.usageInstructions = create ? 
            pulumi.all([current, currentRegion]).apply(([account, region]) => {
                return this.generateUsageInstructions(account.accountId, region.name, repositoryPrefix, cacheRuleName, resourcePrefix);
            }) : pulumi.output("Resources not created (create=false)");
        
        // Register outputs
        this.registerOutputs({
            resourcePrefix: this.resourcePrefix,
            cacheRuleName: this.cacheRuleName,
            repositoryPrefix: this.repositoryPrefix,
            roleArn: this.roleArn,
            policyArn: this.policyArn,
            cacheRuleArn: this.cacheRuleArn,
            usageInstructions: this.usageInstructions
        });
    }
    
    private generateUsageInstructions(accountId: string, region: string, repositoryPrefix: string, cacheRuleName: string, resourcePrefix: string): string {
        return `
# Echo ECR Pull-Through Cache Setup Complete!

## 🚀 Quick Start
Your ECR is now configured to cache Echo images locally using the **${resourcePrefix}** resource prefix.

\`\`\`bash
# Pull images through the cache
docker pull ${accountId}.dkr.ecr.${region}.amazonaws.com/${repositoryPrefix}/<IMAGE_NAME>:<TAG>
\`\`\`

## 📋 Examples
\`\`\`bash
# Pull a sample image
docker pull ${accountId}.dkr.ecr.${region}.amazonaws.com/${repositoryPrefix}/my-app:latest

# List cached repositories
aws ecr describe-repositories --repository-names ${repositoryPrefix}/my-app

# Get login token
aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${accountId}.dkr.ecr.${region}.amazonaws.com
\`\`\`

## 🔧 Configuration
- **Resource Prefix**: ${resourcePrefix}
- **Cache Rule Name**: ${cacheRuleName}
- **Repository Prefix**: ${repositoryPrefix}
- **Region**: ${region}
- **Account ID**: ${accountId}

## 💡 Benefits
- ⚡ Faster pulls (cached locally in your region)
- 🔒 Enhanced security with your own access controls
- 📊 Better visibility into image usage
- 🔄 Automatic updates from Echo Registry

## ⚠️ IAM Permissions
Grant your services/users these IAM permissions:
\`\`\`json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:CreateRepository",
                "ecr:BatchImportUpstreamImage"
            ],
            "Resource": "arn:aws:ecr:*:*:repository/${repositoryPrefix}/*"
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
\`\`\`

## 📝 Notes
- First pull will create the cached repository automatically
- Subsequent pulls will be served from the cache for faster access
- Cache rule automatically syncs with Echo Registry

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
        resourcePrefix: cache.resourcePrefix,
        cacheRuleName: cache.cacheRuleName,
        repositoryPrefix: cache.repositoryPrefix,
        roleArn: cache.roleArn,
        policyArn: cache.policyArn,
        cacheRuleArn: cache.cacheRuleArn,
        cacheRule: cache.cacheRule,
        usageInstructions: cache.usageInstructions
    };
}

// Re-export AWS types that users might need
export { aws }; 
