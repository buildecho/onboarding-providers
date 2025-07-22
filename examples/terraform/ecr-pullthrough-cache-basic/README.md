# ECR Pullthrough Cache - Basic Example

This example demonstrates setting up ECR pullthrough cache for Echo registry using Terraform.

## Quick Start

1. **Copy the example variables file**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Edit `terraform.tfvars`** with Echo's details:
   ```hcl
   source_registry_account_id = "123456789012"  # Replace with Echo's account ID
   source_registry_region     = "us-east-1"     # Echo's region
   ```

3. **Deploy**
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

4. **Test the integration**
   ```bash
   terraform output usage_instructions
   ```

## Files

- `main.tf` - Terraform configuration
- `variables.tf` - Input variable definitions
- `terraform.tfvars.example` - Example values

## Need Help?

- Ensure you have Echo's account ID and region
- Check AWS credentials: `aws sts get-caller-identity`
- See the [module documentation](../../../terraform/ecr-pullthrough-cache/README.md) 