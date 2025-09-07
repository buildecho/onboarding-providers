# Onboarding Providers

Infrastructure-as-code templates to integrate container registries with Echo registry service.

## Available Integrations

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

## Prerequisites

- Echo Registry access credentials (access key name and value)
- Target registry/platform access (AWS, GCP, Harbor, JFrog, or Nexus)
- Appropriate permissions to create resources in your environment

## Getting Started

1. Choose your integration type and IaC tool
2. Navigate to the specific directory for detailed instructions  
3. Deploy using the provided templates
4. Test by pulling an Echo image through your configured integration

### Quick Examples

All modules support configurable resource naming and conditional creation.

#### Terraform
```bash
cd echo-terraform-<registry>-mirror
terraform init
terraform apply -var="required_var=value"
```

#### Pulumi  
```typescript
import { Component } from "@buildecho/echo-pulumi-<registry>-mirror";

const integration = new Component("echo-integration", {
    // required configuration
});
```

#### CloudFormation (ECR only)
```bash
cd echo-cloudformation-ecr-mirror
aws cloudformation deploy --template-file template.yaml --stack-name echo-mirror
```

## Support

For questions or issues, check the tool-specific README in each directory or contact support@echohq.com.

## License

Apache License 2.0. See [LICENSE](./LICENSE) for details.
