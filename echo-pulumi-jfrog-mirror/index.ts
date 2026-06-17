import * as pulumi from "@pulumi/pulumi";
import * as artifactory from "@pulumi/artifactory";

/**
 * Configuration options for the JFrog Integration with Echo.
 *
 * One component orchestrates the image (Docker) remote and the library (PyPI /
 * npm / Maven) remotes; each is provisioned only when its flag is set. Images
 * use the image access key, libraries share the library access key.
 */
export interface JfrogIntegrationInput {
    /**
     * Base name for the remote repositories. Per-format repositories derive from
     * it (<name>, <name>-pypi, <name>-npm, <name>-maven) unless overridden.
     * @default "echo"
     */
    remoteRepositoryName?: string;

    // --- Images (container registry) ---

    /** Provision the Docker remote that proxies Echo's image registry. */
    echoImages?: boolean;

    /** Echo image access key name (username) for the Docker remote. */
    echoImageKeyName?: pulumi.Input<string>;

    /** Echo image access key value (password) for the Docker remote. */
    echoImageKeyValue?: pulumi.Input<string>;

    /** Optional override for the Docker remote key. Defaults to remoteRepositoryName. */
    echoImageRepositoryName?: string;

    /**
     * URL of the Echo image registry.
     * @default "https://reg.echohq.com"
     */
    echoRegistryUrl?: string;

    /**
     * @deprecated Use echoImageKeyName. Kept for backwards compatibility with the
     * original image-only component; provisions the Docker remote when set.
     */
    echoAccessKeyName?: pulumi.Input<string>;

    /** @deprecated Use echoImageKeyValue. */
    echoAccessKeyValue?: pulumi.Input<string>;

    // --- Libraries (package registries), one shared library key ---

    /** Provision the PyPI remote that proxies Echo's PyPI index. */
    echoLibraryPypi?: boolean;

    /** Provision the npm remote that proxies Echo's npm index. */
    echoLibraryNpm?: boolean;

    /** Provision the Maven remote that proxies Echo's Maven index. */
    echoLibraryMaven?: boolean;

    /**
     * Echo library access key name (username) for the library remotes. No-op:
     * Echo's library index authenticates by token only (the key value is the
     * password), so the name is accepted but ignored.
     */
    echoLibraryKeyName?: pulumi.Input<string>;

    /** Echo library access key value (password/token) for the library remotes. */
    echoLibraryKeyValue?: pulumi.Input<string>;

    /**
     * PyPI remote URL. Points at the index root; Artifactory appends the
     * PEP 503 simple path itself when proxying.
     * @default "https://pypi.echohq.com"
     */
    echoPypiUrl?: string;

    /** @default "https://npm.echohq.com" */
    echoNpmUrl?: string;

    /** @default "https://maven.echohq.com" */
    echoMavenUrl?: string;

    /** Optional override for the PyPI remote key. Defaults to <name>-pypi. */
    echoPypiRepositoryName?: string;

    /** Optional override for the npm remote key. Defaults to <name>-npm. */
    echoNpmRepositoryName?: string;

    /** Optional override for the Maven remote key. Defaults to <name>-maven. */
    echoMavenRepositoryName?: string;

    // --- Shared remote-repository configuration ---

    /** @default "Echo remote repository" */
    description?: string;
    /** @default "Managed by Pulumi - Echo integration" */
    notes?: string;
    /** @default "**\/*" */
    includesPattern?: string;
    /** @default "" */
    excludesPattern?: string;
    /** Docker repo layout reference. @default "simple-default" */
    repoLayoutRef?: string;
    /** @default true */
    blockMismatchingMimeTypes?: boolean;
    /** @default true */
    enableTokenAuthentication?: boolean;
    /** @default true */
    storeArtifactsLocally?: boolean;
    /** @default 15000 */
    socketTimeoutMillis?: number;
    /** @default 7200 */
    retrievalCachePeriodSeconds?: number;
    /** @default 1800 */
    missedCachePeriodSeconds?: number;
    /** @default false */
    hardFail?: boolean;
    /** @default false */
    offline?: boolean;
    /** @default false */
    bypassHeadRequests?: boolean;
    /** @default false */
    priorityResolution?: boolean;
    /** @default false */
    xrayIndex?: boolean;
    /** @default ["artifactory"] */
    propertySets?: string[];
    /**
     * @deprecated Accepted for backwards compatibility with the image-only
     * module; not applied to any resource.
     */
    tags?: Record<string, string>;
}

/**
 * JFrog Integration Component.
 *
 * Provisions Artifactory remote repositories that proxy Echo — a Docker remote
 * for images and PyPI/npm/Maven remotes for libraries — based on the inputs.
 *
 * @example
 * ```typescript
 * import { JfrogIntegration } from "@buildecho/echo-pulumi-jfrog-mirror";
 *
 * const integration = new JfrogIntegration("echo-integration", {
 *     echoImages: true,
 *     echoImageKeyName: config.requireSecret("echoImageKeyName"),
 *     echoImageKeyValue: config.requireSecret("echoImageKeyValue"),
 *     echoLibraryPypi: true,
 *     echoLibraryKeyName: config.requireSecret("echoLibraryKeyName"),
 *     echoLibraryKeyValue: config.requireSecret("echoLibraryKeyValue"),
 * });
 *
 * export const instructions = integration.usageInstructions;
 * ```
 */
export class JfrogIntegration extends pulumi.ComponentResource {
    public readonly usageInstructions: pulumi.Output<string>;

    constructor(name: string, args: JfrogIntegrationInput, opts?: pulumi.ComponentResourceOptions) {
        super("echo-pulumi-jfrog-mirror:index:JfrogIntegration", name, args, opts);

        const repositoryName = args.remoteRepositoryName || "echo";
        const description = args.description || "Echo remote repository";
        const notes = args.notes || "Managed by Pulumi - Echo integration";
        const includesPattern = args.includesPattern || "**/*";
        const excludesPattern = args.excludesPattern || "";
        const storeArtifactsLocally = args.storeArtifactsLocally ?? true;
        const socketTimeoutMillis = args.socketTimeoutMillis || 15000;
        const retrievalCachePeriodSeconds = args.retrievalCachePeriodSeconds || 7200;
        const missedCachePeriodSeconds = args.missedCachePeriodSeconds || 1800;
        const hardFail = args.hardFail ?? false;
        const offline = args.offline ?? false;

        const instructions: string[] = [];

        // --- Image (Docker) remote ---
        // Provision when explicitly enabled, or (legacy) when a deprecated access
        // key was supplied. Image key prefers the new field, falls back to access.
        const createDocker = args.echoImages === true || args.echoAccessKeyName !== undefined;
        if (createDocker) {
            const imageRepository = args.echoImageRepositoryName || repositoryName;
            new artifactory.RemoteDockerRepository(`${name}-remote`, {
                key: imageRepository,
                url: args.echoRegistryUrl || "https://reg.echohq.com",
                username: args.echoImageKeyName ?? args.echoAccessKeyName ?? "",
                password: args.echoImageKeyValue ?? args.echoAccessKeyValue ?? "",
                description,
                notes,
                includesPattern,
                excludesPattern,
                repoLayoutRef: args.repoLayoutRef || "simple-default",
                blockMismatchingMimeTypes: args.blockMismatchingMimeTypes ?? true,
                enableTokenAuthentication: args.enableTokenAuthentication ?? true,
                storeArtifactsLocally,
                socketTimeoutMillis,
                retrievalCachePeriodSeconds,
                missedCachePeriodSeconds,
                hardFail,
                offline,
                bypassHeadRequests: args.bypassHeadRequests ?? false,
                priorityResolution: args.priorityResolution ?? false,
                xrayIndex: args.xrayIndex ?? false,
                propertySets: args.propertySets || ["artifactory"],
            }, { parent: this });
            instructions.push(`Images:  docker pull <your-jfrog-domain>/${imageRepository}/static:latest`);
        }

        // Library remotes (PyPI / npm / Maven) authenticate to Echo by token
        // only: the key value is the password and `username` (the key name) is a
        // no-op, accepted for parity with images but ignored by Echo's index.
        // These repo types have no `enableTokenAuthentication` toggle (Docker
        // only), so there is nothing further to set.
        const libraryCommon = {
            username: args.echoLibraryKeyName ?? "",
            password: args.echoLibraryKeyValue ?? "",
            description,
            notes,
            storeArtifactsLocally,
            socketTimeoutMillis,
            retrievalCachePeriodSeconds,
            missedCachePeriodSeconds,
            hardFail,
            offline,
        };

        // --- Library remotes ---
        if (args.echoLibraryPypi) {
            const key = args.echoPypiRepositoryName || `${repositoryName}-pypi`;
            new artifactory.RemotePypiRepository(`${name}-pypi`, {
                key,
                url: args.echoPypiUrl || "https://pypi.echohq.com",
                ...libraryCommon,
            }, { parent: this });
            instructions.push(`PyPI:    pip install --index-url https://<your-jfrog-domain>/artifactory/api/pypi/${key}/simple <package>`);
        }

        if (args.echoLibraryNpm) {
            const key = args.echoNpmRepositoryName || `${repositoryName}-npm`;
            new artifactory.RemoteNpmRepository(`${name}-npm`, {
                key,
                url: args.echoNpmUrl || "https://npm.echohq.com",
                ...libraryCommon,
            }, { parent: this });
            instructions.push(`npm:     npm install --registry https://<your-jfrog-domain>/artifactory/api/npm/${key}/ <package>`);
        }

        if (args.echoLibraryMaven) {
            const key = args.echoMavenRepositoryName || `${repositoryName}-maven`;
            new artifactory.RemoteMavenRepository(`${name}-maven`, {
                key,
                url: args.echoMavenUrl || "https://maven.echohq.com",
                ...libraryCommon,
            }, { parent: this });
            instructions.push(`Maven:   add https://<your-jfrog-domain>/artifactory/${key} as a repository in your settings.xml`);
        }

        this.usageInstructions = pulumi.output(instructions.join("\n"));
        this.registerOutputs({
            usageInstructions: this.usageInstructions,
        });
    }
}
