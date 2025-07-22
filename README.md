# Onboarding Providers

Infrastructure-as-code templates to integrate AWS ECR with Echo registry service using pullthrough cache.

## 🚀 Quick Start

This repository provides ready-to-use templates for creating ECR pullthrough cache rules that connect your AWS ECR to Echo's private registry.

### What is ECR Pullthrough Cache?

ECR pullthrough cache allows you to automatically pull and cache container images from Echo's registry into your own ECR, improving performance and reducing data transfer costs.

## 📁 Repository Structure

```
├── cloudformation/          # AWS CloudFormation template
├── terraform/              # Terraform module
├── pulumi/                 # Pulumi stack
├── examples/               # Example configurations
└── docs/                   # Additional documentation
```

## 🛠️ Choose Your Tool

| Tool | Best For | Directory |
|------|----------|-----------|
| **CloudFormation** | AWS-native deployments, YAML/JSON preference | [`/cloudformation/ecr-pullthrough-cache`](./cloudformation/ecr-pullthrough-cache) |
| **Terraform** | Multi-cloud environments, HCL syntax | [`/terraform/ecr-pullthrough-cache`](./terraform/ecr-pullthrough-cache) |
| **Pulumi** | TypeScript/programming language preference | [`/pulumi/ecr-pullthrough-cache`](./pulumi/ecr-pullthrough-cache) |

## 🔧 Prerequisites

Before deploying, you'll need from Echo's team:
- **Echo's AWS Account ID** (12-digit number)
- **Echo's AWS Region** (typically us-east-1)
- **Available repository names**

## 📚 Getting Started

1. **Choose your infrastructure tool** from the table above
2. **Navigate to the tool's directory** for specific instructions
3. **Deploy using the provided templates**
4. **Test by pulling an image** through your new cache

### Example Deployment (Terraform)

```bash
cd terraform/ecr-pullthrough-cache
terraform init
terraform apply -var="source_registry_account_id=123456789012"
```

## 📖 Documentation

- [Detailed ECR Integration Guide](./docs/integrations/ecr.md)
- [Example Configurations](./examples/)

## 🚧 Work in Progress

The following integrations have preliminary code but are not yet fully implemented or documented:
- Google Cloud Artifact Registry (GAR)
- JFrog Artifactory
- Sonatype Nexus
- Harbor Registry

These directories contain work-in-progress code and should not be used in production.

## 🤝 Support

For questions or issues:
1. Check the tool-specific README in each directory
2. Review the [ECR Integration Guide](./docs/integrations/ecr.md)
3. Contact Echo's integration team with your AWS account ID and any error messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 