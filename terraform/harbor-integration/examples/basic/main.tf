terraform {
  required_version = ">= 1.0"
  required_providers {
    harbor = {
      source  = "goharbor/harbor"
      version = ">= 3.10.21"
    }
  }
}

# Configure the Harbor Provider
provider "harbor" {
  url      = var.harbor_url
  username = var.harbor_username
  password = var.harbor_password
}

# Use the Harbor Echo integration module
module "harbor_echo_integration" {
  source = "../.."

  create                = true
  echo_registry_url     = var.echo_registry_url
  echo_access_key_name  = var.echo_access_key_name
  echo_access_key_value = var.echo_access_key_value
}

# Variables
variable "harbor_url" {
  type        = string
  description = "The URL of your Harbor instance"
}

variable "harbor_username" {
  type        = string
  description = "Username for Harbor authentication"
  default     = "admin"
}

variable "harbor_password" {
  type        = string
  description = "Password for Harbor authentication"
  sensitive   = true
}

variable "echo_registry_url" {
  type        = string
  description = "The URL of the Echo registry"
  default     = "https://reg.echohq.com"
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
output "echo_registry_created" {
  description = "Whether the Echo registry was created"
  value       = module.harbor_echo_integration.echo_registry_created
}

output "echo_project_created" {
  description = "Whether the Echo proxy cache project was created"
  value       = module.harbor_echo_integration.echo_project_created
}
