# Harbor Integration Terraform Module

This Terraform module configures Harbor to integrate with Echo Registry, enabling Harbor to act as a proxy cache for Echo container images.

## Overview

The module creates:
- A Harbor registry configuration pointing to Echo Registry
- A Harbor project configured as a proxy cache for Echo images

This integration allows you to:
- Cache Echo container images locally in Harbor for faster pulls
- Reduce bandwidth usage by caching frequently used images
- Maintain a local registry mirror of Echo images
- Leverage Harbor's security scanning and policy features on Echo images

## Requirements

| Name | Version |
|------|---------|
| terraform | >= 1.0 |
| harbor | >= 3.10.21 |

## Provider Configuration

Before using this module, you need to configure the Harbor provider:

```hcl
provider "harbor" {
  url      = "https://your-harbor-instance.com"
  username = "admin"
  password = "your-harbor-password"
}
```

## Usage

### Basic Usage

```hcl
module "harbor_echo_integration" {
  source = "./terraform/harbor-integration"

  echo_access_key_name  = "your-echo-access-key-name"
  echo_access_key_value = "your-echo-access-key-value"
}
```

### Advanced Usage with Custom Configuration

```hcl
module "harbor_echo_integration" {
  source = "./terraform/harbor-integration"

  create                = true
  echo_registry_url     = "https://reg.echohq.com"
  echo_access_key_name  = var.echo_access_key_name
  echo_access_key_value = var.echo_access_key_value
}
```

### Conditional Creation

You can conditionally create the resources using the `create` variable:

```hcl
module "harbor_echo_integration" {
  source = "./terraform/harbor-integration"

  create                = var.enable_harbor_integration
  echo_access_key_name  = var.echo_access_key_name
  echo_access_key_value = var.echo_access_key_value
}
```

## Variables

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| create | Whether to provision the resources under this module | `bool` | `true` | no |
| echo_registry_url | The URL of the Echo registry | `string` | `"https://reg.echohq.com"` | no |
| echo_access_key_name | The name of the Echo access key | `string` | n/a | yes |
| echo_access_key_value | The value of the Echo access key | `string` | n/a | yes |

## Resources Created

This module creates the following resources:

1. **harbor_registry.echo_registry**: Configures Echo Registry as an external registry in Harbor
   - Provider: docker-registry
   - Endpoint: Echo Registry URL
   - Authentication: Uses provided Echo access keys

2. **harbor_project.echo_proxy_cache**: Creates a Harbor project configured as a proxy cache
   - Project name: `echo`
   - Type: Proxy cache project linked to the Echo registry

## How to Use the Proxy Cache

Once the module is applied, you can pull images through Harbor instead of directly from Echo:

```bash
# Instead of pulling directly from Echo:
# docker pull reg.echohq.com/nginx:latest

# Pull through Harbor proxy cache:
docker pull your-harbor-instance.com/echo/nginx:latest
```

The first pull will fetch the image from Echo and cache it in Harbor. Subsequent pulls will use the cached version.

## Security Considerations

- Store sensitive values like `echo_access_key_value` in a secure manner (e.g., using Terraform variables, environment variables, or a secrets management system)
- Ensure your Harbor instance is properly secured with TLS
- Regularly update cached images to get security patches

## Example with Terraform Cloud/Enterprise

```hcl
module "harbor_echo_integration" {
  source = "./terraform/harbor-integration"

  echo_access_key_name  = data.terraform_remote_state.secrets.outputs.echo_access_key_name
  echo_access_key_value = data.terraform_remote_state.secrets.outputs.echo_access_key_value
}
```

## Troubleshooting

### Common Issues

1. **Authentication Failed**: Ensure your Echo access keys are correct and have the necessary permissions
2. **Registry Connection Failed**: Verify the Echo registry URL is accessible from your Harbor instance
3. **Project Creation Failed**: Check that you have admin permissions in Harbor

### Debug Commands

```bash
# Test Echo registry connectivity
curl -I https://reg.echohq.com

# Verify Harbor configuration
harbor-cli registry list
harbor-cli project list
```

## License

This module is licensed under the same license as the parent project.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 