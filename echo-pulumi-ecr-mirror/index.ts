import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const KMS_KEY_ARN_PATTERN = /^arn:aws[a-z0-9-]*:kms:[a-z0-9-]+:[0-9]{12}:key\/[a-zA-Z0-9-]+$/;
const ROLE_ARN_PATTERN = /^arn:aws[a-z0-9-]*:iam::[0-9]{12}:role\/.+$/;
const KMS_ALIAS_PATTERN = /^alias\/[a-zA-Z0-9/_-]+$/;

const DEFAULT_CREATION_ROLE_NAME = "echo-ecr-repo-creation-role";
const DEFAULT_CREATION_POLICY_NAME = "echo-ecr-repo-creation-policy";
const DEFAULT_KMS_KEY_ALIAS = "alias/echo-ecr-mirror";
const DEFAULT_TEMPLATE_DESCRIPTION = "Echo pull-through cache repositories (managed by echo-pulumi-ecr-mirror)";

/**
 * Configuration options for the Echo ECR Pull-Through Cache
 */
export interface EcrPullThroughCacheInput {
    /**
     * The AWS account ID of the source ECR registry (Echo registry)
     */
    echoRegistryAccountId: pulumi.Input<string>;
    
    /**
     * The AWS region of the source ECR registry (Echo registry)
     * @default "us-east-1"
     */
    echoRegistryRegion?: pulumi.Input<string>;
    
    /**
     * Namespace/prefix for cached repositories in your ECR
     * @default "echo"
     */
    cacheNamespace?: pulumi.Input<string>;
    
    /**
     * Name for the IAM role that will be created.
     * @default "echo-ecr-mirror-role"
     */
    roleName?:pulumi.Input<string>;

    /**
     * Name for the IAM policy that will be created.
     * @default "echo-ecr-mirror-policy"
     */
    policyName?:pulumi.Input<string>;
    
    /**
     * Additional tags to apply to created resources (IAM roles, KMS key)
     */
    tags?: Record<string, string>;

    /**
     * Manage an ECR repository creation template for the cache namespace
     * (prefix = cacheNamespace, appliedFor = PULL_THROUGH_CACHE). Required for every
     * other repository-template input below. When false, ECR creates cache repositories
     * with its defaults: AES256 encryption, MUTABLE tags, no policies.
     * @default false
     */
    createRepositoryCreationTemplate?: boolean;

    /**
     * Description of the repository creation template (max 256 characters).
     */
    repositoryCreationTemplateDescription?: string;

    /**
     * Encryption for new cache repositories: "AES256" or "KMS". With "KMS", set exactly
     * one of `kmsKeyArn` or `createKmsKey: true`.
     * @default "AES256"
     */
    encryptionType?: string;

    /**
     * Full ARN of an existing customer managed KMS key (same Region as this registry;
     * may be owned by this or another AWS account). Aliases and key IDs are not accepted.
     */
    kmsKeyArn?: pulumi.Input<string>;

    /**
     * Create a customer managed KMS key in this account, with a key policy that allows
     * the repository creation role. Requires encryptionType "KMS".
     * @default false
     */
    createKmsKey?: boolean;

    /**
     * Alias for the key created with createKmsKey. Set to "" to skip the alias.
     * @default "alias/echo-ecr-mirror"
     */
    kmsKeyAlias?: string;

    /**
     * Waiting period (7-30 days) before the created key is deleted after scheduling.
     * @default 30
     */
    kmsKeyDeletionWindowInDays?: number;

    /**
     * Enable automatic yearly rotation for the created key.
     * @default true
     */
    kmsKeyEnableKeyRotation?: boolean;

    /**
     * Existing IAM role ECR assumes to create cache repositories (template customRoleArn).
     * When omitted, a least-privilege role is created whenever required (KMS or
     * non-empty repositoryTags).
     */
    creationRoleArn?: pulumi.Input<string>;

    /**
     * Name of the repository creation role created by the component.
     * @default "echo-ecr-repo-creation-role"
     */
    creationRoleName?: string;

    /**
     * Name of the inline policy on the created repository creation role.
     * @default "echo-ecr-repo-creation-policy"
     */
    creationPolicyName?: string;

    /**
     * Tag mutability for new cache repositories. MUTABLE is recommended for
     * pull-through cache so ECR can refresh cached tags.
     * @default "MUTABLE"
     */
    imageTagMutability?: string;

    /**
     * ECR lifecycle policy JSON applied to new cache repositories.
     */
    lifecyclePolicy?: pulumi.Input<string>;

    /**
     * ECR repository policy JSON applied to new cache repositories.
     */
    repositoryPolicy?: pulumi.Input<string>;

    /**
     * Tags applied to new cache repositories. Non-empty tags require a repository
     * creation role (created automatically unless creationRoleArn is set).
     */
    repositoryTags?: Record<string, string>;
}

/**
 * Outputs from the ECR Pull-Through Cache component
 */
export interface EcrPullThroughCacheOutputs {
    /**
     * ARN of the IAM role created for pull-through cache
     */
    roleArn: pulumi.Output<string>;

    /**
     * Usage instructions for pulling via the mirror
     */
    usageInstructions: pulumi.Output<string>;
}

function fail(message: string): never {
    throw new Error(`EcrPullThroughCache: ${message}`);
}

function assertJson(value: string, input: string): void {
    try {
        JSON.parse(value);
    } catch {
        fail(`${input} must be a valid JSON document. Tip: build it with JSON.stringify({...}).`);
    }
}

function validateInput(args: EcrPullThroughCacheInput): void {
    const encryptionType = args.encryptionType ?? "AES256";
    const useKms = encryptionType === "KMS";
    const hasKeyArn = args.kmsKeyArn !== undefined;
    const createKmsKey = args.createKmsKey ?? false;

    if (!["AES256", "KMS"].includes(encryptionType)) {
        fail(`encryptionType must be "AES256" or "KMS" (got "${encryptionType}"). KMS_DSSE is only available in AWS GovCloud, where the Echo registry cannot be used as an upstream.`);
    }

    const templateOptionsSet =
        encryptionType !== "AES256" || hasKeyArn || createKmsKey ||
        args.creationRoleArn !== undefined ||
        (args.imageTagMutability ?? "MUTABLE") !== "MUTABLE" ||
        args.lifecyclePolicy !== undefined || args.repositoryPolicy !== undefined ||
        Object.keys(args.repositoryTags ?? {}).length > 0;
    if (!args.createRepositoryCreationTemplate && templateOptionsSet) {
        fail("repository creation template inputs (encryptionType, kmsKeyArn, createKmsKey, creationRoleArn, imageTagMutability, lifecyclePolicy, repositoryPolicy, repositoryTags) only take effect with createRepositoryCreationTemplate: true. Set it, or remove those inputs.");
    }

    if (useKms && hasKeyArn === createKmsKey) {
        fail('encryptionType "KMS" requires exactly one of: kmsKeyArn: "arn:aws:kms:<region>:<account>:key/<id>" (existing key, same or other account), or createKmsKey: true (component creates a key in this account).');
    }
    if (!useKms && (hasKeyArn || createKmsKey)) {
        fail('kmsKeyArn / createKmsKey are only used with encryptionType "KMS". Set encryptionType: "KMS" or remove them.');
    }

    if (!["MUTABLE", "IMMUTABLE"].includes(args.imageTagMutability ?? "MUTABLE")) {
        fail(`imageTagMutability must be "MUTABLE" or "IMMUTABLE" (got "${args.imageTagMutability}").`);
    }

    const description = args.repositoryCreationTemplateDescription ?? DEFAULT_TEMPLATE_DESCRIPTION;
    if (description.length > 256) {
        fail("repositoryCreationTemplateDescription must be at most 256 characters.");
    }

    const alias = args.kmsKeyAlias ?? DEFAULT_KMS_KEY_ALIAS;
    if (alias !== "" && (!KMS_ALIAS_PATTERN.test(alias) || alias.startsWith("alias/aws/"))) {
        fail('kmsKeyAlias must start with "alias/", contain only letters, numbers, /, _ and -, and must not start with "alias/aws/". Use "" to skip the alias.');
    }

    const window = args.kmsKeyDeletionWindowInDays ?? 30;
    if (!Number.isInteger(window) || window < 7 || window > 30) {
        fail("kmsKeyDeletionWindowInDays must be an integer between 7 and 30.");
    }
}

/**
 * Validates that `arn` is a full KMS key ARN in `registryRegion` and returns it.
 */
export function validateKmsKeyArn(arn: string, registryRegion: string): string {
    if (!KMS_KEY_ARN_PATTERN.test(arn)) {
        fail(`kmsKeyArn must be a full KMS key ARN, e.g. arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab (got "${arn}"). Aliases and bare key IDs are not supported by ECR repository creation templates.`);
    }
    const keyRegion = arn.split(":")[3];
    if (keyRegion !== registryRegion) {
        fail(`kmsKeyArn is in Region ${keyRegion} but this ECR registry is in ${registryRegion}. ECR requires the KMS key to be in the same Region as the repositories (it may be in a different account).`);
    }
    return arn;
}

/**
 * Builds the key policy statement the KMS key owner must add so that the Echo
 * repository creation role in `consumerAccountId` can use the key. The principal is
 * the consumer account root narrowed by aws:PrincipalArn, so the statement is valid
 * before the consumer role exists.
 */
export function buildEcrKmsKeyOwnerStatement(params: {
    consumerAccountId: string;
    consumerCreationRoleName?: string;
    partition?: string;
    region?: string;
    requireEcrViaService?: boolean;
}): Record<string, unknown> {
    if (!/^[0-9]{12}$/.test(params.consumerAccountId)) {
        throw new Error(`EcrKmsKeyOwner: consumerAccountId must be a 12-digit AWS account ID (got "${params.consumerAccountId}").`);
    }
    const partition = params.partition ?? "aws";
    const roleName = params.consumerCreationRoleName ?? DEFAULT_CREATION_ROLE_NAME;
    const condition: Record<string, unknown> = {
        ArnEquals: { "aws:PrincipalArn": `arn:${partition}:iam::${params.consumerAccountId}:role/${roleName}` },
    };
    if (params.requireEcrViaService) {
        if (!params.region) {
            throw new Error("buildEcrKmsKeyOwnerStatement: region is required when requireEcrViaService is true.");
        }
        condition.StringEquals = { "kms:ViaService": `ecr.${params.region}.amazonaws.com` };
    }
    return {
        Sid: `AllowEchoEcrRepositoryCreationRole${params.consumerAccountId}`,
        Effect: "Allow",
        Principal: { AWS: `arn:${partition}:iam::${params.consumerAccountId}:root` },
        Action: ["kms:CreateGrant", "kms:RetireGrant", "kms:DescribeKey"],
        Resource: "*",
        Condition: condition,
    };
}

/**
 * Echo ECR Pull-Through Cache Component
 * 
 * This component sets up an ECR pull-through cache to integrate with Echo's registry,
 * allowing you to cache Echo images locally in your AWS account.
 * 
 * @example
 * ```typescript
 * import { EcrPullThroughCache } from "@buildecho/echo-pulumi-ecr-mirror";
 * 
 * const cache = new EcrPullThroughCache("echo-cache", {
 *     echoRegistryAccountId: "123456789012",
 *     echoRegistryRegion: "us-east-1",
 *     cacheNamespace: "echo"
 * });
 * 
 * export const usage = cache.usageInstructions;
 * ```
 */
export class EcrPullThroughCache extends pulumi.ComponentResource {
    public readonly cacheNamespace: pulumi.Output<string>;
    public readonly roleArn: pulumi.Output<string>;
    public readonly usageInstructions: pulumi.Output<string>;
    /** Prefix of the managed repository creation template, if any. */
    public readonly repositoryCreationTemplatePrefix: pulumi.Output<string | undefined>;
    /** Role ECR assumes to create cache repositories (created or supplied), if required. */
    public readonly repositoryCreationRoleArn: pulumi.Output<string | undefined>;
    /** KMS key used for new cache repositories, if encryptionType is "KMS". */
    public readonly kmsKeyArn: pulumi.Output<string | undefined>;
    /** True when kmsKeyArn is owned by another AWS account (key owner must update its key policy). */
    public readonly kmsKeyIsCrossAccount: pulumi.Output<boolean>;
    
    constructor(name: string, args: EcrPullThroughCacheInput,opts?: pulumi.ComponentResourceOptions) {
        super("echo-pulumi-ecr-mirror:index:EcrPullThroughCache", name, args, opts);

        validateInput(args);
        
        // Set defaults
        const echoRegistryRegion = args.echoRegistryRegion || "us-east-1";
        const cacheNamespace = args.cacheNamespace || "echo";
        const roleName = args.roleName || "echo-ecr-mirror-role"
        const policyName = args.policyName || "echo-ecr-mirror-policy"
        
        const tags = { ...args.tags };
        
        // Get current AWS environment
        const current = aws.getCallerIdentity({}, { parent: this });
        const currentRegion = aws.getRegion({}, { parent: this });
        
        // Create IAM role for ECR pull-through cache
        const ecrPullThroughCacheRole = new aws.iam.Role(`${name}-${roleName}`, {
            name: roleName,
            description: "Allows ECR to pull images from Echo's registry",
            assumeRolePolicy: JSON.stringify({
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Principal: {
                            Service: "pullthroughcache.ecr.amazonaws.com"
                        },
                        Action: "sts:AssumeRole"
                    }
                ]
            }),
            tags: tags
        }, { parent: this });
        
        // Attach policy to allow pulling from Echo's registry
        const ecrPullPolicy = new aws.iam.RolePolicy(`${name}-${policyName}`, {
            name: policyName,
            role: ecrPullThroughCacheRole.id,
            policy: JSON.stringify({
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Action: [
                            "ecr:GetAuthorizationToken",
                            "ecr:BatchCheckLayerAvailability",
                            "ecr:GetDownloadUrlForLayer",
                            "ecr:BatchGetImage",
                            "ecr:BatchImportUpstreamImage",
                            "ecr:GetImageCopyStatus",
                            "ecr:InitiateLayerUpload",
                            "ecr:UploadLayerPart",
                            "ecr:CompleteLayerUpload",
                            "ecr:PutImage"
                        ],
                        Resource: "*"
                    }
                ]
            })
        }, { parent: this });
        
        // Create the pull-through cache rule
        const cacheRule = new aws.ecr.PullThroughCacheRule(`${name}-rule`, {
            ecrRepositoryPrefix: cacheNamespace,
            upstreamRegistryUrl: `${args.echoRegistryAccountId}.dkr.ecr.${echoRegistryRegion}.amazonaws.com`,
            customRoleArn: ecrPullThroughCacheRole.arn
        }, { parent: this, dependsOn: [ecrPullThroughCacheRole, ecrPullPolicy] });

        const template = args.createRepositoryCreationTemplate
            ? this.createRepositoryCreationTemplate(name, args, pulumi.output(cacheNamespace), tags, current, currentRegion)
            : undefined;
        
        // Set outputs
        this.cacheNamespace = pulumi.output(cacheNamespace);
        this.roleArn = ecrPullThroughCacheRole.arn;
        this.usageInstructions = pulumi.all([current, currentRegion, pulumi.output(cacheNamespace)]).apply(([account, region, ns]) => `docker pull ${account.accountId}.dkr.ecr.${region.name}.amazonaws.com/${ns}/<image>:<tag>`);
        this.repositoryCreationTemplatePrefix = template ? template.prefix : pulumi.output<string | undefined>(undefined);
        this.repositoryCreationRoleArn = template ? template.creationRoleArn : pulumi.output<string | undefined>(undefined);
        this.kmsKeyArn = template ? template.kmsKeyArn : pulumi.output<string | undefined>(undefined);
        this.kmsKeyIsCrossAccount = pulumi.all([this.kmsKeyArn, current]).apply(([arn, account]) =>
            arn !== undefined && arn.split(":")[4] !== account.accountId);
        
        // Register outputs
        this.registerOutputs({
            cacheNamespace: this.cacheNamespace,
            roleArn: this.roleArn,
            usageInstructions: this.usageInstructions,
            repositoryCreationTemplatePrefix: this.repositoryCreationTemplatePrefix,
            repositoryCreationRoleArn: this.repositoryCreationRoleArn,
            kmsKeyArn: this.kmsKeyArn,
            kmsKeyIsCrossAccount: this.kmsKeyIsCrossAccount,
        });
    }

    private createRepositoryCreationTemplate(
        name: string,
        args: EcrPullThroughCacheInput,
        cacheNamespace: pulumi.Output<string>,
        tags: Record<string, string>,
        current: Promise<aws.GetCallerIdentityResult>,
        currentRegion: Promise<aws.GetRegionResult>,
    ) {
        const encryptionType = args.encryptionType ?? "AES256";
        const useKms = encryptionType === "KMS";
        const repositoryTags = args.repositoryTags ?? {};
        const hasRepositoryTags = Object.keys(repositoryTags).length > 0;
        const needsCreationRole = useKms || hasRepositoryTags;
        const createCreationRole = needsCreationRole && args.creationRoleArn === undefined;
        const creationRoleName = args.creationRoleName ?? DEFAULT_CREATION_ROLE_NAME;
        const creationPolicyName = args.creationPolicyName ?? DEFAULT_CREATION_POLICY_NAME;
        const kmsKeyAlias = args.kmsKeyAlias ?? DEFAULT_KMS_KEY_ALIAS;

        const partition = aws.getPartition({}, { parent: this });
        const accountId = pulumi.output(current).accountId;
        const region = pulumi.output(currentRegion).name;
        const partitionName = pulumi.output(partition).partition;

        const jsonInput = (value: pulumi.Input<string> | undefined, input: string) => value === undefined
            ? undefined
            : pulumi.output(value).apply(v => { assertJson(v, input); return v; });
        const lifecyclePolicy = jsonInput(args.lifecyclePolicy, "lifecyclePolicy");
        const repositoryPolicy = jsonInput(args.repositoryPolicy, "repositoryPolicy");

        const creationRoleArn: pulumi.Output<string> | undefined = !needsCreationRole
            ? undefined
            : createCreationRole
                ? pulumi.interpolate`arn:${partitionName}:iam::${accountId}:role/${creationRoleName}`
                : pulumi.output(args.creationRoleArn!).apply(arn => {
                    if (!ROLE_ARN_PATTERN.test(arn)) {
                        fail(`creationRoleArn must be a full IAM role ARN, e.g. arn:aws:iam::111122223333:role/my-ecr-creation-role (got "${arn}").`);
                    }
                    return arn;
                });

        let kmsKeyArn: pulumi.Output<string> | undefined;
        if (useKms && args.createKmsKey) {
            const key = new aws.kms.Key(`${name}-kms-key`, {
                description: pulumi.interpolate`Encrypts Echo pull-through cache repositories under ${cacheNamespace}/`,
                deletionWindowInDays: args.kmsKeyDeletionWindowInDays ?? 30,
                enableKeyRotation: args.kmsKeyEnableKeyRotation ?? true,
                policy: pulumi.all([partitionName, accountId, creationRoleArn!]).apply(([p, acct, roleArn]) => JSON.stringify({
                    Version: "2012-10-17",
                    Statement: [
                        {
                            Sid: "EnableIAMUserPermissions",
                            Effect: "Allow",
                            Principal: { AWS: `arn:${p}:iam::${acct}:root` },
                            Action: "kms:*",
                            Resource: "*",
                        },
                        {
                            Sid: "AllowEcrRepositoryCreationRole",
                            Effect: "Allow",
                            Principal: { AWS: `arn:${p}:iam::${acct}:root` },
                            Action: ["kms:CreateGrant", "kms:RetireGrant", "kms:DescribeKey"],
                            Resource: "*",
                            Condition: { ArnEquals: { "aws:PrincipalArn": roleArn } },
                        },
                    ],
                })),
                tags,
            }, { parent: this });
            if (kmsKeyAlias !== "") {
                new aws.kms.Alias(`${name}-kms-alias`, {
                    name: kmsKeyAlias,
                    targetKeyId: key.keyId,
                }, { parent: this });
            }
            kmsKeyArn = key.arn;
        } else if (useKms) {
            kmsKeyArn = pulumi.all([pulumi.output(args.kmsKeyArn!), region]).apply(([arn, r]) => validateKmsKeyArn(arn, r));
        }

        let creationPolicy: aws.iam.RolePolicy | undefined;
        if (createCreationRole) {
            const role = new aws.iam.Role(`${name}-${creationRoleName}`, {
                name: creationRoleName,
                description: pulumi.interpolate`Assumed by Amazon ECR to create Echo pull-through cache repositories under ${cacheNamespace}/`,
                assumeRolePolicy: JSON.stringify({
                    Version: "2012-10-17",
                    Statement: [
                        {
                            Effect: "Allow",
                            Principal: { Service: "ecr.amazonaws.com" },
                            Action: "sts:AssumeRole",
                        },
                    ],
                }),
                tags,
            }, { parent: this });

            const ecrActions = [
                "ecr:CreateRepository",
                "ecr:TagResource",
                ...(args.lifecyclePolicy !== undefined ? ["ecr:PutLifecyclePolicy"] : []),
                ...(args.repositoryPolicy !== undefined ? ["ecr:SetRepositoryPolicy"] : []),
            ];
            creationPolicy = new aws.iam.RolePolicy(`${name}-${creationPolicyName}`, {
                name: creationPolicyName,
                role: role.id,
                policy: pulumi.all([partitionName, region, accountId, cacheNamespace, kmsKeyArn ?? pulumi.output("")])
                    .apply(([p, r, acct, ns, keyArn]) => JSON.stringify({
                        Version: "2012-10-17",
                        Statement: [
                            {
                                Sid: "CreateCacheRepositories",
                                Effect: "Allow",
                                Action: ecrActions,
                                Resource: `arn:${p}:ecr:${r}:${acct}:repository/${ns}/*`,
                            },
                            ...(useKms ? [{
                                Sid: "UseKmsKeyForCacheRepositories",
                                Effect: "Allow",
                                Action: ["kms:CreateGrant", "kms:RetireGrant", "kms:DescribeKey"],
                                Resource: keyArn,
                            }] : []),
                        ],
                    })),
            }, { parent: this });
        }

        const template = new aws.ecr.RepositoryCreationTemplate(`${name}-creation-template`, {
            prefix: cacheNamespace,
            description: args.repositoryCreationTemplateDescription ?? DEFAULT_TEMPLATE_DESCRIPTION,
            appliedFors: ["PULL_THROUGH_CACHE"],
            customRoleArn: creationRoleArn,
            imageTagMutability: args.imageTagMutability ?? "MUTABLE",
            lifecyclePolicy,
            repositoryPolicy,
            resourceTags: hasRepositoryTags ? repositoryTags : undefined,
            encryptionConfigurations: [{
                encryptionType,
                kmsKey: kmsKeyArn,
            }],
        }, { parent: this, dependsOn: creationPolicy ? [creationPolicy] : [] });

        return {
            prefix: template.prefix as pulumi.Output<string | undefined>,
            creationRoleArn: (creationRoleArn ?? pulumi.output<string | undefined>(undefined)) as pulumi.Output<string | undefined>,
            kmsKeyArn: (kmsKeyArn ?? pulumi.output<string | undefined>(undefined)) as pulumi.Output<string | undefined>,
        };
    }
}

/**
 * Configuration for the KMS key owner side of a cross-account setup.
 */
export interface EcrKmsKeyOwnerInput {
    /**
     * AWS account ID running the Echo ECR pull-through cache (the account whose
     * ECR registry will use this key).
     */
    consumerAccountId: pulumi.Input<string>;

    /**
     * Name of the repository creation role in the consumer account. Must match
     * creationRoleName of the EcrPullThroughCache component there.
     * @default "echo-ecr-repo-creation-role"
     */
    consumerCreationRoleName?: string;

    /**
     * Create a new key. Set to false to only render the key policy statement
     * (consumerKeyPolicyStatement) for an existing key.
     * @default true
     */
    createKmsKey?: boolean;

    /**
     * Add kms:ViaService = ecr.<region>.amazonaws.com to the consumer statement.
     * Optional hardening; verify in a non-production account first.
     * @default false
     */
    requireEcrViaService?: boolean;

    /**
     * Alias for the created key. Set to "" to skip.
     * @default "alias/echo-ecr-mirror"
     */
    kmsKeyAlias?: string;

    /**
     * @default 30
     */
    kmsKeyDeletionWindowInDays?: number;

    /**
     * @default true
     */
    kmsKeyEnableKeyRotation?: boolean;

    /**
     * Tags to apply to the created key.
     */
    tags?: Record<string, string>;
}

/**
 * KMS key owner side of a cross-account setup. Deploy it with a provider for the
 * account that owns the key; pass `kmsKeyArn` to EcrPullThroughCache in the
 * consumer account.
 */
export class EcrKmsKeyOwner extends pulumi.ComponentResource {
    /** ARN of the created key (undefined when createKmsKey is false). */
    public readonly kmsKeyArn: pulumi.Output<string | undefined>;
    /** Statement JSON to merge into an existing key policy. */
    public readonly consumerKeyPolicyStatement: pulumi.Output<string>;
    /** Full key policy JSON. */
    public readonly keyPolicy: pulumi.Output<string>;
    /** Consumer role ARN the key policy allows. */
    public readonly consumerCreationRoleArn: pulumi.Output<string>;

    constructor(name: string, args: EcrKmsKeyOwnerInput, opts?: pulumi.ComponentResourceOptions) {
        super("echo-pulumi-ecr-mirror:index:EcrKmsKeyOwner", name, args, opts);

        const alias = args.kmsKeyAlias ?? DEFAULT_KMS_KEY_ALIAS;
        if (alias !== "" && (!KMS_ALIAS_PATTERN.test(alias) || alias.startsWith("alias/aws/"))) {
            throw new Error('EcrKmsKeyOwner: kmsKeyAlias must start with "alias/" and must not start with "alias/aws/". Use "" to skip the alias.');
        }
        const window = args.kmsKeyDeletionWindowInDays ?? 30;
        if (!Number.isInteger(window) || window < 7 || window > 30) {
            throw new Error("EcrKmsKeyOwner: kmsKeyDeletionWindowInDays must be an integer between 7 and 30.");
        }

        const invokeOpts = { parent: this };
        const owner = aws.getCallerIdentityOutput({}, invokeOpts);
        const region = aws.getRegionOutput({}, invokeOpts);
        const partition = aws.getPartitionOutput({}, invokeOpts);
        const roleName = args.consumerCreationRoleName ?? DEFAULT_CREATION_ROLE_NAME;

        const consumerAccountId = pulumi.output(args.consumerAccountId);

        const statement = pulumi.all([partition.partition, region.name, consumerAccountId]).apply(([p, r, consumer]) => buildEcrKmsKeyOwnerStatement({
            consumerAccountId: consumer,
            consumerCreationRoleName: roleName,
            partition: p,
            region: r,
            requireEcrViaService: args.requireEcrViaService,
        }));
        const keyPolicy = pulumi.all([partition.partition, owner.accountId, statement]).apply(([p, acct, s]) => JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Sid: "EnableIAMUserPermissions",
                    Effect: "Allow",
                    Principal: { AWS: `arn:${p}:iam::${acct}:root` },
                    Action: "kms:*",
                    Resource: "*",
                },
                s,
            ],
        }));

        let kmsKeyArn: pulumi.Output<string | undefined> = pulumi.output<string | undefined>(undefined);
        if (args.createKmsKey ?? true) {
            const key = new aws.kms.Key(`${name}-kms-key`, {
                description: pulumi.interpolate`Encrypts Echo ECR pull-through cache repositories in account ${consumerAccountId}`,
                deletionWindowInDays: window,
                enableKeyRotation: args.kmsKeyEnableKeyRotation ?? true,
                policy: keyPolicy,
                tags: { ...args.tags },
            }, { parent: this });
            if (alias !== "") {
                new aws.kms.Alias(`${name}-kms-alias`, {
                    name: alias,
                    targetKeyId: key.keyId,
                }, { parent: this });
            }
            kmsKeyArn = key.arn;
        }

        this.kmsKeyArn = kmsKeyArn;
        this.consumerKeyPolicyStatement = statement.apply(s => JSON.stringify(s));
        this.keyPolicy = keyPolicy;
        this.consumerCreationRoleArn = pulumi.interpolate`arn:${partition.partition}:iam::${consumerAccountId}:role/${roleName}`;

        this.registerOutputs({
            kmsKeyArn: this.kmsKeyArn,
            consumerKeyPolicyStatement: this.consumerKeyPolicyStatement,
            keyPolicy: this.keyPolicy,
            consumerCreationRoleArn: this.consumerCreationRoleArn,
        });
    }
}
