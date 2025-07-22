# JFrog Artifactory Integration Terraform Module

This Terraform module configures JFrog Artifactory to integrate with Echo Registry, enabling Artifactory to act as a proxy cache for Echo container images.

## Overview

The module creates:
- A Docker remote repository in Artifactory pointing to Echo Registry
- Proper authentication configuration using Echo access keys
- Caching and performance settings optimized for container image proxying

This integration allows you to:
- Cache Echo container images locally in Artifactory for faster pulls
- Reduce bandwidth usage by caching frequently used images
- Maintain a local registry mirror of Echo images
- Leverage Artifactory's security scanning and policy features on Echo images
- Integrate Echo images into your existing Artifactory workflows

## Requirements

| Name | Version |
|------|---------|
| terraform | >= 1.0 |
| artifactory | >= 12.0.0 |

## Provider Configuration

Before using this module, you need to configure the Artifactory provider:

```hcl
provider "artifactory" {
  url          = "https://your-artifactory-instance.com/artifactory"
  access_token = "your-artifactory-access-token"
}
```

Alternatively, you can use username/password authentication:

```hcl
provider "artifactory" {
  url      = "https://your-artifactory-instance.com/artifactory"
  username = "admin"
  password = "your-artifactory-password"
}
```

## Usage

### Basic Usage

```hcl
module "jfrog_echo_integration" {
  source = "./terraform/jfrog-integration"

  artifactory_url          = "https://your-artifactory.com/artifactory"
  artifactory_access_token = var.artifactory_access_token
  echo_access_key_name     = var.echo_access_key_name
  echo_access_key_value    = var.echo_access_key_value
}
```

### Advanced Usage with Custom Configuration

```hcl
module "jfrog_echo_integration" {
  source = "./terraform/jfrog-integration"

  create                   = true
  artifactory_url          = "https://your-artifactory.com/artifactory"
  artifactory_access_token = var.artifactory_access_token
  repository_key           = "echo-docker-remote"
  echo_registry_url        = "https://reg.echohq.com"
  echo_access_key_name     = var.echo_access_key_name
  echo_access_key_value    = var.echo_access_key_value
  
  # Custom caching settings
  store_artifacts_locally        = true
  retrieval_cache_period_seconds = 7200
  missed_cache_period_seconds    = 1800
  
  # Enable Xray scanning
  xray_index = true
}
```

### Conditional Creation

You can conditionally create the resources using the `create` variable:

```hcl
module "jfrog_echo_integration" {
  source = "./terraform/jfrog-integration"

  create                   = var.enable_jfrog_integration
  artifactory_url          = var.artifactory_url
  artifactory_access_token = var.artifactory_access_token
  echo_access_key_name     = var.echo_access_key_name
  echo_access_key_value    = var.echo_access_key_value
}
```

## Variables

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| create | Whether to provision the resources under this module | `bool` | `true` | no |
| artifactory_url | The URL of your Artifactory instance | `string` | n/a | yes |
| artifactory_access_token | Access token for Artifactory authentication | `string` | n/a | yes |
| repository_key | The key (name) for the remote repository in Artifactory | `string` | `"echo-remote"` | no |
| echo_registry_url | The URL of the Echo registry | `string` | `"https://reg.echohq.com"` | no |
| echo_access_key_name | The name of the Echo access key (username) | `string` | n/a | yes |
| echo_access_key_value | The value of the Echo access key (password) | `string` | n/a | yes |
| description | Description for the remote repository | `string` | `"Echo Registry remote repository for container images"` | no |
| notes | Internal notes about the repository | `string` | `"Managed by Terraform - Echo Registry integration"` | no |
| includes_pattern | Comma-separated list of patterns to include | `string` | `"**/*"` | no |
| excludes_pattern | Comma-separated list of patterns to exclude | `string` | `""` | no |
| repo_layout_ref | Repository layout reference | `string` | `"simple-default"` | no |
| block_mismatching_mime_types | Block artifacts with mismatching MIME types | `bool` | `true` | no |
| enable_token_authentication | Enable token authentication for Docker repositories | `bool` | `true` | no |
| store_artifacts_locally | Store artifacts locally when proxying | `bool` | `true` | no |
| socket_timeout_millis | Network socket timeout in milliseconds | `number` | `15000` | no |
| retrieval_cache_period_seconds | Cache period for retrieval operations in seconds | `number` | `7200` | no |
| missed_cache_period_seconds | Cache period for missed artifacts in seconds | `number` | `1800` | no |
| hard_fail | Fail the request if the remote repository is not available | `bool` | `false` | no |
| offline | Set the repository to offline mode | `bool` | `false` | no |
| bypass_head_requests | Bypass HEAD requests and directly perform GET requests | `bool` | `false` | no |
| priority_resolution | Enable priority resolution | `bool` | `false` | no |
| xray_index | Enable Xray indexing | `bool` | `false` | no |
| property_sets | List of property sets to apply to the repository | `list(string)` | `[]` | no |

## Outputs

| Name | Description |
|------|-------------|
| repository_key | The key of the created remote repository |
| repository_url | The URL of the created remote repository |
| pull_url | The URL to use for pulling images through Artifactory |

## How to Use the Remote Repository

Once the module is applied, you can pull images through Artifactory instead of directly from Echo:

```bash
# Configure Docker to use Artifactory
docker login your-artifactory.com

# Instead of pulling directly from Echo:
# docker pull reg.echohq.com/nginx:latest

# Pull through Artifactory remote repository:
docker pull your-artifactory.com/echo-remote/nginx:latest
```

The first pull will fetch the image from Echo and cache it in Artifactory. Subsequent pulls will use the cached version based on your cache settings.

## Virtual Repository Setup (Optional)

For a more seamless experience, you can create a virtual repository that includes this remote repository:

```hcl
resource "artifactory_virtual_docker_repository" "echo_virtual" {
  key          = "echo-virtual"
  repositories = [module.jfrog_echo_integration.repository_key]
  description  = "Virtual repository including Echo remote"
}
```

## Security Considerations

- Store sensitive values like `artifactory_access_token` and `echo_access_key_value` in a secure manner:
  - Use Terraform variables with sensitive flag
  - Use environment variables
  - Use a secrets management system (HashiCorp Vault, AWS Secrets Manager, etc.)
- Ensure your Artifactory instance is properly secured with TLS
- Regularly update cached images to get security patches
- Consider enabling Xray scanning for vulnerability detection

## Example with Terraform Cloud/Enterprise

```hcl
module "jfrog_echo_integration" {
  source = "./terraform/jfrog-integration"

  artifactory_url          = var.artifactory_url
  artifactory_access_token = data.terraform_remote_state.secrets.outputs.artifactory_token
  echo_access_key_name     = data.terraform_remote_state.secrets.outputs.echo_access_key_name
  echo_access_key_value    = data.terraform_remote_state.secrets.outputs.echo_access_key_value
}
```

## Troubleshooting

### Common Issues

1. **Authentication Failed**: 
   - Ensure your Echo access keys are correct and have the necessary permissions
   - Verify your Artifactory access token has repository creation permissions

2. **Registry Connection Failed**: 
   - Verify the Echo registry URL is accessible from your Artifactory instance
   - Check network connectivity and firewall rules

3. **Repository Creation Failed**: 
   - Check that you have admin permissions in Artifactory
   - Ensure the repository key is unique and follows Artifactory naming conventions

### Debug Commands

```bash
# Test Echo registry connectivity from Artifactory server
curl -I https://reg.echohq.com

# Test authentication
curl -u "your-echo-access-key-name:your-echo-access-key-value" \
  https://reg.echohq.com/v2/_catalog

# Verify Artifactory repository
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-artifactory.com/artifactory/api/repositories/echo-remote

# Test pulling through Artifactory
docker pull your-artifactory.com/echo-remote/alpine:latest
```

### Logs

Check Artifactory logs for detailed error messages:
- System logs: `$ARTIFACTORY_HOME/logs/artifactory.log`
- Request logs: `$ARTIFACTORY_HOME/logs/request.log`

## Best Practices

1. **Caching Strategy**: Adjust cache periods based on your usage patterns
2. **Security**: Always use HTTPS for both Artifactory and Echo registry URLs
3. **Monitoring**: Set up alerts for failed remote repository connections
4. **Cleanup**: Implement retention policies to manage disk space

## License

This module is licensed under the same license as the parent project.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 