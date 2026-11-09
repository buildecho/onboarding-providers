# ECR pull-through cache: repository creation templates and KMS keys

This guide applies to both the
[Terraform module](../echo-terraform-ecr-mirror) and the
[Pulumi component](../echo-pulumi-ecr-mirror). Input names are given as
`terraform_name` / `pulumiName`.

## How cache repositories get their settings

The first time an image is pulled through the Echo pull-through cache (PTC)
rule, Amazon ECR creates a private repository such as `echo/<image>` in your
registry. ECR picks its settings like this:

1. If a **repository creation template** exists whose prefix matches the
   repository name, and whose `appliedFor` includes `PULL_THROUGH_CACHE`, ECR
   uses that template. The most specific prefix wins: `echo/team` beats `echo`.
2. Otherwise ECR uses its defaults: AES256 encryption, MUTABLE tags, and no
   repository or lifecycle policy.

AWS rules for templates:

- The template prefix must equal the PTC rule prefix (`cache_namespace` /
  `cacheNamespace`). ECR always adds a trailing `/`, so `echo` matches
  `echo/<anything>`, including nested paths such as `echo/library/<image>`.
- If the template uses **KMS encryption or resource tags**, it must set a
  repository creation role (`customRoleArn`). That role must trust
  `ecr.amazonaws.com`. Without the role, ECR can't create the repository, and
  the pull fails. Docker usually reports that failure as *"image doesn't exist"*
  or *"not found"*.
- A template only affects **repositories created after it exists**. ECR can't
  change a repository's encryption after the repository is created.
- The KMS key must be given as a **full key ARN** in the **same Region** as the
  registry. ECR templates don't accept aliases or bare key IDs.

The module/component manages one template for the cache namespace when you set
`create_repository_creation_template` / `createRepositoryCreationTemplate` to
`true`.

## Encryption options

| Scenario | Inputs |
|---|---|
| Default (AES256) | nothing, or just `create_repository_creation_template = true` to set lifecycle/policy/tags |
| Existing key, same account | `encryption_type = "KMS"`, `kms_key_arn = "arn:aws:kms:<region>:<this-account>:key/<id>"` |
| Module-created key | `encryption_type = "KMS"`, `create_kms_key = true` |
| Key owned by another account | `encryption_type = "KMS"`, `kms_key_arn = "arn:aws:kms:<region>:<other-account>:key/<id>"`, plus a key-policy change in the owner account ([see below](#cross-account-kms-key)) |

If you choose `KMS`, you must set exactly one of `kms_key_arn` and
`create_kms_key`. The modules don't support the AWS managed `aws/ecr` key, and
they reject `KMS_DSSE`, which only exists in GovCloud.

### The repository creation role

Whenever the template uses KMS or non-empty `repository_tags` /
`repositoryTags`, the module creates the role
`echo-ecr-repo-creation-role` (configurable). It has:

- **Trust:** `ecr.amazonaws.com`.
- **ECR permissions:** `ecr:CreateRepository` and `ecr:TagResource`, scoped to
  `arn:aws:ecr:<region>:<account>:repository/<cache_namespace>/*`. It also gets
  `ecr:PutLifecyclePolicy` / `ecr:SetRepositoryPolicy`, but only when you set a
  lifecycle or repository policy.
- **KMS permissions:** `kms:CreateGrant`, `kms:RetireGrant`, and
  `kms:DescribeKey`, scoped to the one key ARN. It gets these only when you use
  KMS.

`ecr:ReplicateImage` is left out because the template applies only to
`PULL_THROUGH_CACHE`. AWS's sample policy includes it because that sample
template also covers `REPLICATION`. If you reuse the role for a replication
template, add `ecr:ReplicateImage`.

To use your own role instead, pass `creation_role_arn` / `creationRoleArn`.
Your role needs the same trust and permissions.

The identity that runs Terraform or Pulumi needs `iam:PassRole` on the creation
role. It also needs `ecr:CreateRepositoryCreationTemplate`,
`ecr:UpdateRepositoryCreationTemplate`, `ecr:DescribeRepositoryCreationTemplates`,
and `ecr:DeleteRepositoryCreationTemplate`.

### Same-account key policy

When the module creates the key, the key policy already has the right
statements.

When you bring your own key from the same account, the module's IAM policy is
enough, **as long as the key policy delegates to IAM**. The default key policy
does this with its `"Enable IAM User Permissions"` statement, which grants
`kms:*` to `arn:aws:iam::<account>:root`. If your key policy doesn't delegate
to IAM, add the statement from the next section, with `<CONSUMER_ACCOUNT_ID>`
set to your own account.

## Cross-account KMS key

### What AWS supports

- AWS KMS lets principals in another account call `CreateGrant`,
  `DescribeKey`, `RetireGrant`, and the cryptographic operations on a key.
  Cross-account access is allowed only if **both** the key policy (in the key
  owner's account) and an IAM policy (in the caller's account) allow it. See
  [Allowing users in other accounts to use a KMS key](https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-modifying-external-accounts.html).
- The ECR creation-template API takes a full key ARN. The ARN pattern doesn't
  require the key to be in the registry's account; it requires only the same
  Region. See
  [EncryptionConfigurationForRepositoryCreationTemplate](https://docs.aws.amazon.com/AmazonECR/latest/APIReference/API_EncryptionConfigurationForRepositoryCreationTemplate.html).
- When ECR creates a KMS-encrypted repository, it calls `DescribeKey`. It then
  calls `CreateGrant` twice, so that the ECR service can run
  `GenerateDataKey` / `Decrypt` for pushes and pulls. When the repository is
  deleted, ECR calls `RetireGrant`. See
  [ECR encryption at rest](https://docs.aws.amazon.com/AmazonECR/latest/userguide/encryption-at-rest.html).
  Push and pull go through these grants. As a result, neither the key policy
  nor the IAM policies of people running `docker pull` need `kms:Decrypt` or
  `kms:GenerateDataKey`.

Not supported or not documented by AWS:

- The **key must be in the same Region** as the registry, in every case.
- **Aliases can't be used across accounts**. Use the key ARN.
- The **AWS managed key `aws/ecr`** can't be shared with another account.
- The ECR user guide doesn't show a cross-account customer managed key used with
  creation templates. The setup below follows the documented KMS cross-account
  rules and the permissions ECR documents for the creation role. **Validate it
  in a non-production account** before you roll it out.

### In the key-owner account

Add this statement to the key policy. Replace `<CONSUMER_ACCOUNT_ID>` with the
account that runs the pull-through cache. Replace the role name if you changed
`creation_role_name` / `creationRoleName`.

```json
{
  "Sid": "AllowEchoEcrRepositoryCreationRole",
  "Effect": "Allow",
  "Principal": { "AWS": "arn:aws:iam::<CONSUMER_ACCOUNT_ID>:root" },
  "Action": ["kms:CreateGrant", "kms:RetireGrant", "kms:DescribeKey"],
  "Resource": "*",
  "Condition": {
    "ArnEquals": {
      "aws:PrincipalArn": "arn:aws:iam::<CONSUMER_ACCOUNT_ID>:role/echo-ecr-repo-creation-role"
    }
  }
}
```

Why it's written this way:

- **The principal is the consumer account root, narrowed with
  `aws:PrincipalArn`.** KMS rejects a key policy that names an IAM role that
  doesn't exist yet. With this form, the key owner can apply the policy before
  the consumer deploys, and the policy keeps working if the role is recreated.
  Only the named role can use the key, and only if the consumer account's IAM
  also allows it, which the module does.
- **Only the three actions ECR needs.** Leave out `kms:Decrypt`,
  `kms:Encrypt`, `kms:GenerateDataKey*`, and `kms:ReEncrypt*`, because ECR
  uses its grants for data operations.
- **Optional hardening, `kms:ViaService`.** You can add
  `"StringEquals": { "kms:ViaService": "ecr.<region>.amazonaws.com" }`
  to the `Condition` so the key can only be used through ECR. AWS documents
  this condition for principals that create ECR repositories directly, but not
  specifically for the template's `customRoleArn` flow. Enable it in a test
  account first. If repository creation then fails with `AccessDenied` on
  `kms:CreateGrant`, remove the condition.
- **Grant constraints.** Don't add `kms:GrantOperations` or
  encryption-context grant constraints. AWS doesn't document the exact grant
  ECR creates, and over-constraining it breaks repository creation.
- **Never revoke the grants ECR creates.** Revoked grants make cached images
  unreadable. To remove access, delete the repository; ECR then retires the
  grants itself.

The key-owner side can also be automated.

- **Terraform:** in the owner account, use the
  [`modules/kms-key-owner`](../echo-terraform-ecr-mirror/modules/kms-key-owner)
  sub-module. It creates a key with this statement. If you already have a key,
  set `create_kms_key = false`; its `consumer_key_policy_statement` output then
  gives you the statement to merge into your existing key policy.
- **Pulumi:** in the owner account's stack, use the `EcrKmsKeyOwner` component,
  or call `buildEcrKmsKeyOwnerStatement()` to get the statement.

### In the consumer (pull-through cache) account

Set `create_repository_creation_template = true`, `encryption_type = "KMS"`,
and `kms_key_arn = <owner key ARN>`. The module creates the creation role and
its IAM policy with `kms:CreateGrant` / `kms:RetireGrant` / `kms:DescribeKey`
on that key. The `kms_key_is_cross_account` output confirms that the module
detected a key from another account.

The two sides can be applied in either order. Nothing is pulled until both are
in place.

## Adopting an existing template

If a creation template for the cache prefix already exists (for example, one
you created in the console), the create fails with
`TemplateAlreadyExistsException`. Import the existing template instead of
deleting it:

```bash
# Terraform
terraform import 'module.echo_ecr_cache.aws_ecr_repository_creation_template.this[0]' echo

# Pulumi: component named "echo-cache"; its template child is "echo-cache-creation-template".
# 1. Find the component URN:
pulumi stack --show-urns | grep 'EcrPullThroughCache::echo-cache'
# 2. Import the template as a child of the component:
pulumi import aws:ecr/repositoryCreationTemplate:RepositoryCreationTemplate \
  echo-cache-creation-template echo --parent "cache=<component URN>"
```

Then run `pulumi up` and check that the preview doesn't replace anything.

After the import, the module manages the template. Values you don't set are
reset to the module defaults on the next apply.

## Troubleshooting "image doesn't exist" and KMS errors

### Known failure mode: KMS (or tags) without a repository creation role

This was reproduced in a test account with the same setup the modules create:
an ECR-to-ECR pull-through cache from the Echo registry, using the rule's
`customRoleArn` role and no Secrets Manager credential. The test template had
the PTC prefix, `appliedFor = [PULL_THROUGH_CACHE]`, and a customer managed KMS
key.

| Template | Result |
|---|---|
| With `customRoleArn`: a role trusting `ecr.amazonaws.com` that has `ecr:CreateRepository` / `ecr:TagResource` and `kms:CreateGrant` / `kms:RetireGrant` / `kms:DescribeKey` on the key | The first pull and later cached pulls succeed. The repository is encrypted with the customer managed key. CloudTrail shows `CreateGrant` with grantee principal `ecr.<region>.amazonaws.com`. |
| Without `customRoleArn` | ECR creates the repository with the service-linked role `AWSServiceRoleForECRTemplate`. That `CreateRepository` fails with a `KmsException` on `kms:DescribeKey`. |
| Without `customRoleArn`, with `resourceTags` | The same call fails earlier, on `ecr:TagResource`. |

In both failure cases, `docker pull` only shows:

```text
name unknown: The repository with name '<cache_namespace>/<image>' does not exist in the registry with id '<account>'
```

Docker reports this as "repository ... does not exist" or "image doesn't exist",
even though the real error is the failed repository creation. The modules avoid
this failure: whenever the template uses KMS or tags, they always set
`customRoleArn`, either the module-created role or `creation_role_arn` /
`creationRoleArn`.

### Checklist

1. **Check the template.** Run
   `aws ecr describe-repository-creation-templates --prefixes echo`. Confirm
   that `appliedFor` contains `PULL_THROUGH_CACHE`, that `prefix` equals the PTC
   rule prefix exactly (no trailing `/`), and that `customRoleArn` is set when
   the template uses KMS or tags.
2. **Validate the rule.** Run
   `aws ecr validate-pull-through-cache-rule --ecr-repository-prefix echo`.
3. **Check CloudTrail in the PTC account**, in the registry's Region:
   - `ecr.amazonaws.com` `CreateRepository`. ECR calls it for you; look at its
     `errorCode` / `errorMessage`. If the caller is
     `AWSServiceRoleForECRTemplate` and the error is a `KmsException` on
     `kms:DescribeKey` or an `ecr:TagResource` denial, the template is missing
     `customRoleArn`. If the caller is your creation role, its permissions or
     the key policy are the problem.
   - `sts.amazonaws.com` `AssumeRole` of the creation role by
     `ecr.amazonaws.com`. If it fails, check the role's trust policy.
   - `kms.amazonaws.com` `DescribeKey` / `CreateGrant` with
     `AccessDeniedException`. If they fail, the key policy or the IAM policy is
     missing a permission, or the key is disabled or pending deletion.
4. **Cross-account keys:** KMS also logs `CreateGrant` / `DescribeKey` in the
   **key owner's** CloudTrail. If the event appears in the PTC account but is
   denied there, the IAM side is the problem. If it's denied in the owner
   account, the key policy is the problem.
5. **Existing repositories keep their old settings.** Repositories cached
   before the template existed, or before you changed it, keep their original
   encryption and settings. Check them with
   `aws ecr describe-repositories --repository-names echo/<image> --query 'repositories[].encryptionConfiguration'`.
   To pick up new settings, delete the cached repository with
   `aws ecr delete-repository --repository-name echo/<image> --force`. This
   deletes its cached images; the next pull recreates the repository and
   fetches the image from Echo again.
6. **Image paths.** Pull with the full cache path:
   `<account>.dkr.ecr.<region>.amazonaws.com/<cache_namespace>/<image>:<tag>`.
   Images whose upstream path has extra segments (for example, Docker Hub style
   `library/<image>`) end up under `<cache_namespace>/library/<image>`. They
   are still covered by the `<cache_namespace>` template unless a more specific
   template exists.
