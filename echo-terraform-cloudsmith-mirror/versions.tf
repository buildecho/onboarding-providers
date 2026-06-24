terraform {
  required_version = ">= 1.0"

  required_providers {
    cloudsmith = {
      source  = "cloudsmith-io/cloudsmith"
      version = ">= 0.0.49"
    }
  }
}
