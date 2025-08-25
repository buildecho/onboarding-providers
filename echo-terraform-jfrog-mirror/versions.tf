terraform {
  required_version = ">= 1.0"

  required_providers {
    artifactory = {
      source  = "jfrog/artifactory"
      version = ">= 10.0"
    }
  }
}
