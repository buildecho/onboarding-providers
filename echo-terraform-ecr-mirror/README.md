# Echo ECR Pull-Through Cache - Terraform Module

Purpose: Minimal ECR pull-through cache rule to integrate with the Echo registry,
with optional control over the repositories ECR creates for cached images
(encryption with your own KMS key, including cross-account keys, tag mutability,
lifecycle and repository policies, tags).

## Quickstart

```hcl
module "echo_ecr_cache" {
  source = "git@github.com:buildecho/onboarding-providers.git//echo-terraform-ecr-mirror"

  echo_registry_account_id = "123456789012"
  echo_registry_region     = "us-east-1" # default
  cache_namespace          = "echo"       # default
}
```

```bash
terraform init && terraform apply -auto-approve
```

## Requirements
- Terraform `>= 1.0`
- AWS provider `>= 6.0`
- Repository creation template inputs: module version `v2.1.0` or later

## Inputs

### Pull-through cache rule
- `create` (bool, default: `true`)
- `echo_registry_account_id` (string, required)
- `echo_registry_region` (string, default: `us-east-1`)
- `cache_namespace` (string, default: `echo`)
- `role_name` (string, default: `echo-ecr-mirror-role`)
- `policy_name` (string, default: `echo-ecr-mirror-policy`)
- `tags` (map(string), optional): tags on the IAM roles and KMS key created by the module

### Repository creation template (optional)
Every input below requires `create_repository_creation_template = true`. Without
it, ECR creates cache repositories with its defaults (AES256, MUTABLE tags, no
policies), exactly as before.

| Input | Default | Description |
|---|---|---|
| `create_repository_creation_template` | `false` | Manage a creation template with prefix = `cache_namespace` and `applied_for = ["PULL_THROUGH_CACHE"]` |
| `repository_creation_template_description` | `"Echo pull-through cache repositories (...)"` | Template description |
| `encryption_type` | `"AES256"` | `"AES256"` or `"KMS"` |
| `kms_key_arn` | `null` | Full ARN of an existing key in the same Region. The key can be in this account or another account |
| `create_kms_key` | `false` | Create a customer managed key in this account with a correct key policy |
| `kms_key_alias` | `"alias/echo-ecr-mirror"` | Alias for the created key (`null` = no alias) |
| `kms_key_deletion_window_in_days` | `30` | 7–30 |
| `kms_key_enable_key_rotation` | `true` | Yearly rotation for the created key |
| `creation_role_arn` | `null` | Bring your own repository creation role (`customRoleArn`) |
| `creation_role_name` | `"echo-ecr-repo-creation-role"` | Name of the role the module creates when one is required |
| `creation_policy_name` | `"echo-ecr-repo-creation-policy"` | Name of that role's inline policy |
| `image_tag_mutability` | `"MUTABLE"` | `"MUTABLE"` (recommended for pull-through cache) or `"IMMUTABLE"` |
| `lifecycle_policy` | `null` | Lifecycle policy JSON (`jsonencode({ rules = [...] })`) |
| `repository_policy` | `null` | Repository policy JSON |
| `repository_tags` | `{}` | Tags on the cache repositories that ECR creates |

The module validates these inputs at plan time. Errors about combinations of inputs
start with `echo-terraform-ecr-mirror input error:`. Examples:
- `encryption_type = "KMS"` without `kms_key_arn` or `create_kms_key`, or with both.
- A key ARN in a different Region, or an alias instead of an ARN.
- Template inputs set without `create_repository_creation_template = true`.
- Invalid JSON policies.

The module creates a repository creation role automatically when AWS requires one
(KMS or non-empty `repository_tags`) and `creation_role_arn` isn't set. The role's
permissions are scoped to the cache namespace repositories and to the single KMS
key.

## Outputs
- `role_arn`: ARN of the ECR access role
- `usage_instructions`: Usage instructions for pulling via the mirror
- `repository_creation_template_prefix`: template prefix, or `null`
- `repository_creation_role_arn`: role ECR uses to create cache repositories, or `null`
- `kms_key_arn`: key used for new cache repositories, or `null`
- `kms_key_is_cross_account`: `true` when `kms_key_arn` belongs to another account

## Examples
Runnable configurations live in [`examples/`](./examples):

| Example | What it shows |
|---|---|
| [`default`](./examples/default) | Rule only, ECR defaults (current behavior) |
| [`same-account-cmk`](./examples/same-account-cmk) | Existing key in this account, plus a lifecycle policy and repository tags |
| [`module-created-cmk`](./examples/module-created-cmk) | Module creates the key, alias, and role |
| [`cross-account-cmk`](./examples/cross-account-cmk) | Key owned by another account, using [`modules/kms-key-owner`](./modules/kms-key-owner) in the owner account |

Existing key in the same account:

```hcl
module "echo_ecr_cache" {
  source = "git@github.com:buildecho/onboarding-providers.git//echo-terraform-ecr-mirror?ref=v2.1.0"

  echo_registry_account_id            = "123456789012"
  create_repository_creation_template = true
  encryption_type                     = "KMS"
  kms_key_arn                         = "arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"
}
```

Cross-account key. Run the key-owner part with credentials for the account that
owns the key:

```hcl
module "echo_kms_key_owner" {
  source    = "git@github.com:buildecho/onboarding-providers.git//echo-terraform-ecr-mirror/modules/kms-key-owner?ref=v2.1.0"
  providers = { aws = aws.key_owner }

  consumer_account_id = "111122223333" # account running the pull-through cache
  # create_kms_key = false  # existing key: merge output.consumer_key_policy_statement into its policy
}
```

## KMS, cross-account keys, and troubleshooting
See [docs/ecr-pull-through-cache-kms.md](../docs/ecr-pull-through-cache-kms.md) for:
- How templates apply to cache repositories.
- The exact key-policy statement for a cross-account key (copy-paste JSON).
- What AWS does and doesn't support.
- How to adopt an existing template.
- Troubleshooting *"image doesn't exist"* errors, including which CloudTrail events to check.

## Upgrading from v2.0.0 / state impact
v2.1.0 is a minor release. It adds no required inputs, and the Terraform and AWS
provider requirements are unchanged (`>= 1.0` / `>= 6.0`). With the new inputs at
their defaults, `terraform plan` shows **no changes** for
existing deployments.

Enabling the template only **adds** resources: the template, plus the role and
policy, the key, and the alias when needed. Existing resources aren't replaced.

A template only applies to repositories created **after** it exists. Cache
repositories that already exist keep their current encryption.

## Test
```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region)
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
docker pull "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/<cache_namespace>/<image>:<tag>"
```

Module tests (no AWS credentials needed):
```bash
terraform init -backend=false && terraform test
(cd modules/kms-key-owner && terraform init -backend=false && terraform test)
```
