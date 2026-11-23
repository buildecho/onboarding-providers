output "kms_key_arn" {
  description = "ARN of the created key. Pass it as kms_key_arn to the echo-terraform-ecr-mirror module in the consumer account."
  value       = one(aws_kms_key.this[*].arn)
}

output "consumer_key_policy_statement" {
  description = "JSON of the single key policy statement to merge into an EXISTING key's policy (use with create_kms_key = false)."
  value       = jsonencode(local.consumer_statement)
}

output "key_policy" {
  description = "JSON of the full key policy (owner-account root + consumer statement)."
  value       = jsonencode(local.key_policy)
}

output "consumer_creation_role_arn" {
  description = "Consumer role ARN the key policy allows."
  value       = local.consumer_arn
}
