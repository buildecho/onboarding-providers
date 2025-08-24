# Basic JFrog Echo Integration Example

This example demonstrates a basic setup of the JFrog Echo integration module.

## Prerequisites

1. A JFrog Artifactory instance (Cloud or self-hosted)
2. An Artifactory access token with repository creation permissions
3. Echo Registry access credentials

## Usage

1. Copy the example variables file:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. Edit `terraform.tfvars` with your actual values:
   - `artifactory_url`: Your Artifactory instance URL
   - `artifactory_access_token`: Your Artifactory access token
   - `echo_access_key_name`: Your Echo access key name
   - `echo_access_key_value`: Your Echo access key value

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

After applying the configuration, test the integration:

```bash
# Configure Docker to use your Artifactory
docker login your-artifactory-url.com

# Pull an image through the remote repository
docker pull your-artifactory-url.com/echo-remote/alpine:latest
```

## Outputs

- `repository_key`: The key of the created remote repository
- `pull_url`: The full URL to use when pulling images

## Clean Up

To remove all resources created by this example:

```bash
terraform destroy
``` 