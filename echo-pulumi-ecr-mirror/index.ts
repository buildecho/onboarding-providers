import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

/**
 * Configuration options for the Echo ECR Pull-Through Cache
 */
export interface EcrPullThroughCacheInput {
    /**
     * The AWS account ID of the source ECR registry (Echo registry)
     */
    echoRegistryAccountId: pulumi.Input<string>;
    
    /**
     * The AWS region of the source ECR registry (Echo registry)
     * @default "us-east-1"
     */
    echoRegistryRegion?: pulumi.Input<string>;
    
    /**
     * Namespace/prefix for cached repositories in your ECR
     * @default "echo"
     */
    cacheNamespace?: pulumi.Input<string>;
    
    /**
     * Name for the IAM role that will be created.
     * @default "echo-ecr-mirror-role"
     */
    roleName?:pulumi.Input<string>;

    /**
     * Name for the IAM policy that will be created.
     * @default "echo-ecr-mirror-policy"
     */
    policyName?:pulumi.Input<string>;
    
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
     * ARN of the IAM role created for pull-through cache
     */
    roleArn: pulumi.Output<string>;

    /**
     * Single-line usage instruction
     */
    usageInstruction: pulumi.Output<string>;
}

/**
 * Echo ECR Pull-Through Cache Component
 * 
 * This component sets up an ECR pull-through cache to integrate with Echo's registry,
 * allowing you to cache Echo images locally in your AWS account.
 * 
 * @example
 * ```typescript
 * import { EcrPullThroughCache } from "@buildecho/echo-pulumi-ecr-mirror";
 * 
 * const cache = new EcrPullThroughCache("echo-cache", {
 *     echoRegistryAccountId: "123456789012",
 *     echoRegistryRegion: "us-east-1",
 *     cacheNamespace: "echo"
 * });
 * 
 * export const usage = cache.usageInstruction;
 * ```
 */
export class EcrPullThroughCache extends pulumi.ComponentResource {
    public readonly cacheNamespace: pulumi.Output<string>;
    public readonly roleArn: pulumi.Output<string>;
    public readonly usageInstruction: pulumi.Output<string>;
    
    constructor(name: string, args: EcrPullThroughCacheInput,opts?: pulumi.ComponentResourceOptions) {
        super("echo-pulumi-ecr-mirror:index:EcrPullThroughCache", name, args, opts);
        
        // Set defaults
        const echoRegistryRegion = args.echoRegistryRegion || "us-east-1";
        const cacheNamespace = args.cacheNamespace || "echo";
        const roleName = args.roleName || "echo-ecr-mirror-role"
        const policyName = args.policyName || "echo-ecr-mirror-policy"
        
        const tags = { ...args.tags };
        
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
        this.usageInstruction = pulumi.all([current, currentRegion, pulumi.output(cacheNamespace)]).apply(([account, region, ns]) => `docker pull ${account.accountId}.dkr.ecr.${region.name}.amazonaws.com/${ns}/<image>:<tag>`);
        
        // Register outputs
        this.registerOutputs({
            cacheNamespace: this.cacheNamespace,
            roleArn: this.roleArn,
            usageInstruction: this.usageInstruction
        });
    }
    
}
