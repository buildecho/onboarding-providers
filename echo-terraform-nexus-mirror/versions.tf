terraform {
  required_version = ">= 1.0"

  required_providers {
    nexus = {
      source  = "datadrivers/nexus"
      version = ">= 2.0"
    }
  }
}
