terraform {
  # 1.2 for resource lifecycle preconditions (see the apt proxy in main.tf).
  required_version = ">= 1.2"

  required_providers {
    nexus = {
      source  = "datadrivers/nexus"
      version = ">= 2.0"
    }
  }
}
