output "registry_login_server" {
  description = "Login server of the target registry, or null when create = false."
  value       = local.registry_login_host
}

output "credential_set_id" {
  description = "Resource ID of the Echo credential set, or null when create = false."
  value       = one(azurerm_container_registry_credential_set.echo[*].id)
}

output "credential_set_principal_id" {
  description = "Object ID of the credential set's managed identity (the identity that reads the Echo secrets), or null when create = false."
  value       = one(azurerm_container_registry_credential_set.echo[*].identity[0].principal_id)
}

output "cache_rules" {
  description = "Created cache rules, keyed by Echo image: rule name, source and target repository."
  value       = { for image, rule in local.cache_rules : image => rule }
}

output "pull_references" {
  description = "Image references to use instead of reg.echohq.com/<image>:<tag>, keyed by Echo image."
  value       = { for image, rule in local.cache_rules : image => "${local.registry_login_host}/${rule.target_repo}:<tag>" }
}

output "usage_instructions" {
  description = "How to check the credential set and pull a cached Echo image."
  value = var.create ? join("\n", [
    "az acr credential-set show --registry ${local.registry_name} --name ${var.credential_set_name} --query \"authCredentials[0].credentialHealth.status\" --output tsv   # expect Healthy",
    "az acr login --name ${local.registry_name}",
    "docker pull ${local.registry_login_host}/${local.target_prefix}<image>:<tag>",
  ]) : null
}
