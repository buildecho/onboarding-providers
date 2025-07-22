# Basic GCP Artifact Registry Remote Repository Example

This example demonstrates a basic setup of the GCP Artifact Registry remote repository module for Echo Registry integration.

## Prerequisites

1. GCP project with Artifact Registry API enabled
2. GCP credentials configured (via `gcloud auth application-default login` or service account)
3. Appropriate permissions to create Artifact Registry repositories and Secret Manager secrets
4. Echo Registry access credentials

## Usage

1. Copy the example variables file:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. Edit `terraform.tfvars` with your actual values:
   - `project_id`: Your GCP project ID
   - `echo_access_key_name`: Your Echo access key name
   - `echo_access_key_value`: Your Echo access key value
   - Update IAM members as needed for your team

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

After applying the configuration, test the remote repository:

```bash
# Configure Docker to use GCP Artifact Registry
gcloud auth configure-docker us-central1-docker.pkg.dev

# Pull an image through the remote repository
# Format: LOCATION-docker.pkg.dev/PROJECT_ID/REPOSITORY_ID/IMAGE:TAG
docker pull us-central1-docker.pkg.dev/your-project-id/echo-remote/alpine:latest
```

The remote repository will proxy requests to Echo Registry using the configured credentials.

## Outputs

- `repository_id`: The ID of the created repository
- `repository_name`: The full name of the created repository
- `repository_url`: The URL to use for Docker operations

## Clean Up

To remove all resources created by this example:

```bash
terraform destroy
```

## Notes

- The Echo access key is stored securely in Google Secret Manager
- The Artifact Registry service account is automatically granted access to read the secret
- Remote repositories in GAR act as a proxy and don't store images locally
- Ensure your GCP project has billing enabled for Artifact Registry usage 