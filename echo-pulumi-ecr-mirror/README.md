# Echo ECR Pull-Through Cache - Pulumi Component

Purpose: Minimal Pulumi component to set up AWS ECR pull-through cache for Echo,
with optional control over the repositories ECR creates for cached images
(encryption with your own KMS key, including cross-account keys, tag mutability,
lifecycle and repository policies, tags).

## Install
```bash
pulumi package add github.com/buildecho/onboarding-providers/echo-pulumi-ecr-mirror
# repository creation template inputs need v2.1.0 or later:
pulumi package add github.com/buildecho/onboarding-providers/echo-pulumi-ecr-mirror@v2.1.0
```

## Usage
```ts
import { EcrPullThroughCache } from "@buildecho/echo-pulumi-ecr-mirror";

const cache = new EcrPullThroughCache("echo-cache", {
  echoRegistryAccountId: "123456789012",
  echoRegistryRegion: "us-east-1", // default
  cacheNamespace: "echo",          // default
});

export const roleArn = cache.roleArn;
export const usage = cache.usageInstructions;
```

Existing KMS key (same account or another account, same Region):

```ts
const cache = new EcrPullThroughCache("echo-cache", {
  echoRegistryAccountId: "123456789012",
  createRepositoryCreationTemplate: true,
  encryptionType: "KMS",
  kmsKeyArn: "arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab",
});
```

## Inputs

### Pull-through cache rule
- `echoRegistryAccountId` (string, required)
- `echoRegistryRegion` (string, default: `us-east-1`)
- `cacheNamespace` (string, default: `echo`)
- `roleName` (string, default: `echo-ecr-mirror-role`)
- `policyName` (string, default: `echo-ecr-mirror-policy`)
- `tags` (Record<string, string>, optional): tags on the IAM roles and KMS key created by the component

### Repository creation template (optional)
Every input below requires `createRepositoryCreationTemplate: true`. Without it,
ECR creates cache repositories with its defaults (AES256, MUTABLE tags, no
policies), exactly as before. Each input has the same meaning as its
`snake_case` counterpart in the Terraform module.

| Input | Default | Description |
|---|---|---|
| `createRepositoryCreationTemplate` | `false` | Manage a creation template with prefix = `cacheNamespace` and `appliedFor: ["PULL_THROUGH_CACHE"]` |
| `repositoryCreationTemplateDescription` | `"Echo pull-through cache repositories (...)"` | Template description |
| `encryptionType` | `"AES256"` | `"AES256"` or `"KMS"` |
| `kmsKeyArn` | — | Full ARN of an existing key in the same Region. The key can be in this account or another account |
| `createKmsKey` | `false` | Create a customer managed key in this account with a correct key policy |
| `kmsKeyAlias` | `"alias/echo-ecr-mirror"` | Alias for the created key (`""` = no alias) |
| `kmsKeyDeletionWindowInDays` | `30` | 7–30 |
| `kmsKeyEnableKeyRotation` | `true` | Yearly rotation for the created key |
| `creationRoleArn` | — | Bring your own repository creation role (`customRoleArn`) |
| `creationRoleName` | `"echo-ecr-repo-creation-role"` | Name of the role the component creates when one is required |
| `creationPolicyName` | `"echo-ecr-repo-creation-policy"` | Name of that role's inline policy |
| `imageTagMutability` | `"MUTABLE"` | `"MUTABLE"` (recommended for pull-through cache) or `"IMMUTABLE"` |
| `lifecyclePolicy` | — | Lifecycle policy JSON (`JSON.stringify({ rules: [...] })`) |
| `repositoryPolicy` | — | Repository policy JSON |
| `repositoryTags` | `{}` | Tags on the cache repositories that ECR creates |

The component checks input combinations when you construct it. It throws an
error that starts with `EcrPullThroughCache:` in cases such as:
- `encryptionType: "KMS"` without `kmsKeyArn` or `createKmsKey`, or with both.
- Template inputs without `createRepositoryCreationTemplate: true`.

It checks key ARNs (full ARN, same Region) and policy JSON during preview, once
their values are known.

The component creates a repository creation role automatically when AWS requires
one (KMS or non-empty `repositoryTags`) and `creationRoleArn` isn't set. The role's
permissions are scoped to the cache namespace repositories and to the single KMS
key.

## Outputs
- `roleArn`: ARN of the IAM role created for pull-through cache
- `cacheNamespace`: Cache namespace used
- `usageInstructions`: Usage instructions for pulling via the mirror
- `repositoryCreationTemplatePrefix`: template prefix, or undefined
- `repositoryCreationRoleArn`: role ECR uses to create cache repositories, or undefined
- `kmsKeyArn`: key used for new cache repositories, or undefined
- `kmsKeyIsCrossAccount`: `true` when `kmsKeyArn` belongs to another account

## Cross-account key: `EcrKmsKeyOwner`
Deploy `EcrKmsKeyOwner` with a provider for the account that **owns** the key.
It creates a key whose policy allows the consumer's repository creation role
(`kms:CreateGrant`, `kms:RetireGrant`, `kms:DescribeKey`).

```ts
import * as aws from "@pulumi/aws";
import { EcrKmsKeyOwner, EcrPullThroughCache } from "@buildecho/echo-pulumi-ecr-mirror";

const keyOwnerProvider = new aws.Provider("key-owner", { region: "us-east-1", profile: "security" });

const owner = new EcrKmsKeyOwner("echo-kms", {
  consumerAccountId: "111122223333",        // account running the pull-through cache
  // createKmsKey: false,                    // existing key: merge owner.consumerKeyPolicyStatement into its policy
}, { providers: { aws: keyOwnerProvider } });

const cache = new EcrPullThroughCache("echo-cache", {
  echoRegistryAccountId: "123456789012",
  createRepositoryCreationTemplate: true,
  encryptionType: "KMS",
  kmsKeyArn: owner.kmsKeyArn.apply(arn => arn!),
});
```

`EcrKmsKeyOwner` inputs: `consumerAccountId` (required),
`consumerCreationRoleName` (default `"echo-ecr-repo-creation-role"`),
`createKmsKey` (default `true`), `requireEcrViaService` (default `false`),
`kmsKeyAlias`, `kmsKeyDeletionWindowInDays`, `kmsKeyEnableKeyRotation`, `tags`.

Outputs: `kmsKeyArn`, `consumerKeyPolicyStatement`, `keyPolicy`,
`consumerCreationRoleArn`.

To render the statement without creating anything, call
`buildEcrKmsKeyOwnerStatement({ consumerAccountId, region })`.

## Examples
Runnable Pulumi projects live in [`examples/`](./examples): `default`,
`same-account-cmk`, `module-created-cmk`, and `cross-account-cmk`. Each one
reads its account-specific values from stack config. Each one derives role,
policy, and alias names from `cacheNamespace`, whose default is unique per
example, so you can deploy several examples in the same account. In each
example directory:

```bash
npm install --prefix ../..     # once, installs the component's dependencies
pulumi stack init test
pulumi config set aws:region us-east-1
pulumi config set echoRegistryAccountId <echo registry account id>
# same-account-cmk: pulumi config set kmsKeyArn arn:aws:kms:us-east-1:<account>:key/<id>
# cross-account-cmk: pulumi config set aws:profile <consumer profile>; pulumi config set keyOwnerProfile <owner profile>
pulumi preview && pulumi up
```

## KMS, cross-account keys, and troubleshooting
See [docs/ecr-pull-through-cache-kms.md](../docs/ecr-pull-through-cache-kms.md) for:
- How templates apply to cache repositories.
- The exact key-policy statement for a cross-account key.
- What AWS does and doesn't support.
- How to adopt an existing template (`pulumi import`).
- Troubleshooting *"image doesn't exist"* errors.

## Upgrading from v2.0.0
v2.1.0 is a minor release. It adds no required inputs, and the `@pulumi/aws` (`^6`)
dependency is unchanged. Existing stacks preview with **no changes** while the new
inputs are unset. Enabling the template only **adds** resources. A template only
applies to repositories created after it exists; existing cache repositories keep
their encryption.

## Test
```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region)
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
docker pull "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/echo/<image>:<tag>"
```

Component tests (no AWS credentials needed):
```bash
npm ci && npm run typecheck && npm test
```
