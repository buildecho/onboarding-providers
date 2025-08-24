# Basic Nexus Integration Example

This example demonstrates how to create a Sonatype Nexus Docker proxy repository for Echo registry.

## Prerequisites

1. A running Sonatype Nexus instance
2. Admin credentials for Nexus
3. Echo access key (name and value) from Echo platform

## Usage

1. Copy the example variables file:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. Edit `terraform.tfvars` with your actual values:
   - Update Nexus URL and credentials
   - Add your Echo access key name and value

3. Initialize and apply:
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

## Outputs

After successful deployment, you'll see:
- `repository_name`: The name of the created repository
- `docker_pull_command`: Example command to pull images
- `configuration_summary`: Summary of the repository configuration

## Testing the Integration

1. Configure Docker to use your Nexus instance:
   ```bash
   docker login nexus.example.com:8082
   ```

2. Pull an image through the proxy:
   ```bash
   docker pull nexus.example.com:8082/echo-docker-proxy/your-image:tag
   ```

## Clean Up

To remove all resources:
```bash
terraform destroy
``` 