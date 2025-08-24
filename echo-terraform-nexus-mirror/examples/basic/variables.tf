# Nexus Provider Configuration
variable "nexus_url" {
  description = "URL of your Nexus instance"
  type        = string
  default     = "https://nexus.example.com"
}

variable "nexus_username" {
  description = "Username for Nexus authentication"
  type        = string
  default     = "admin"
}

variable "nexus_password" {
  description = "Password for Nexus authentication"
  type        = string
  sensitive   = true
}

variable "nexus_insecure" {
  description = "Allow insecure HTTPS connections to Nexus"
  type        = bool
  default     = false
}

# Echo Registry Configuration
variable "echo_access_key_name" {
  description = "Echo access key name - Get this from Echo platform"
  type        = string
  sensitive   = true
}

variable "echo_access_key_value" {
  description = "Echo access key value - Get this from Echo platform"
  type        = string
  sensitive   = true
} 
