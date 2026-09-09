terraform {
  # 1.2 for resource lifecycle preconditions (see the Debian remote in main.tf).
  required_version = ">= 1.2"

  required_providers {
    artifactory = {
      source  = "jfrog/artifactory"
      version = ">= 12.11.4"
    }
  }
}
