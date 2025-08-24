# Google Artifact Registry - Echo Remote Repository Integration

This Terraform module creates a Google Artifact Registry (GAR) remote repository that integrates with Echo Registry (reg.echohq.com).

## Overview

This module sets up:
- A Google Secret Manager secret to store the Echo access key
- A GAR remote repository configured to proxy requests to Echo Registry
- Custom authentication using the Echo access key
- Proper IAM permissions for the GAR service account to access the secret
- Optional IAM bindings for reader/writer access to the repository

## Prerequisites

- Google Cloud Project with the following APIs enabled:
  - Artifact Registry API
  - Secret Manager API
- Echo Registry access key (name and value)
- Terraform >= 1.0
- Google Cloud Provider >= 4.0

## Usage

```hcl
module "echo_gar_remote" {
  source = "./terraform/gcp-gar-remote"

  project_id           = "my-gcp-project"
  location            = "us-central1"
  repository_name       = "echo-remote"
  echo_access_key_name = "my-echo-key-name"
  echo_access_key_value = "my-echo-key-value"

  # Optional
  description = "Echo Registry remote repository"
  echo_registry_url = "https://reg.echohq.com"  # This is the default
  echo_access_key_secret_name = "custom-secret-id"  # Defaults to "{repository_name}-echo-access-key"
  
  reader_members = [
    "user:developer@example.com",
    "serviceAccount:ci-sa@my-project.iam.gserviceaccount.com"
  ]
  
  writer_members = [
    "serviceAccount:build-sa@my-project.iam.gserviceaccount.com"
  ]
  
  labels = {
    environment = "production"
    team        = "platform"
  }
}
```

### Conditional Creation

```hcl
module "echo_gar_remote" {
  source = "./terraform/gcp-gar-remote"

  create = var.enable_echo_integration  # Conditionally create resources
  
  project_id           = "my-gcp-project"
  location            = "us-central1"
  repository_name       = "echo-remote"
  echo_access_key_name = "my-echo-key-name"
  echo_access_key_value = "my-echo-key-value"
}
```

## Authentication Flow

1. The module creates a Secret Manager secret containing your Echo access key value
2. The GAR remote repository is configured to use custom authentication
3. When pulling images, GAR uses the Echo access key name as the username
4. GAR retrieves the access key value from Secret Manager as the password
5. These credentials are used to authenticate with Echo Registry at reg.echohq.com

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| create | Whether to provision the resources under this module | `bool` | `true` | no |
| project_id | The GCP project ID where the repository will be created | `string` | n/a | yes |
| location | The location for the Artifact Registry repository | `string` | `"us-central1"` | no |
| repository_name | The name of the repository | `string` | `"echo-mirror"` | no |
| echo_access_key_name | The name of the Echo access key (used as username) | `string` | n/a | yes |
| echo_access_key_value | The value of the Echo access key (used as password) | `string` | n/a | yes |
| description | Description for the Artifact Registry repository | `string` | `""` | no |
| echo_registry_url | URL of the Echo registry | `string` | `"https://reg.echohq.com"` | no |
| echo_access_key_secret_name | Custom secret name for the Echo access key | `string` | `""` | no |
| reader_members | List of members to grant read access | `list(string)` | `[]` | no |
| writer_members | List of members to grant write access | `list(string)` | `[]` | no |
| labels | A map of labels to assign to resources | `map(string)` | `{}` | no |

## Outputs

| Name | Description |
|------|-------------|
| repository_id | The ID of the created Artifact Registry repository |
| repository_name | The full name of the created Artifact Registry repository |
| repository_url | The URL of the created Artifact Registry repository |
| secret_id | The ID of the created secret containing the Echo access key |
| secret_version | The full resource name of the secret version |

## Using the Repository

After creating the repository, you can configure Docker to use it:

```bash
# Configure Docker authentication for GAR
gcloud auth configure-docker ${location}-docker.pkg.dev

# Pull an image through the Echo remote repository
docker pull ${location}-docker.pkg.dev/${project_id}/${repository_name}/your-image:tag
```

The remote repository will proxy the request to Echo Registry and cache the images locally in GAR.

## Security Considerations

- The Echo access key is stored securely in Google Secret Manager
- The GAR service account is automatically granted access to read the secret
- Access to the repository is controlled through IAM bindings
- The access key value is marked as sensitive in Terraform

## Cleanup

To destroy the resources created by this module:

```bash
terraform destroy
```

Note: This will delete the GAR repository and the secret containing the Echo access key. 
