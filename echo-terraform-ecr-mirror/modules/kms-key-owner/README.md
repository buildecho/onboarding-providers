# kms-key-owner

Run this sub-module in the account that **owns** the KMS key. It lets an Echo
ECR pull-through cache in another account (the consumer) encrypt its cache
repositories with that key.

The key policy allows `kms:CreateGrant`, `kms:RetireGrant`, and `kms:DescribeKey`
for exactly one role: the consumer's repository creation role
(`arn:aws:iam::<consumer_account_id>:role/<consumer_creation_role_name>`).

The policy names the consumer account root and narrows it with an
`aws:PrincipalArn` condition. Because of that, the policy can be applied before
the consumer role exists.

```hcl
module "echo_kms_key_owner" {
  source = "git@github.com:buildecho/onboarding-providers.git//echo-terraform-ecr-mirror/modules/kms-key-owner"

  consumer_account_id = "111122223333"
}

# Consumer account:
#   encryption_type = "KMS"
#   kms_key_arn     = module.echo_kms_key_owner.kms_key_arn
```

To use an **existing key**, set `create_kms_key = false`. Then merge
`consumer_key_policy_statement` into the key's current policy. The module never
modifies an existing key policy.

| Input | Default | Description |
|---|---|---|
| `consumer_account_id` | required | Account running the pull-through cache |
| `consumer_creation_role_name` | `"echo-ecr-repo-creation-role"` | Must match `creation_role_name` in the consumer module |
| `create_kms_key` | `true` | Create a key, or only render the statement |
| `require_ecr_via_service` | `false` | Add a `kms:ViaService = ecr.<region>.amazonaws.com` condition. Optional hardening; test it first |
| `kms_key_alias` | `"alias/echo-ecr-mirror"` | `null` = no alias |
| `kms_key_deletion_window_in_days` | `30` | 7–30 |
| `kms_key_enable_key_rotation` | `true` | |
| `tags` | `{}` | |

| Output | Description |
|---|---|
| `kms_key_arn` | Created key ARN (pass it to the consumer as `kms_key_arn`) |
| `consumer_key_policy_statement` | Statement JSON to merge into an existing key policy |
| `key_policy` | Full key policy JSON |
| `consumer_creation_role_arn` | Role ARN the policy allows |

The key must be in the same Region as the consumer's ECR registry. See
[docs/ecr-pull-through-cache-kms.md](../../../docs/ecr-pull-through-cache-kms.md)
for the full cross-account guide.
