import { test, beforeEach } from "node:test";
import * as assert from "node:assert/strict";
import * as pulumi from "@pulumi/pulumi";

interface CreatedResource { type: string; name: string; inputs: any }
let created: CreatedResource[] = [];

pulumi.runtime.setMocks({
    newResource(args) {
        created.push({ type: args.type, name: args.name, inputs: args.inputs });
        const state: Record<string, unknown> = { ...args.inputs };
        if (args.type === "aws:kms/key:Key") {
            state.arn = "arn:aws:kms:us-east-1:111111111111:key/00000000-0000-0000-0000-000000000000";
            state.keyId = "00000000-0000-0000-0000-000000000000";
        }
        if (args.type === "aws:iam/role:Role") {
            state.arn = `arn:aws:iam::111111111111:role/${args.inputs.name}`;
        }
        return { id: `${args.name}-id`, state };
    },
    call(args) {
        switch (args.token) {
            case "aws:index/getCallerIdentity:getCallerIdentity": return { accountId: "111111111111" };
            case "aws:index/getRegion:getRegion": return { name: "us-east-1" };
            case "aws:index/getPartition:getPartition": return { partition: "aws" };
            default: return {};
        }
    },
}, "project", "stack", false);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { EcrPullThroughCache, EcrKmsKeyOwner, buildEcrKmsKeyOwnerStatement, validateKmsKeyArn } = require("../index") as typeof import("../index");

function value<T>(output: pulumi.Output<T>): Promise<T> {
    return (output as any).promise();
}

async function settle(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
}

const ofType = (type: string) => created.filter(r => r.type === type);
const base = { echoRegistryAccountId: "123456789012" };
const sameAccountKey = "arn:aws:kms:us-east-1:111111111111:key/1234abcd-12ab-34cd-56ef-1234567890ab";

beforeEach(() => { created = []; });

test("default creates only the pull-through cache rule and its role", async () => {
    const cache = new EcrPullThroughCache("default", base);
    await value(cache.usageInstructions);
    await settle();
    assert.equal(ofType("aws:ecr/repositoryCreationTemplate:RepositoryCreationTemplate").length, 0);
    assert.equal(ofType("aws:kms/key:Key").length, 0);
    assert.deepEqual(ofType("aws:iam/role:Role").map(r => r.name), ["default-echo-ecr-mirror-role"]);
    assert.equal(await value(cache.kmsKeyIsCrossAccount), false);
});

test("AES256 template without tags needs no creation role", async () => {
    const cache = new EcrPullThroughCache("aes", { ...base, createRepositoryCreationTemplate: true });
    await value(cache.repositoryCreationTemplatePrefix);
    await settle();
    const [template] = ofType("aws:ecr/repositoryCreationTemplate:RepositoryCreationTemplate");
    assert.equal(template.inputs.prefix, "echo");
    assert.deepEqual(template.inputs.appliedFors, ["PULL_THROUGH_CACHE"]);
    assert.equal(template.inputs.encryptionConfigurations[0].encryptionType, "AES256");
    assert.equal(template.inputs.customRoleArn, undefined);
    assert.equal(ofType("aws:iam/role:Role").length, 1);
});

test("repository tags create a creation role without KMS permissions", async () => {
    const cache = new EcrPullThroughCache("tags", { ...base, createRepositoryCreationTemplate: true, repositoryTags: { team: "platform" } });
    assert.equal(await value(cache.repositoryCreationRoleArn), "arn:aws:iam::111111111111:role/echo-ecr-repo-creation-role");
    await settle();
    const [policy] = ofType("aws:iam/rolePolicy:RolePolicy").filter(p => p.inputs.name === "echo-ecr-repo-creation-policy");
    assert.ok(!policy.inputs.policy.includes("kms:"));
});

test("existing same-account key wires role and template", async () => {
    const cache = new EcrPullThroughCache("cmk", { ...base, createRepositoryCreationTemplate: true, encryptionType: "KMS", kmsKeyArn: sameAccountKey });
    assert.equal(await value(cache.kmsKeyArn), sameAccountKey);
    assert.equal(await value(cache.kmsKeyIsCrossAccount), false);
    await settle();
    const [template] = ofType("aws:ecr/repositoryCreationTemplate:RepositoryCreationTemplate");
    assert.equal(template.inputs.encryptionConfigurations[0].kmsKey, sameAccountKey);
    assert.equal(template.inputs.customRoleArn, "arn:aws:iam::111111111111:role/echo-ecr-repo-creation-role");
    const role = ofType("aws:iam/role:Role").find(r => r.inputs.name === "echo-ecr-repo-creation-role")!;
    assert.ok(role.inputs.assumeRolePolicy.includes("ecr.amazonaws.com"));
    const policy = JSON.parse(ofType("aws:iam/rolePolicy:RolePolicy").find(p => p.inputs.name === "echo-ecr-repo-creation-policy")!.inputs.policy);
    assert.equal(policy.Statement[0].Resource, "arn:aws:ecr:us-east-1:111111111111:repository/echo/*");
    assert.deepEqual(policy.Statement[1].Action, ["kms:CreateGrant", "kms:RetireGrant", "kms:DescribeKey"]);
    assert.equal(policy.Statement[1].Resource, sameAccountKey);
});

test("module-created key gets a policy allowing the creation role", async () => {
    const cache = new EcrPullThroughCache("created", { ...base, createRepositoryCreationTemplate: true, encryptionType: "KMS", createKmsKey: true });
    await value(cache.kmsKeyArn);
    await settle();
    const [key] = ofType("aws:kms/key:Key");
    assert.ok(key.inputs.policy.includes("arn:aws:iam::111111111111:role/echo-ecr-repo-creation-role"));
    assert.equal(ofType("aws:kms/alias:Alias").length, 1);
});

test("cross-account key is detected", async () => {
    const cache = new EcrPullThroughCache("xacct", {
        ...base, createRepositoryCreationTemplate: true, encryptionType: "KMS",
        kmsKeyArn: "arn:aws:kms:us-east-1:222222222222:key/1234abcd-12ab-34cd-56ef-1234567890ab",
    });
    assert.equal(await value(cache.kmsKeyIsCrossAccount), true);
});

test("supplied creation role is used instead of creating one", async () => {
    const cache = new EcrPullThroughCache("own-role", {
        ...base, createRepositoryCreationTemplate: true, encryptionType: "KMS", kmsKeyArn: sameAccountKey,
        creationRoleArn: "arn:aws:iam::111111111111:role/my-own-role",
    });
    assert.equal(await value(cache.repositoryCreationRoleArn), "arn:aws:iam::111111111111:role/my-own-role");
    await settle();
    assert.equal(ofType("aws:iam/role:Role").length, 1);
});

test("invalid input combinations fail with helpful errors", () => {
    assert.throws(() => new EcrPullThroughCache("e1", { ...base, createRepositoryCreationTemplate: true, encryptionType: "KMS" }), /requires exactly one of/);
    assert.throws(() => new EcrPullThroughCache("e2", { ...base, createRepositoryCreationTemplate: true, encryptionType: "KMS", createKmsKey: true, kmsKeyArn: sameAccountKey }), /requires exactly one of/);
    assert.throws(() => new EcrPullThroughCache("e3", { ...base, createRepositoryCreationTemplate: true, kmsKeyArn: sameAccountKey }), /only used with encryptionType "KMS"/);
    assert.throws(() => new EcrPullThroughCache("e4", { ...base, encryptionType: "KMS", createKmsKey: true }), /createRepositoryCreationTemplate: true/);
    assert.throws(() => new EcrPullThroughCache("e5", { ...base, createRepositoryCreationTemplate: true, kmsKeyAlias: "alias/aws/ecr", encryptionType: "KMS", createKmsKey: true }), /kmsKeyAlias/);
});

test("key ARN validation rejects aliases and other Regions", () => {
    assert.throws(() => validateKmsKeyArn("arn:aws:kms:us-east-1:111111111111:alias/my-key", "us-east-1"), /full KMS key ARN/);
    assert.throws(() => validateKmsKeyArn("1234abcd-12ab-34cd-56ef-1234567890ab", "us-east-1"), /full KMS key ARN/);
    assert.throws(() => validateKmsKeyArn("arn:aws:kms:eu-west-1:111111111111:key/1234abcd-12ab-34cd-56ef-1234567890ab", "us-east-1"), /same Region/);
    assert.equal(validateKmsKeyArn(sameAccountKey, "us-east-1"), sameAccountKey);
});

test("key owner component and statement builder", async () => {
    const owner = new EcrKmsKeyOwner("owner", { consumerAccountId: "333333333333" });
    const policy = JSON.parse(await value(owner.keyPolicy));
    assert.equal(policy.Statement[1].Condition.ArnEquals["aws:PrincipalArn"], "arn:aws:iam::333333333333:role/echo-ecr-repo-creation-role");
    assert.equal(policy.Statement[1].Principal.AWS, "arn:aws:iam::333333333333:root");
    await settle();
    assert.equal(ofType("aws:kms/key:Key").length, 1);

    const statement = buildEcrKmsKeyOwnerStatement({ consumerAccountId: "333333333333", region: "us-east-1", requireEcrViaService: true }) as any;
    assert.equal(statement.Condition.StringEquals["kms:ViaService"], "ecr.us-east-1.amazonaws.com");
    assert.throws(() => buildEcrKmsKeyOwnerStatement({ consumerAccountId: "123" }), /12-digit/);
});
