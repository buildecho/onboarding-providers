# AWS ECR Integration Guide

This guide explains how ECR pullthrough cache rules work and provides integration details for connecting your AWS ECR with Echo registry service.

## How ECR Pullthrough Cache Works

```
Your ECR Registry  <---> Echo ECR Registry
     (Cache)              (Source)
```

When you pull an image:
1. Docker client requests image from your ECR
2. If not cached, ECR pulls from Echo registry
3. Image is cached in your ECR for future use
4. Subsequent pulls use the cached image

## Benefits

- **Performance**: Faster image pulls from local cache
- **Cost Savings**: Reduced data transfer charges
- **Reliability**: Images remain available even if source is temporarily unavailable
- **Security**: Images pass through your security scanning policies

## Integration Requirements

### From Echo Team
- **Echo's AWS Account ID**: 12-digit AWS account number
- **Echo's AWS Region**: Typically us-east-1
- **Available Repositories**: List of container images you can access

### From Your Side
- AWS account with ECR service
- IAM permissions to create pullthrough cache rules
- Docker CLI for testing

## Integration Options

Choose your preferred infrastructure-as-code tool:

### CloudFormation
AWS-native solution using YAML/JSON templates.

[Deploy with CloudFormation →](../../cloudformation/ecr-pullthrough-cache/)

### Terraform
Multi-cloud compatible using HCL syntax.

[Deploy with Terraform →](../../terraform/ecr-pullthrough-cache/)

### Pulumi
Modern infrastructure using TypeScript.

[Deploy with Pulumi →](../../pulumi/ecr-pullthrough-cache/)

## Understanding the Resources Created

Each integration creates:

1. **Pullthrough Cache Rule**
   - Links your ECR to Echo's ECR
   - Defines the repository prefix (default: "echo")
   - Enables automatic image caching

2. **IAM Role**
   - Grants cross-account access
   - Allows your ECR to pull from Echo's ECR
   - Scoped to minimum required permissions

## Using the Cache

After deployment, pull images using this pattern:

```bash
docker pull YOUR_ACCOUNT.dkr.ecr.YOUR_REGION.amazonaws.com/PREFIX/REPOSITORY:TAG
```

Where:
- `YOUR_ACCOUNT`: Your AWS account ID
- `YOUR_REGION`: Your AWS region
- `PREFIX`: Repository prefix (default: "echo")
- `REPOSITORY`: Image name from Echo registry
- `TAG`: Image version tag

### Example

If Echo provides `nginx:1.21` in their registry:

```bash
# First login to your ECR
aws ecr get-login-password | docker login --username AWS --password-stdin \
  123456789012.dkr.ecr.us-east-1.amazonaws.com

# Pull through the cache
docker pull 123456789012.dkr.ecr.us-east-1.amazonaws.com/echo/nginx:1.21
```

## Cache Behavior

### First Pull
- ECR checks if image exists locally
- If not found, pulls from Echo registry
- Stores in your ECR
- Returns image to Docker client

### Subsequent Pulls
- ECR returns cached image immediately
- No cross-account data transfer
- Faster pull times

### Cache Updates
- ECR checks for updates based on image manifest
- Automatically pulls new versions when requested
- Old versions remain cached until removed

## Best Practices

### Security
- Review IAM role permissions regularly
- Enable ECR image scanning
- Use lifecycle policies to remove unused images
- Monitor CloudTrail for access logs

### Cost Optimization
- Set lifecycle policies to delete old images
- Monitor storage usage
- Track data transfer costs
- Use VPC endpoints for ECR

### Operations
- Set up CloudWatch alarms for failed pulls
- Monitor cache hit rates
- Document available images for your team
- Test disaster recovery procedures

## Troubleshooting

### Cannot Pull Images
1. Verify the image exists in Echo registry
2. Check IAM role has correct permissions
3. Ensure pullthrough cache rule is active
4. Confirm repository prefix is correct

### Slow Performance
1. Check if this is the first pull (needs to cache)
2. Verify network connectivity
3. Consider using VPC endpoints
4. Check ECR service limits

### Access Denied Errors
1. Verify Echo's account ID is correct
2. Check cross-account IAM trust policy
3. Ensure your user has ECR permissions
4. Review CloudTrail logs

## Monitoring

### CloudWatch Metrics
- `RepositoryPullCount`: Track cache usage
- `RepositorySize`: Monitor storage consumption

### Cost Tracking
- Use AWS Cost Explorer with ECR tags
- Monitor data transfer costs
- Track storage costs by repository

## Advanced Configuration

### Multiple Environments
Create separate cache rules with different prefixes:
- `echo-dev` for development
- `echo-staging` for staging  
- `echo-prod` for production

### Lifecycle Policies
Example policy to keep only recent images:
```json
{
  "rules": [{
    "rulePriority": 1,
    "description": "Keep only 10 recent images",
    "selection": {
      "tagStatus": "any",
      "countType": "imageCountMoreThan",
      "countNumber": 10
    },
    "action": {
      "type": "expire"
    }
  }]
}
```

### VPC Endpoints
Reduce data transfer costs and improve security:
```bash
aws ec2 create-vpc-endpoint \
  --vpc-id vpc-12345678 \
  --service-name com.amazonaws.region.ecr.dkr
```

## Support

For issues specific to:
- **CloudFormation deployment**: See [CloudFormation README](../../cloudformation/ecr-pullthrough-cache/README.md)
- **Terraform deployment**: See [Terraform README](../../terraform/ecr-pullthrough-cache/README.md)
- **Pulumi deployment**: See [Pulumi README](../../pulumi/ecr-pullthrough-cache/README.md)
- **General ECR questions**: Contact Echo integration team

 