# Echo Registry Integration Providers

Infrastructure-as-code templates to integrate various container registries with Echo registry service.

## 🚀 Quick Start

This repository provides ready-to-use templates for integrating your container registries with Echo, enabling local caching and proxy capabilities for improved performance, enhanced security, and reduced data transfer costs.

### Supported Integrations

- **AWS ECR Pull-Through Cache**: Automatically pull and cache Echo images in your AWS ECR
- **Google Artifact Registry Remote Repositories**: Mirror Echo images in your GCP environment  
- **Harbor Proxy Cache**: Configure Harbor to proxy Echo Registry
- **JFrog Artifactory Remote Repository**: Configure Artifactory to proxy Echo Registry
- **Sonatype Nexus Docker Proxy**: Configure Nexus to proxy Echo Registry

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
- **Target registry/platform access** (AWS, GCP, Harbor, JFrog, or Nexus instance)
- **Appropriate permissions** to create resources in your environment

## 📋 Common Features

All integrations provide consistent:

### ✅ Resource Naming
- Default prefix: `echo-mirror` for all created resources
- Fully customizable resource names via configuration
- Consistent naming patterns across all providers

### ✅ Conditional Creation
- Boolean `create` parameter (default: `true`) 
- Safely disable resource provisioning when needed
- Conditional outputs for clean integration

### ✅ Comprehensive Outputs
- Resource ARNs/IDs for all provisioned infrastructure
- Detailed usage instructions with example commands
- Ready-to-use configuration snippets for CI/CD

### ✅ Enhanced Security
- Secure credential management
- IAM/RBAC integration where applicable
- Vulnerability scanning capabilities (provider-dependent)

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
terraform apply \
  -var="source_registry_account_id=123456789012" \
  -var="repository_name_prefix=echo-mirror"
```

#### AWS ECR with CloudFormation
```bash
cd cloudformation/ecr-pullthrough-cache
aws cloudformation deploy \
  --template-file template.yaml \
  --stack-name echo-ecr-integration \
  --parameter-overrides \
    SourceRegistryAccountId=123456789012 \
    RepositoryNamePrefix=echo-mirror \
  --capabilities CAPABILITY_NAMED_IAM
```

#### Harbor with Pulumi
```typescript
import { HarborIntegration } from "@echo/pulumi-harbor-integration";

const integration = new HarborIntegration("echo-harbor", {
    echoAccessKeyName: "your-key-name",
    echoAccessKeyValue: pulumi.secret("your-key-value"),
    projectName: "echo-mirror",
    registryName: "echo-mirror-registry"
});

export const instructions = integration.usageInstructions;
```

#### Google Artifact Registry with Terraform
```bash
cd terraform/gcp-gar-remote
terraform init
terraform apply \
  -var="project_id=my-gcp-project" \
  -var="repository_name=echo-mirror" \
  -var="echo_access_key_name=your-username" \
  -var="echo_access_key_value=your-password"
```

#### JFrog Artifactory with Pulumi
```typescript
import { JfrogIntegration } from "@echo/pulumi-jfrog-integration";

const integration = new JfrogIntegration("echo-jfrog", {
    echoAccessKeyName: "your-key-name",
    echoAccessKeyValue: pulumi.secret("your-key-value"),
    repositoryName: "echo-mirror"
});

export const repositoryUrl = integration.repositoryUrl;
```

## 🌟 Features by Integration

### AWS ECR Pull-Through Cache
- ✅ Automatic image caching from Echo Registry with 24-hour refresh
- ✅ Cross-region replication support
- ✅ IAM role-based authentication with least privilege access
- ✅ CloudFormation, Terraform, and Pulumi support
- ✅ Conditional creation and comprehensive outputs
- ✅ Cost optimization with local caching

### Google Artifact Registry
- ✅ Remote repository configuration with automatic synchronization
- ✅ Google Cloud IAM integration and access controls
- ✅ Secret Manager integration for secure credential storage
- ✅ Terraform and Pulumi support with consistent APIs
- ✅ Multi-region support for global deployments
- ✅ Enhanced security with GCP's native scanning

### Harbor
- ✅ Proxy cache project configuration with Echo Registry
- ✅ Advanced vulnerability scanning integration
- ✅ Content trust support (Notary/Cosign)
- ✅ SBOM generation capabilities for supply chain security
- ✅ Terraform and Pulumi support
- ✅ Robot accounts and LDAP/OIDC integration ready

### JFrog Artifactory
- ✅ Remote repository configuration optimized for Echo Registry
- ✅ Secure authentication with Echo access keys
- ✅ Flexible caching policies and cleanup automation
- ✅ JFrog Xray security scanning integration
- ✅ Build info collection and artifact traceability
- ✅ Advanced RBAC and enterprise-grade security

### Sonatype Nexus
- ✅ Docker proxy repository configuration
- ✅ Secure authentication with Echo registry
- ✅ Flexible caching and cleanup policies
- ✅ Content selector and privilege management
- ✅ Terraform and Pulumi support
- ✅ Enterprise security and compliance features

## 💡 Best Practices

### Security
- Use separate access keys for each integration
- Implement least privilege access controls
- Enable vulnerability scanning where available
- Regularly rotate access credentials

### Performance
- Configure appropriate caching policies
- Set up cleanup policies to manage storage costs
- Use regional deployments to reduce latency
- Monitor cache hit ratios and adjust accordingly

### Operations
- Implement comprehensive monitoring and alerting
- Use infrastructure-as-code for all deployments
- Document custom configurations for team knowledge
- Test integrations in non-production environments first

## 🤝 Support

For questions or issues:
1. Check the provider-specific README in each directory
2. Review integration-specific documentation and examples
3. Contact Echo's integration team at support@echohq.com

## 🔄 Updates and Versioning

This repository follows semantic versioning. All integrations are regularly updated to:
- Support the latest provider APIs and features
- Incorporate security best practices
- Maintain compatibility with the latest infrastructure tools
- Add new integration capabilities based on user feedback

## 📄 License

This project is licensed under the MIT License. Individual modules may have their own LICENSE files in their respective directories. 