# Basic ECR Pull-Through Cache Example

This example demonstrates a basic setup of the ECR pull-through cache module for Echo Registry integration.

## Prerequisites

1. AWS account with appropriate permissions to create ECR resources and IAM roles
2. AWS CLI configured with credentials
3. The AWS account ID and region of the Echo Registry source

## Usage

1. Copy the example variables file:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. Edit `terraform.tfvars` with your actual values:
   - `source_registry_account_id`: The AWS account ID of the Echo Registry
   - Adjust other values as needed for your environment

3. Initialize Terraform:
   ```bash
   terraform init
   ```

4. Plan the deployment:
   ```bash
   terraform plan
   ```

5. Apply the configuration:
   ```bash
   terraform apply
   ```

## Testing the Integration

After applying the configuration, test the pull-through cache:

```bash
# Authenticate with ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Pull an image through the cache
# Format: YOUR_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/REPOSITORY_PREFIX/IMAGE:TAG
docker pull YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/echo/alpine:latest
```

The first pull will fetch the image from the Echo Registry and cache it. Subsequent pulls will use the cached version.

## Outputs

- `cache_rule_registry_id`: The registry ID of the pull-through cache rule
- `cache_rule_upstream_registry_url`: The upstream registry URL
- `iam_role_arn`: ARN of the IAM role used for ECR access

## Clean Up

To remove all resources created by this example:

```bash
terraform destroy
```

## Notes

- The pull-through cache rule will automatically create repositories as needed when images are pulled
- Cached images follow ECR lifecycle policies if configured
- Ensure your AWS account has sufficient ECR storage quota 