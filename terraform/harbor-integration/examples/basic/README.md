# Basic Harbor Echo Integration Example

This example demonstrates a basic setup of the Harbor Echo integration module.

## Prerequisites

1. A running Harbor instance (v2.0 or later)
2. Admin credentials for Harbor
3. Echo Registry access credentials

## Usage

1. Copy the example variables file:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. Edit `terraform.tfvars` with your actual values:
   - `harbor_url`: Your Harbor instance URL
   - `harbor_username`: Your Harbor username (default: admin)
   - `harbor_password`: Your Harbor password
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

After applying the configuration, test the proxy cache:

```bash
# Configure Docker to use your Harbor instance
docker login your-harbor-instance.com

# Pull an image through Harbor proxy cache
# The image will be pulled from Echo Registry and cached in Harbor
docker pull your-harbor-instance.com/echo/alpine:latest
```

The first pull will fetch the image from Echo Registry and cache it in Harbor. Subsequent pulls will use the cached version.

## What Gets Created

This module creates:
1. **Echo Registry Configuration**: Configures Echo Registry as an external registry in Harbor
2. **Echo Project**: Creates a proxy cache project named "echo" that links to the Echo registry

## Outputs

- `echo_registry_created`: Boolean indicating if the Echo registry was created
- `echo_project_created`: Boolean indicating if the Echo proxy cache project was created

## Clean Up

To remove all resources created by this example:

```bash
terraform destroy
```

## Notes

- The proxy cache project will automatically pull and cache images when requested
- Cached images follow Harbor's retention policies
- Ensure your Harbor instance has sufficient storage for cached images
- The Echo registry credentials are stored securely in Harbor 