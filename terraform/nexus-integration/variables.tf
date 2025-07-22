variable "create" {
  type        = bool
  description = "Whether to provision the resources under this module"
  default     = true
}

# Echo Registry Configuration
variable "echo_registry_url" {
  type        = string
  description = "The URL of the Echo registry"
  default     = "https://reg.echohq.com"
}

variable "echo_access_key_name" {
  type        = string
  description = "The name of the Echo access key - Get this from Echo platform"
  sensitive   = true
}

variable "echo_access_key_value" {
  type        = string
  description = "The value of the Echo access key - Get this from Echo platform"
  sensitive   = true
}

# Repository Configuration
variable "repository_name" {
  type        = string
  description = "Name of the Docker proxy repository"
  default     = "echo-docker-proxy"

  validation {
    condition     = can(regex("^[a-z0-9]+([._-][a-z0-9]+)*$", var.repository_name))
    error_message = "Repository name must contain only lowercase letters, numbers, periods, hyphens, and underscores."
  }
}

variable "repository_online" {
  type        = bool
  description = "Whether this repository should be online"
  default     = true
}

# Docker Configuration
variable "docker_force_basic_auth" {
  type        = bool
  description = "Force basic authentication"
  default     = true
}

variable "docker_http_port" {
  type        = number
  description = "HTTP port for Docker registry"
  default     = null
}

variable "docker_https_port" {
  type        = number
  description = "HTTPS port for Docker registry"
  default     = null
}

variable "docker_v1_enabled" {
  type        = bool
  description = "Enable Docker V1 API support"
  default     = false
}

# Docker Proxy Index Configuration
variable "docker_index_type" {
  type        = string
  description = "Type of Docker index (REGISTRY, HUB, or CUSTOM)"
  default     = "REGISTRY"

  validation {
    condition     = contains(["REGISTRY", "HUB", "CUSTOM"], var.docker_index_type)
    error_message = "Docker index type must be one of: REGISTRY, HUB, or CUSTOM."
  }
}

variable "docker_index_url" {
  type        = string
  description = "URL of the Docker index (required if docker_index_type is CUSTOM)"
  default     = null
}

# Storage Configuration
variable "blob_store_name" {
  type        = string
  description = "Name of the blob store to use"
  default     = "default"
}

variable "strict_content_type_validation" {
  type        = bool
  description = "Enable strict content type validation"
  default     = true
}



# Proxy Configuration
variable "proxy_content_max_age" {
  type        = number
  description = "How long to cache content metadata (in minutes)"
  default     = 1440
}

variable "proxy_metadata_max_age" {
  type        = number
  description = "How long to cache metadata (in minutes)"
  default     = 1440
}

# HTTP Client Configuration
variable "http_client_blocked" {
  type        = bool
  description = "Block outbound connections from this repository"
  default     = false
}

variable "http_client_auto_block" {
  type        = bool
  description = "Auto-block outbound connections if remote repository is unreachable"
  default     = true
}

# Connection Configuration
variable "connection_retries" {
  type        = number
  description = "Number of retries for connection attempts"
  default     = 3
}

variable "connection_user_agent_suffix" {
  type        = string
  description = "Custom user agent suffix"
  default     = null
}

variable "connection_timeout" {
  type        = number
  description = "Connection timeout in seconds"
  default     = 60
}

variable "connection_enable_circular_redirects" {
  type        = bool
  description = "Enable circular redirects"
  default     = false
}

variable "connection_enable_cookies" {
  type        = bool
  description = "Enable cookies"
  default     = false
}

variable "connection_use_trust_store" {
  type        = bool
  description = "Use Nexus trust store for certificate validation"
  default     = false
}

# Authentication Configuration
variable "authentication_ntlm_host" {
  type        = string
  description = "NTLM host"
  default     = null
}

variable "authentication_ntlm_domain" {
  type        = string
  description = "NTLM domain"
  default     = null
}

# Negative Cache Configuration
variable "negative_cache_enabled" {
  type        = bool
  description = "Enable negative cache"
  default     = true
}

variable "negative_cache_ttl" {
  type        = number
  description = "Negative cache TTL in minutes"
  default     = 1440
}


# Security Configuration
variable "routing_rule" {
  type        = string
  description = "Routing rule for this repository"
  default     = null
}

variable "create_content_selector" {
  type        = bool
  description = "Whether to create a content selector for this repository"
  default     = false
}

variable "content_selector_expression" {
  type        = string
  description = "Custom content selector expression"
  default     = ""
}

variable "create_repository_privilege" {
  type        = bool
  description = "Whether to create a repository privilege"
  default     = false
}

variable "privilege_actions" {
  type        = list(string)
  description = "Actions for repository privilege"
  default     = ["read", "browse"]
}

# Tags
variable "tags" {
  description = "A map of tags to assign to the resources"
  type        = map(string)
  default     = {}
}
