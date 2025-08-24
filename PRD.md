## Echo Integrations PRD — Standards, Alignment, and Work Plan

Version: 1.0
Owner: Echo Integrations
Status: Authoritative and active

This PRD is the single source of truth for how all Echo integrations (CloudFormation, Terraform, Pulumi) must be designed, named, documented, versioned, and shipped. Always refer to this PRD when working on any integration. The `echo-cloudformation-ecr-mirror` module is the canonical reference for minimalism and clarity.

### Goals
- Standardize all integrations around minimal inputs, consistent defaults, and clear outputs.
- Remove unnecessary resources and options; focus solely on enabling the Echo integration.
- Provide concise, copy-pasteable usage instructions in outputs and READMEs.
- Unify naming conventions across all stacks and providers.

### Non-goals
- Adding features that are not strictly required to apply the integration.
- Writing long-form documentation; keep all docs narrowly focused on getting integrated.

### Guiding principles (enforced)
1) ECR CloudFormation is the baseline for standard, minimalism, customizable names, concise outputs, and short/informative README.
2) Do not invent resources or parameters that do not directly serve applying the integration.
3) Documentation must be fluff-free and focused on getting the user integrated into Echo.
4) Naming conventions are aligned across all integrations: `echoRegistryAccountId`, `registryUrl`, `accessKeyName`/`accessKeyValue`, `cacheNamespace`/`mirrorProjectName`, and resource names like role/secret/policy. Use the same names wherever applicable.
5) All variables must have defaults except those that are inherently user-specific (e.g., access keys, account IDs like `echoRegistryAccountId`). Defaults should look and feel the same across modules. The cache namespace/prefix must default to `echo`.
6) Outputs must include IDs/ARNs of created resources (when applicable) and a generated `usageInstruction` string that shows how to pull from the newly created cache rule.
7) Update all integrations: focus on code minimalism, add high-level comments for maintainers (not end users), and ensure READMEs are streamlined and minimal. Pulumi components are installed via `pulumi package add`.
8) Since we export modules/component resources, never declare providers in modules. Only specify required versions. For Terraform this is standard; for Pulumi, depend on the provider/package and accept provider options via `opts` when relevant.

---

## Canonical baseline

`echo-cloudformation-ecr-mirror` is the reference implementation. Other integrations should match its:
- Minimal required inputs
- Ability to customize names
- Short, actionable outputs (including usage)
- Focused README with quickstart

---

## Technical standards

### Inputs and defaults (all modules)
- `create` (boolean, default `true`): When `false`, the module performs no resource creation and returns empty outputs. This is usually the pattern for terraform no need for pulumi.
- `resourcePrefix` (string, default `echo-mirror`): Prefix for resource names. Users may override.
- `cacheNamespace` (string, default `echo`): Namespace/prefix used by the cache rule. Use consistently in names/paths.
- `mirrorProjectName` (string, default `echo-mirror`): Logical project/group name to organize related resources.
- `name` (string, optional): Friendly resource name override. If omitted, derive from `mirrorProjectName` or `resourcePrefix`.

Provider-specific required inputs (only when applicable):
- `echoRegistryAccountId` (string, required for AWS ECR scenarios): Account ID of the Echo registry.
- `echoRegistryUrl` (string, required for non-AWS upstreams like GAR/Harbor/JFrog/Nexus): Base URL of the upstream registry.
- Credentials (only when the provider requires them):
  - `echoAccessKeyName` (string, default `ECHO_REGISTRY_ACCESS_KEY_ID`) and
  - `echoAccessKeyValue` (string, required when credentials are needed, no default)
  - If the provider requires JSON credentials, name the input `accessKeyJson` (required, no default)

Rules:
- Do not prompt for or accept inputs that are not strictly required to apply the integration.
- Prefer provider/environment defaults (e.g., AWS region via environment/provider config) over new inputs.

### Naming convention
- Default resource prefix: `echo-mirror`.
- Resource names: allow user override via `name`; otherwise use `{resourcePrefix}` or `{mirrorProjectName}`.
- Related resource names (only if created): `roleName`, `policyName`, `secretName` use `{resourcePrefix}` as base.
- Inputs use consistent names: `echoRegistryAccountId`, `registryUrl`, `cacheNamespace`, `mirrorProjectName`, `accessKeyName`, `accessKeyValue`.

### Outputs (all modules)
Every module must return:
- `id` (string): Primary identifier of the created resource (module-specific). For AWS also return `arn` when applicable.
- `mirrorUrl` (string): Pull URL for the mirror/cache.
- `usageInstruction` (string): A copy-paste line showing how to pull via the new mirror. Use the simplest possible form.
- Additional identifiers (when available): e.g., `cacheRuleId`, `cacheRuleArn`, etc.

Recommended `usageInstruction` pattern:
```
docker pull <mirrorUrl>/<cacheNamespace>/<image>:<tag>
```
If a provider requires a different syntax, return the closest equivalent minimal command.

### Documentation (README) requirements
Keep each README minimal and focused:
- Title and one-sentence purpose
- Quickstart (copy-paste example)
- Inputs (list required ones; defaults can be summarized)
- Outputs (list with brief meaning)
- Installation (Pulumi: `pulumi package add <pkg>`; Terraform: module source; CloudFormation: how to deploy the template)
- No background, marketing, or non-essential prose.

### CloudFormation
- Use parameters with sensible defaults; only required parameters are user/account-specific values (e.g., `echoRegistryAccountId`).
- Support customizable names via `resourcePrefix`/`name` parameters.
- Outputs must include identifiers and `usageInstruction`.
- Keep the template minimal; no extra resources.

### Terraform
- Do not declare `provider` blocks inside modules.
- Define `required_providers` in `versions.tf` and pin versions.
- Provide `variables.tf` with defaults as defined above.
- Provide `outputs.tf` including `id`/`arn` (when applicable), `mirrorUrl`, `usageInstruction`.
- Include a minimal `examples/basic` with copy-pasteable config.

### Pulumi
- Implement as a `ComponentResource` exporting a single class per package.
- Accept provider options through `opts?: pulumi.ComponentResourceOptions` when relevant; do not instantiate providers internally.
- Register outputs including `id`/`arn` (when applicable), `mirrorUrl`, `usageInstruction`.
- Publish packages to be installed with `pulumi package add` and document that in README.

---

## Standard inputs and outputs catalog

Inputs (only include those needed by the specific provider):
- `create`: boolean, default `true`.
- `resourcePrefix`: string, default `echo-mirror`.
- `cacheNamespace`: string, default `echo`.
- `mirrorProjectName`: string, default `echo-mirror`.
- `name`: string, optional. 
- `echoRegistryAccountId`: string, required for AWS ECR.
- `echoRegistryUrl`: string, required for GAR/Harbor/JFrog/Nexus.
- `echoAccessKeyName`: string, default `ECHO_REGISTRY_ACCESS_KEY_ID` (only if credentials needed).
- `echoAccessKeyValue`: string, required when credentials needed (no default).

Outputs:
- `id`: string (and `arn` for AWS when available).
- `mirrorUrl`: string.
- `usageInstruction`: string.
- Optional IDs/ARNs for sub-resources if the provider exposes them.

---

## README template (minimal)

```
# <TITLE>

Purpose: <one sentence>

Quickstart
----------
<copy-paste example>

Inputs
------
- <required input 1>
- <required input 2>

Defaults
--------
- resourcePrefix: echo-mirror
- cacheNamespace: echo

Outputs
-------
- id / arn
- mirrorUrl
- usageInstruction

Install
-------
- Pulumi: pulumi package add <pkg>
- Terraform: use the module source in examples/basic
- CloudFormation: deploy the provided template
```

---

## Acceptance criteria
- All modules expose the standardized inputs/outputs and honor defaults.
- All modules support `create=false` to no-op without side effects.
- All modules return a clear `usageInstruction` string.
- No module declares providers internally; versions are pinned/required only.
- READMEs are short, minimal, and actionable.
- ECR CloudFormation remains the canonical baseline; others match its spirit and structure.

---

## Work plan (tracked tasks)
1. Overwrite PRD with alignment guidelines, analysis, and work plan (this document).
2. Harden CloudFormation ECR template as the canonical reference.
3. Align Terraform ECR module to standards.
4. Align Terraform GAR module to standards.
5. Align Terraform Harbor module to standards.
6. Align Terraform JFrog module to standards.
7. Align Terraform Nexus module to standards.
8. Align Pulumi ECR package to standards.
9. Align Pulumi GAR package to standards.
10. Align Pulumi Harbor package to standards.
11. Align Pulumi JFrog package to standards.
12. Align Pulumi Nexus package to standards.
13. Normalize variable names/defaults across all modules.
14. Add standardized outputs and `usageInstruction` across modules.
15. Streamline and unify READMEs; remove fluff.
16. Ensure modules never declare providers; only require versions.
17. Add top-level `create` flag in each module.

---

## Risks & assumptions
- Provider-specific quirks may require slight deviations; prefer the closest minimal equivalent while preserving naming/outputs.
- Some providers may not return ARNs; return primary IDs consistently and include `arn` only when it exists.
- Credentials are input-only; modules do not create additional secret storage unless strictly necessary.

## Versioning & release
- Use SemVer. Breaking input/output changes require a major version. Standardization-only changes that do not break contract are minor.
