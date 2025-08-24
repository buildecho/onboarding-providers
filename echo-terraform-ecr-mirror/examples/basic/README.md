# Basic ECR Pull-Through Cache Example

Purpose: Minimal example of using the ECR pull-through cache module.

## Usage
```bash
cp terraform.tfvars.example terraform.tfvars
terraform init && terraform apply -auto-approve
```

## Test
```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region)
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
docker pull "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/echo/<image>:<tag>"
```

## Outputs
- `mirror_url`
- `access_role_arn`
- `usage_instruction`

## Clean up
```bash
terraform destroy -auto-approve
```
