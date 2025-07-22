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
export declare class EcrPullThroughCache extends pulumi.ComponentResource {
    readonly cachePrefix: pulumi.Output<string>;
    readonly roleArn: pulumi.Output<string>;
    readonly cacheRule: aws.ecr.PullThroughCacheRule;
    readonly usageInstructions: pulumi.Output<string>;
    constructor(name: string, config: EcrPullThroughCacheConfig, opts?: pulumi.ComponentResourceOptions);
    private generateUsageInstructions;
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
export declare function createEcrPullThroughCache(name: string, config: EcrPullThroughCacheConfig, opts?: pulumi.ComponentResourceOptions): EcrPullThroughCacheOutputs;
export { aws };
//# sourceMappingURL=index.d.ts.map