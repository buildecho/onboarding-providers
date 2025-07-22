# GCP Artifact Registry Remote Repository for Echo

This Pulumi component sets up a Google Cloud Artifact Registry remote repository that points to Echo's registry, allowing you to pull Echo images through GCP's Artifact Registry.

## Features

- 🔒 **Secure Authentication**: Stores Echo credentials in Google Secret Manager
- 🚀 **Native GCP Integration**: Leverage GCP's global infrastructure
- 👥 **IAM Support**: Configure reader/writer access using GCP IAM
- 🏷️ **Resource Tagging**: Apply custom labels to all created resources
- 📦 **Component-based**: Reusable Pulumi component for easy integration

## Prerequisites

- Pulumi CLI installed
- Google Cloud SDK (`gcloud`) installed and configured
- A GCP project with the following APIs enabled:
  - Artifact Registry API
  - Secret Manager API
- Echo registry access credentials

## Installation

### As a Package

```bash
npm install @buildecho/pulumi-onboarding-providers-gcp-gar-remote
```

### From Source

```bash
git clone https://github.com/buildecho/onboarding-providers.git
cd onboarding-providers/pulumi/gcp-gar-remote
npm install
npm run build
```

## Usage

### Programmatic Usage (TypeScript)

```typescript
import * as pulumi from "@pulumi/pulumi";
import { GcpGarRemote } from "@buildecho/pulumi-onboarding-providers-gcp-gar-remote";

const config = new pulumi.Config();

// Create the Echo remote repository
const echoRemote = new GcpGarRemote("echo-remote", {
    projectId: "my-gcp-project",
    location: "us-central1",
    cacheRepositoryName: "echo",
    echoAccessKeyName: config.requireSecret("echoAccessKeyName"),
    echoAccessKeyValue: config.requireSecret("echoAccessKeyValue"),
    echoRegistryUrl: "https://reg.echohq.com",
    readerMembers: [
        "user:developer@example.com",
        "serviceAccount:my-sa@my-project.iam.gserviceaccount.com"
    ],
    labels: {
        environment: "production",
        team: "platform"
    }
});

// Export the repository details
export const repositoryUrl = echoRemote.repositoryUrl;
export const dockerLoginCommand = echoRemote.dockerLoginCommand;
export const dockerPullExample = echoRemote.dockerPullExample;
export const summary = echoRemote.summary;
```

### Using the Helper Function

```typescript
import { createGcpGarRemote } from "@buildecho/pulumi-onboarding-providers-gcp-gar-remote";

const remote = createGcpGarRemote("echo-remote", {
    projectId: "my-gcp-project",
    echoAccessKeyName: config.requireSecret("echoAccessKeyName"),
    echoAccessKeyValue: config.requireSecret("echoAccessKeyValue")
});

export const repositoryUrl = remote.repositoryUrl;
```

### Configuration-based Usage

1. **Set up configuration**:
   ```bash
   pulumi config set projectId YOUR_GCP_PROJECT_ID
   pulumi config set --secret echoAccessKeyName YOUR_ECHO_ACCESS_KEY_NAME
   pulumi config set --secret echoAccessKeyValue YOUR_ECHO_ACCESS_KEY_VALUE
   
   # Optional configurations
   pulumi config set location us-east1
   pulumi config set cacheRepositoryName echo-cache
   pulumi config set --path readerMembers[0] "user:developer@example.com"
   pulumi config set --path labels.environment "production"
   ```

2. **Deploy**:
   ```bash
   pulumi up
   ```

## Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `projectId` | string | Yes | - | GCP project ID |
| `location` | string | No | `us-central1` | GCP region for Artifact Registry |
| `cacheRepositoryName` | string | No | `echo` | Repository name in Artifact Registry |
| `echoAccessKeyName` | string | Yes | - | Echo registry username |
| `echoAccessKeyValue` | string | Yes | - | Echo registry password/token |
| `echoRegistryUrl` | string | No | `https://reg.echohq.com` | Echo registry URL |
| `description` | string | No | `Remote repository for Echo Registry integration` | Repository description |
| `readerMembers` | string[] | No | `[]` | IAM members with read access |
| `writerMembers` | string[] | No | `[]` | IAM members with write access |
| `labels` | Record<string, string> | No | `{}` | Custom labels for resources |

## Using the Remote Repository

After deployment, you can pull Echo images through GCP:

1. **Authenticate Docker with GCP**:
   ```bash
   gcloud auth configure-docker us-central1-docker.pkg.dev
   ```

2. **Pull an Echo image**:
   ```bash
   docker pull us-central1-docker.pkg.dev/YOUR_PROJECT/echo/IMAGE_NAME:TAG
   ```

## Required IAM Permissions

Your GCP service account needs:
- `roles/artifactregistry.admin` - To create and manage repositories
- `roles/secretmanager.admin` - To create and manage secrets
- `roles/iam.serviceAccountUser` - To grant permissions to the GAR service account

## Outputs

The component provides the following outputs:

- `repositoryId`: The repository ID
- `repositoryName`: The full repository resource name
- `repositoryUrl`: The URL for pulling images
- `secretId`: The Secret Manager secret ID
- `secretVersionName`: The secret version resource name
- `dockerLoginCommand`: Command to authenticate Docker
- `dockerPullExample`: Example docker pull command
- `summary`: Human-readable summary of created resources
- `repository`: The Artifact Registry repository resource
- `secret`: The Secret Manager secret resource

## Architecture

This component creates:
1. A Google Secret Manager secret to store Echo credentials
2. An Artifact Registry remote repository configured to proxy Echo's registry
3. IAM bindings for the Artifact Registry service account to access the secret
4. Optional IAM bindings for reader/writer access

## Troubleshooting

### Authentication Issues
- Ensure your Echo credentials are correct
- Verify the GAR service account has access to the secret
- Check that the APIs are enabled in your GCP project

### Pull Errors
- Confirm you've authenticated Docker with `gcloud auth configure-docker`
- Verify the image name follows the pattern: `LOCATION-docker.pkg.dev/PROJECT/REPOSITORY/IMAGE:TAG`
- Check IAM permissions for your user/service account

## Support

For issues or questions:
- Echo support: support@echohq.com
- GitHub issues: https://github.com/buildecho/onboarding-providers/issues 