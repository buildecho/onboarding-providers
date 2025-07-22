# Onboarding Providers

Infrastructure-as-code templates to integrate various container registries with Echo registry service.

## 🚀 Quick Start

This repository provides ready-to-use templates for integrating your container registries with Echo, enabling local caching and proxy capabilities for improved performance and reduced data transfer costs.

### Supported Integrations

- **AWS ECR Pull-Through Cache**: Automatically pull and cache Echo images in your AWS ECR
- **Google Artifact Registry Remote Repositories**: Mirror Echo images in your GCP environment
- **Harbor Proxy Cache**: Configure Harbor to proxy Echo Registry
- **JFrog Artifactory**: Configure Artifactory to proxy Echo Registry
- **Sonatype Nexus**: Configure Nexus to proxy Echo Registry

## 📁 Repository Structure

```
├── cloudformation/          # AWS CloudFormation templates
│   └── ecr-pullthrough-cache/
├── terraform/              # Terraform modules
│   ├── ecr-pullthrough-cache/
│   ├── gcp-gar-remote/
│   ├── harbor-integration/
│   ├── jfrog-integration/
│   └── nexus-integration/
└── pulumi/                 # Pulumi stacks
    ├── ecr-pullthrough-cache/
    ├── gcp-gar-remote/
    ├── harbor-integration/
    ├── jfrog-integration/
    └── nexus-integration/
```

## 🛠️ Available Integrations

### AWS ECR Pull-Through Cache

| Tool | Status | Directory |
|------|--------|-----------|
| **CloudFormation** | ✅ Ready | [`/cloudformation/ecr-pullthrough-cache`](./cloudformation/ecr-pullthrough-cache) |
| **Terraform** | ✅ Ready | [`/terraform/ecr-pullthrough-cache`](./terraform/ecr-pullthrough-cache) |
| **Pulumi** | ✅ Ready | [`/pulumi/ecr-pullthrough-cache`](./pulumi/ecr-pullthrough-cache) |

### Google Artifact Registry (GAR) Remote Repositories

| Tool | Status | Directory |
|------|--------|-----------|
| **Terraform** | ✅ Ready | [`/terraform/gcp-gar-remote`](./terraform/gcp-gar-remote) |
| **Pulumi** | ✅ Ready | [`/pulumi/gcp-gar-remote`](./pulumi/gcp-gar-remote) |

### Harbor Proxy Cache

| Tool | Status | Directory |
|------|--------|-----------|
| **Terraform** | ✅ Ready | [`/terraform/harbor-integration`](./terraform/harbor-integration) |
| **Pulumi** | ✅ Ready | [`/pulumi/harbor-integration`](./pulumi/harbor-integration) |

### JFrog Artifactory

| Tool | Status | Directory |
|------|--------|-----------|
| **Terraform** | ✅ Ready | [`/terraform/jfrog-integration`](./terraform/jfrog-integration) |
| **Pulumi** | ✅ Ready | [`/pulumi/jfrog-integration`](./pulumi/jfrog-integration) |

### Sonatype Nexus Docker Proxy

| Tool | Status | Directory |
|------|--------|-----------|
| **Terraform** | ✅ Ready | [`/terraform/nexus-integration`](./terraform/nexus-integration) |
| **Pulumi** | ✅ Ready | [`/pulumi/nexus-integration`](./pulumi/nexus-integration) |

## 🔧 Prerequisites

Before deploying any integration, you'll need:
- **Echo Registry Access Credentials** (access key name and value)
- **Target registry/platform access** (AWS, GCP, or Harbor instance)
- **Appropriate permissions** to create resources in your environment

## 📚 Getting Started

1. **Choose your integration type** based on your container registry platform
2. **Select your preferred IaC tool** (CloudFormation, Terraform, or Pulumi)
3. **Navigate to the specific directory** for detailed instructions
4. **Deploy using the provided templates**
5. **Test by pulling an Echo image** through your configured integration

### Example Deployments

#### AWS ECR with Terraform
```bash
cd terraform/ecr-pullthrough-cache
terraform init
terraform apply -var="source_registry_account_id=123456789012"
```

#### Harbor with Pulumi
```typescript
import { HarborIntegration } from "@buildecho/pulumi-harbor-integration";

const integration = new HarborIntegration("echo-harbor", {
    echoAccessKeyName: "your-key-name",
    echoAccessKeyValue: pulumi.secret("your-key-value"),
});
```

#### Google Artifact Registry with Terraform
```bash
cd terraform/gcp-gar-remote
terraform init
terraform apply -var="echo_username=your-username" -var="echo_password=your-password"
```

#### JFrog Artifactory with Terraform
```bash
cd terraform/jfrog-integration
terraform init
terraform apply -var="echo_access_key_name=your-key-name" -var="echo_access_key_value=your-key-value"
```

#### JFrog Artifactory with Pulumi
```typescript
import { JfrogIntegration } from "@buildecho/pulumi-onboarding-providers-jfrog-integration";

const integration = new JfrogIntegration("echo-jfrog", {
    echoAccessKeyName: "your-key-name",
    echoAccessKeyValue: pulumi.secret("your-key-value"),
});
```

#### Sonatype Nexus with Terraform
```bash
cd terraform/nexus-integration
terraform init
terraform apply -var="echo_access_key_name=your-key-name" -var="echo_access_key_value=your-key-value"
```

#### Sonatype Nexus with Pulumi
```typescript
import { NexusIntegration } from "@buildecho/pulumi-nexus-integration";

const nexusIntegration = new NexusIntegration("echo-nexus", {
    echoAccessKeyName: "your-key-name",
    echoAccessKeyValue: pulumi.secret("your-key-value"),
});
```



## 🌟 Features by Integration

### AWS ECR Pull-Through Cache
- ✅ Automatic image caching from Echo Registry
- ✅ Cross-region replication support
- ✅ IAM role-based authentication
- ✅ CloudFormation, Terraform, and Pulumi support

### Google Artifact Registry
- ✅ Remote repository configuration
- ✅ Automatic synchronization with Echo Registry
- ✅ Google Cloud IAM integration
- ✅ Terraform and Pulumi support

### Harbor
- ✅ Proxy cache project configuration
- ✅ Vulnerability scanning integration
- ✅ Content trust support (Notary/Cosign)
- ✅ SBOM generation capabilities
- ✅ Terraform and Pulumi support

### JFrog Artifactory
- ✅ Remote repository configuration for Echo Registry
- ✅ Authentication with Echo access keys
- ✅ Flexible caching policies
- ✅ Xray security scanning integration
- ✅ Virtual repository support
- ✅ Terraform and Pulumi support

### Sonatype Nexus
- ✅ Docker proxy repository configuration
- ✅ Authentication with Echo registry
- ✅ Flexible caching policies
- ✅ Cleanup policy support
- ✅ Content selector and privilege management
- ✅ Terraform and Pulumi support

## 🤝 Support

For questions or issues:
1. Check the tool-specific README in each directory
2. Review integration-specific documentation
3. Contact Echo's integration team at support@echohq.com

## 📄 License

This project is licensed under the MIT License. Individual modules may have their own LICENSE files in their respective directories. 