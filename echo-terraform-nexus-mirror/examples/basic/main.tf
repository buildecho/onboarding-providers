terraform {
  required_version = ">= 1.0"
  required_providers {
    nexus = {
      source  = "datadrivers/nexus"
      version = ">= 2.0.0"
    }
  }
}

# Configure the Nexus Provider
provider "nexus" {
  insecure = var.nexus_insecure
  password = var.nexus_password
  url      = var.nexus_url
  username = var.nexus_username
}

# Create Echo Docker proxy repository
module "nexus_echo_proxy" {
  source = "../../"

  # Echo Registry Credentials (Required)
  echo_access_key_name  = var.echo_access_key_name
  echo_access_key_value = var.echo_access_key_value

  # Optional: Customize repository name
  repository_name = "echo"

  # Optional: Configure Docker ports if needed
  docker_http_port = 2525
  # docker_https_port = 8083

  # Optional: Customize cache settings
  proxy_content_max_age  = 1440 # 24 hours
  proxy_metadata_max_age = 60   # 1 hour

  tags = {
    Environment = "production"
    ManagedBy   = "terraform"
  }
}

# Output the repository details
output "repository_name" {
  description = "Name of the created repository"
  value       = module.nexus_echo_proxy.repository_name
}

output "docker_pull_command" {
  description = "Example Docker pull command"
  value       = module.nexus_echo_proxy.docker_pull_command
}

output "configuration_summary" {
  description = "Summary of repository configuration"
  value       = module.nexus_echo_proxy.configuration_summary
}
