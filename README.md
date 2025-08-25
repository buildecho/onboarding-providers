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

The repository uses a **flattened hierarchy** with consistent naming: `echo-<type>-<registry-type>-mirror`

```
├── echo-cloudformation-ecr-mirror/     # AWS CloudFormation ECR template
├── echo-terraform-ecr-mirror/          # Terraform ECR module
├── echo-terraform-gar-mirror/          # Terraform GCP Artifact Registry module  
├── echo-terraform-harbor-mirror/       # Terraform Harbor module
├── echo-terraform-jfrog-mirror/        # Terraform JFrog module
├── echo-terraform-nexus-mirror/        # Terraform Nexus module
├── echo-pulumi-ecr-mirror/            # Pulumi ECR component
├── echo-pulumi-gar-mirror/            # Pulumi GCP Artifact Registry component
├── echo-pulumi-harbor-mirror/         # Pulumi Harbor component
├── echo-pulumi-jfrog-mirror/          # Pulumi JFrog component
```

### ✨ New Features
- **🏷️ Configurable Resource Naming**: All resources use `echo-mirror` prefix by default, fully customizable
- **⚙️ Conditional Creation**: Control resource creation with `create` parameter
- **📋 Enhanced Usage Instructions**: Copy-paste ready commands and examples
- **🔗 Resource ARN Outputs**: Complete resource identifiers for integration

## 🛠️ Available Integrations

### AWS ECR Pull-Through Cache

| Tool | Status | Directory |
|------|--------|-----------|
| **CloudFormation** | ✅ Ready | [`/echo-cloudformation-ecr-mirror`](./echo-cloudformation-ecr-mirror) |
| **Terraform** | ✅ Ready | [`/echo-terraform-ecr-mirror`](./echo-terraform-ecr-mirror) |
| **Pulumi** | ✅ Ready | [`/echo-pulumi-ecr-mirror`](./echo-pulumi-ecr-mirror) |

### Google Artifact Registry (GAR) Remote Repositories

| Tool | Status | Directory |
|------|--------|-----------|
| **Terraform** | ✅ Ready | [`/echo-terraform-gar-mirror`](./echo-terraform-gar-mirror) |
| **Pulumi** | ✅ Ready | [`/echo-pulumi-gar-mirror`](./echo-pulumi-gar-mirror) |

### Harbor Proxy Cache

| Tool | Status | Directory |
|------|--------|-----------|
| **Terraform** | ✅ Ready | [`/echo-terraform-harbor-mirror`](./echo-terraform-harbor-mirror) |
| **Pulumi** | ✅ Ready | [`/echo-pulumi-harbor-mirror`](./echo-pulumi-harbor-mirror) |

### JFrog Artifactory

| Tool | Status | Directory |
|------|--------|-----------|
| **Terraform** | ✅ Ready | [`/echo-terraform-jfrog-mirror`](./echo-terraform-jfrog-mirror) |
| **Pulumi** | ✅ Ready | [`/echo-pulumi-jfrog-mirror`](./echo-pulumi-jfrog-mirror) |

### Sonatype Nexus Docker Proxy

| Tool | Status | Directory |
|------|--------|-----------|
| **Terraform** | ✅ Ready | [`/echo-terraform-nexus-mirror`](./echo-terraform-nexus-mirror) |

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

All modules now support **configurable resource naming** and **conditional creation**.

#### AWS ECR with Terraform
```bash
cd echo-terraform-ecr-mirror
terraform init

# Basic deployment with default echo-mirror prefix
terraform apply -var="source_registry_account_id=123456789012"

# Custom resource prefix
terraform apply \
  -var="source_registry_account_id=123456789012" \
  -var="resource_prefix=my-company-echo"

# Disable resource creation
terraform apply \
  -var="create=false"
```

#### AWS ECR with Pulumi  
```typescript
import { EcrPullThroughCache } from "@buildecho/echo-pulumi-ecr-mirror";

const cache = new EcrPullThroughCache("echo-cache", {
    sourceRegistryAccountId: "123456789012",
    resourcePrefix: "my-company-echo",  // Optional: defaults to "echo-mirror"
    create: true,  // Optional: defaults to true
});

export const usageInstructions = cache.usageInstructions;
export const resourceArns = cache.cacheRuleArn;
```

#### Google Artifact Registry with Terraform
```bash
cd echo-terraform-gar-mirror
terraform init

# Deploy with custom prefix
terraform apply \
  -var="project_id=my-gcp-project" \
  -var="echo_access_key_name=your-key-name" \
  -var="echo_access_key_value=your-key-value" \
  -var="resource_prefix=my-echo-mirror"
```

#### Harbor with Terraform
```bash
cd echo-terraform-harbor-mirror
terraform init
terraform apply \
  -var="echo_access_key_name=your-key-name" \
  -var="echo_access_key_value=your-key-value" \
  -var="resource_prefix=my-harbor-echo"
```

#### JFrog Artifactory with Terraform
```bash
cd echo-terraform-jfrog-mirror
terraform init
terraform apply \
  -var="artifactory_url=https://mycompany.jfrog.io" \
  -var="artifactory_access_token=your-token" \
  -var="echo_access_key_name=your-key-name" \
  -var="echo_access_key_value=your-key-value"
```

#### Nexus with Terraform
```bash
cd echo-terraform-nexus-mirror
terraform init
terraform apply \
  -var="echo_access_key_name=your-key-name" \
  -var="echo_access_key_value=your-key-value" \
  -var="resource_prefix=company-nexus-echo"
```



## 🌟 Features by Integration

### 🆕 Universal Features (All Modules)
- **🏷️ Configurable Resource Naming**: Use `echo-mirror` prefix by default, or customize with `resource_prefix`
- **⚙️ Conditional Creation**: Control resource provisioning with `create=false` parameter
- **📋 Enhanced Usage Instructions**: Get copy-paste ready commands and examples as outputs
- **🔗 Resource ARN/ID Outputs**: Complete resource identifiers for downstream integration
- **🛡️ Consistent Security**: All modules follow security best practices with least privilege

### AWS ECR Pull-Through Cache
- ✅ Automatic image caching from Echo Registry
- ✅ Cross-region replication support  
- ✅ IAM role-based authentication with custom policies
- ✅ CloudFormation, Terraform, and Pulumi support
- ✅ Configurable cache rule names and repository prefixes

### Google Artifact Registry
- ✅ Remote repository configuration with Secret Manager integration
- ✅ Automatic synchronization with Echo Registry
- ✅ Google Cloud IAM integration with granular permissions
- ✅ Terraform and Pulumi support
- ✅ Custom repository naming and location support

### Harbor
- ✅ Proxy cache project configuration
- ✅ Vulnerability scanning integration
- ✅ Content trust support (Notary/Cosign)
- ✅ SBOM generation capabilities
- ✅ Terraform and Pulumi support
- ✅ Configurable registry and project naming

### JFrog Artifactory
- ✅ Remote repository configuration for Echo Registry
- ✅ Authentication with Echo access keys
- ✅ Flexible caching policies and cleanup rules
- ✅ Xray security scanning integration
- ✅ Virtual repository support
- ✅ Terraform and Pulumi support

### Sonatype Nexus
- ✅ Docker proxy repository configuration
- ✅ Authentication with Echo registry
- ✅ Flexible caching policies and cleanup rules
- ✅ Content selector and privilege management
- ✅ Terraform and Pulumi support
- ✅ Configurable repository and blob store settings

## 🤝 Support

For questions or issues:
1. Check the tool-specific README in each directory
2. Review integration-specific documentation
3. Contact Echo's integration team at support@echohq.com

## 📄 License

This project is licensed under the MIT License. Individual modules may have their own LICENSE files in their respective directories. 
