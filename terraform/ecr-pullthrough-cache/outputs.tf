# Data sources for dynamic values in outputs
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

output "repository_name_prefix" {
  description = "Repository prefix for cached images"
  value       = var.create ? var.repository_name_prefix : null
}

output "upstream_registry_url" {
  description = "Echo registry URL"
  value       = var.create ? "${var.source_registry_account_id}.dkr.ecr.${var.source_registry_region}.amazonaws.com" : null
}

output "access_role_arn" {
  description = "ARN of the ECR access role"
  value       = var.create ? aws_iam_role.ecr_access[0].arn : null
}

output "cache_rule_name" {
  description = "Name of the pullthrough cache rule"
  value       = var.create ? var.cache_rule_name : null
}

output "usage_instructions" {
  description = "Instructions for using the Echo registry pullthrough cache"
  value = var.create ? (
    <<-EOT
🎉 Echo Registry Pull-Through Cache Setup Complete!

Your ECR is now configured to cache Echo images locally for improved performance and reduced data transfer costs.

📦 How to Pull Echo Images:
─────────────────────────────
Use your local cache instead of pulling directly from Echo registry:

  docker pull ${data.aws_caller_identity.current.account_id}.dkr.ecr.${data.aws_region.current.name}.amazonaws.com/${var.repository_name_prefix}/<image-name>:<tag>

Example:
  docker pull ${data.aws_caller_identity.current.account_id}.dkr.ecr.${data.aws_region.current.name}.amazonaws.com/${var.repository_name_prefix}/nginx:latest

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
            "Resource": "arn:aws:ecr:*:*:repository/${var.repository_name_prefix}/*"
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
EOT
  ) : null
}
