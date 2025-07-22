terraform {
  required_version = ">= 1.0"
  required_providers {
    artifactory = {
      source  = "jfrog/artifactory"
      version = ">= 12.0.0"
    }
  }
}

# Configure the Artifactory Provider
provider "artifactory" {
  url          = var.artifactory_url
  access_token = var.artifactory_access_token
}

# Use the JFrog Echo integration module
module "jfrog_echo_integration" {
  source = "../.."

  artifactory_url          = var.artifactory_url
  artifactory_access_token = var.artifactory_access_token
  echo_access_key_name     = var.echo_access_key_name
  echo_access_key_value    = var.echo_access_key_value

}

# Variables
variable "artifactory_url" {
  type        = string
  description = "The URL of your Artifactory instance"
}

variable "artifactory_access_token" {
  type        = string
  description = "Access token for Artifactory authentication"
  sensitive   = true
}

variable "echo_access_key_name" {
  type        = string
  description = "The name of the Echo access key"
  sensitive   = true
}

variable "echo_access_key_value" {
  type        = string
  description = "The value of the Echo access key"
  sensitive   = true
}

# Outputs
output "repository_key" {
  description = "The key of the created remote repository"
  value       = module.jfrog_echo_integration.repository_key
}

output "pull_url" {
  description = "The URL to use for pulling images"
  value       = module.jfrog_echo_integration.pull_url
}
