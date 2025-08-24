# Nexus Integration - Terraform Module

This Terraform module creates a Sonatype Nexus Docker proxy repository to integrate with Echo registry.

## Prerequisites

- Sonatype Nexus Repository Manager (OSS or Pro)
- Echo access key (name and value) from Echo platform
- Terraform >= 1.0
- Nexus provider configured with appropriate credentials

## Quick Start

```hcl
module "nexus_echo_proxy" {
  source = "github.com/buildecho/onboarding-providers/terraform/nexus-integration"
  
  echo_access_key_name  = "your-echo-access-key-name"  # Replace with your Echo access key name
  echo_access_key_value = "your-echo-access-key-value" # Replace with your Echo access key value
}
```

Deploy:
```bash
terraform init
terraform plan
terraform apply
```

## Module Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `create` | Whether to provision the resources under this module | ❌ | `true` |
| `echo_registry_url` | The URL of the Echo registry | ❌ | `https://reg.echohq.com` |
| `echo_access_key_name` | Echo access key name (sensitive) | ✅ | - |
| `echo_access_key_value` | Echo access key value (sensitive) | ✅ | - |
| `repository_name` | Name of the Docker proxy repository | ❌ | `echo-docker-proxy` |
| `repository_online` | Whether this repository should be online | ❌ | `true` |
| `docker_force_basic_auth` | Force basic authentication | ❌ | `true` |
| `docker_http_port` | HTTP port for Docker registry | ❌ | `null` |
| `docker_https_port` | HTTPS port for Docker registry | ❌ | `null` |
| `docker_v1_enabled` | Enable Docker V1 API support | ❌ | `false` |
| `docker_index_type` | Type of Docker index (REGISTRY, HUB, or CUSTOM) | ❌ | `REGISTRY` |
| `docker_index_url` | URL of the Docker index (for CUSTOM type) | ❌ | `null` |
| `blob_store_name` | Name of the blob store to use | ❌ | `default` |
| `strict_content_type_validation` | Enable strict content type validation | ❌ | `true` |
| `storage_write_policy` | Write policy (ALLOW, ALLOW_ONCE, or DENY) | ❌ | `ALLOW_ONCE` |
| `proxy_content_max_age` | Content cache duration (minutes) | ❌ | `1440` |
| `proxy_metadata_max_age` | Metadata cache duration (minutes) | ❌ | `1440` |
| `http_client_blocked` | Block outbound connections | ❌ | `false` |
| `http_client_auto_block` | Auto-block if unreachable | ❌ | `true` |
| `connection_retries` | Number of connection retries | ❌ | `3` |
| `connection_timeout` | Connection timeout (seconds) | ❌ | `60` |
| `negative_cache_enabled` | Enable negative cache | ❌ | `true` |
| `negative_cache_ttl` | Negative cache TTL (minutes) | ❌ | `1440` |
| `cleanup_policy_names` | Names of cleanup policies to apply | ❌ | `[]` |
| `create_cleanup_policy` | Create a cleanup policy | ❌ | `false` |
| `create_content_selector` | Create a content selector | ❌ | `false` |
| `create_repository_privilege` | Create repository privilege | ❌ | `false` |
| `tags` | Tags to apply to resources | ❌ | `{}` |

## Module Outputs

| Name | Description |
|------|-------------|
| `repository_name` | Name of the created Docker proxy repository |
| `repository_url` | URL of the Docker proxy repository |
| `repository_format` | Format of the repository (docker) |
| `repository_type` | Type of the repository (proxy) |
| `cleanup_policy_name` | Name of the cleanup policy (if created) |
| `content_selector_name` | Name of the content selector (if created) |
| `repository_privilege_name` | Name of the repository privilege (if created) |
| `docker_pull_command` | Example Docker pull command |
| `configuration_summary` | Summary of the repository configuration |

## Examples

### Basic Usage

```hcl
module "nexus_echo_proxy" {
  source = "./terraform/nexus-integration"
  
  echo_access_key_name  = var.echo_access_key_name
  echo_access_key_value = var.echo_access_key_value
}
```

### Advanced Configuration with Custom Settings

```hcl
module "nexus_echo_proxy" {
  source = "./terraform/nexus-integration"
  
  # Echo credentials
  echo_access_key_name  = var.echo_access_key_name
  echo_access_key_value = var.echo_access_key_value
  
  # Repository configuration
  repository_name = "echo-prod"
  blob_store_name = "docker-blob-store"
  
  # Docker configuration
  docker_http_port  = 8082
  docker_https_port = 8083
  docker_v1_enabled = true
  
  # Proxy settings
  proxy_content_max_age  = 2880  # 48 hours
  proxy_metadata_max_age = 60    # 1 hour
  
  # Connection settings
  connection_timeout = 120
  connection_retries = 5
  
  tags = {
    Environment = "production"
    ManagedBy   = "terraform"
  }
}
```

### With Cleanup Policy

```hcl
module "nexus_echo_proxy" {
  source = "./terraform/nexus-integration"
  
  echo_access_key_name  = var.echo_access_key_name
  echo_access_key_value = var.echo_access_key_value
  
  # Enable cleanup policy
  create_cleanup_policy = true
  cleanup_policy_last_downloaded = 30  # Remove items not downloaded in 30 days
  cleanup_policy_regex = ".*-snapshot.*"  # Clean up snapshot versions
}
```

### With Security Features

```hcl
module "nexus_echo_proxy" {
  source = "./terraform/nexus-integration"
  
  echo_access_key_name  = var.echo_access_key_name
  echo_access_key_value = var.echo_access_key_value
  
  # Create content selector
  create_content_selector = true
  content_selector_expression = "format == \"docker\" and path =~ \"^/v2/echo/.*\""
  
  # Create repository privilege
  create_repository_privilege = true
  privilege_actions = ["read", "browse", "edit"]
  
  # Apply routing rule
  routing_rule = "block-internal-packages"
}
```

### Multiple Repositories

```hcl
# Development repository
module "nexus_echo_dev" {
  source = "./terraform/nexus-integration"
  
  repository_name = "echo-dev"
  echo_access_key_name  = var.echo_dev_access_key_name
  echo_access_key_value = var.echo_dev_access_key_value
}

# Production repository
module "nexus_echo_prod" {
  source = "./terraform/nexus-integration"
  
  repository_name = "echo-prod"
  echo_access_key_name  = var.echo_prod_access_key_name
  echo_access_key_value = var.echo_prod_access_key_value
  
  # Stricter settings for production
  storage_write_policy = "DENY"
  http_client_auto_block = true
}
```

## Nexus Provider Configuration

Before using this module, ensure your Nexus provider is configured:

```hcl
terraform {
  required_providers {
    nexus = {
      source  = "datadrivers/nexus"
      version = ">= 2.0.0"
    }
  }
}

provider "nexus" {
  insecure = true  # Use false in production with proper SSL
  password = "admin123"  # Use a secure password
  url      = "https://nexus.example.com"
  username = "admin"
}
```

## Test the Integration

After applying the module:

1. **Get repository information**:
   ```bash
   terraform output repository_name
   terraform output docker_pull_command
   ```

2. **Configure Docker to use the proxy**:
   ```bash
   # If using HTTP port
   docker login nexus.example.com:8082
   
   # Pull an image through the proxy
   docker pull nexus.example.com:8082/echo-docker-proxy/test-image:latest
   ```

3. **Verify in Nexus UI**:
   - Navigate to Browse → echo-docker-proxy
   - Check that Echo registry images are being proxied

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify Echo access key name and value are correct
   - Check that credentials have not expired
   - Ensure Nexus has internet connectivity to reach Echo registry

2. **Repository Creation Failed**
   - Check Nexus provider credentials
   - Verify blob store exists (or use "default")
   - Ensure repository name is unique

3. **Docker Pull Failed**
   - Verify Docker is configured to trust Nexus certificate (if using HTTPS)
   - Check firewall rules for Docker registry ports
   - Ensure repository is online

### Debug Commands

```bash
# Check Nexus logs
tail -f /opt/sonatype-work/nexus3/log/nexus.log

# Test connectivity to Echo registry
curl -I https://reg.echohq.com

# Verify repository status via API
curl -u admin:password https://nexus.example.com/service/rest/v1/repositories
```

## Security Considerations

1. **Credentials Management**
   - Store Echo access keys in environment variables or secret management system
   - Never commit credentials to version control
   - Rotate access keys regularly

2. **Network Security**
   - Use HTTPS for Nexus when possible
   - Configure firewall rules to restrict access
   - Enable Nexus security realms and user authentication

3. **Repository Security**
   - Use content selectors to restrict access
   - Configure cleanup policies to manage storage
   - Enable vulnerability scanning if using Nexus Pro

## Support

For issues:
1. Check Nexus logs for detailed error messages
2. Verify all prerequisites are met
3. Review the [Nexus Docker Proxy Documentation](https://help.sonatype.com/repomanager3/formats/docker-registry/proxy-repository-for-docker)
4. Contact Echo support for access key issues 