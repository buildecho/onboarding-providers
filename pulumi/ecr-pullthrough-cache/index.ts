import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Configuration with sensible defaults for Echo customers
const config = new pulumi.Config();

// Echo's registry configuration (customers shouldn't need to change these)
const ECHO_REGISTRY_ACCOUNT = config.get("sourceRegistryAccountId");
const ECHO_REGISTRY_REGION = "us-east-1";      // Echo's registry region

// Customer configuration
const repositoryPrefix = config.get("repositoryPrefix") || "echo";

// Get current AWS environment
const current = aws.getCallerIdentity({});
const currentRegion = aws.getRegion({});

// Create IAM role for ECR pull-through cache
// This role allows ECR service to pull images from Echo's registry on your behalf
const ecrPullThroughCacheRole = new aws.iam.Role("echoPullThroughCacheRole", {
    name: `echo-pullthrough-cache-role`,
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
    tags: {
        ManagedBy: "pulumi",
        Purpose: "echo-ecr-pullthrough-cache",
        Vendor: "Echo"
    }
});

// Attach policy to allow pulling from Echo's registry
const ecrPullPolicy = new aws.iam.RolePolicy("echoPullPolicy", {
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
});

// Create the pull-through cache rule
const echoCacheRule = new aws.ecr.PullThroughCacheRule("echoCacheRule", {
    ecrRepositoryPrefix: repositoryPrefix,
    upstreamRegistryUrl: `${ECHO_REGISTRY_ACCOUNT}.dkr.ecr.${ECHO_REGISTRY_REGION}.amazonaws.com`,
    customRoleArn: ecrPullThroughCacheRole.arn
});

// Export useful information
export const cachePrefix = repositoryPrefix;
export const roleArn = ecrPullThroughCacheRole.arn;

// Export customer-friendly usage instructions
export const usageInstructions = pulumi.all([current, currentRegion]).apply(([account, region]) => {
    return `
🎉 Echo Pull-Through Cache Setup Complete!

Your ECR is now configured to cache Echo images locally.

📦 How to Pull Echo Images:
─────────────────────────────
Instead of pulling directly from Echo's registry, use your local cache:

  docker pull ${account.accountId}.dkr.ecr.${region.name}.amazonaws.com/${repositoryPrefix}/<image-name>:<tag>

Example:
  docker pull ${account.accountId}.dkr.ecr.${region.name}.amazonaws.com/${repositoryPrefix}/static:latest

💡 Benefits:
- ⚡ Faster pulls (cached locally in your region)
- 🔒 Enhanced security with your own access controls
- 📊 Better visibility into image usage
- 🔄 Automatic updates every 24 hours

⚠️  Important: Grant your services / puller rolethese IAM permissions:
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

Need help? Contact Echo support at support@echohq.com.
`;
}); 