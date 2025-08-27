import * as pulumi from "@pulumi/pulumi";
import * as artifactory from "@pulumi/artifactory";

/**
 * Configuration options for the JFrog Integration with Echo Registry
 */
export interface JfrogIntegrationInput {
    /**
     * The key (name) for the remote repository in Artifactory
     * @default "echo"
     */
    remoteRepositoryName?: string;

    /**
     * The URL of the Echo registry
     * @default "https://reg.echohq.com"
     */
    echoRegistryUrl?: string;

    /**
     * The name of the Echo access key (username)
     */
    echoAccessKeyName: pulumi.Input<string>;

    /**
     * The value of the Echo access key (password)
     */
    echoAccessKeyValue: pulumi.Input<string>;

    /**
     * Description for the remote repository
     * @default "Echo Registry remote repository for container images"
     */
    description?: string;

    /**
     * Internal notes about the repository
     * @default "Managed by Pulumi - Echo Registry integration"
     */
    notes?: string;

    /**
     * Comma-separated list of patterns to include when evaluating artifact requests
     * @default "**\/*"
     */
    includesPattern?: string;

    /**
     * Comma-separated list of patterns to exclude when evaluating artifact requests
     * @default ""
     */
    excludesPattern?: string;

    /**
     * Repository layout reference
     * @default "simple-default"
     */
    repoLayoutRef?: string;

    /**
     * Block artifacts with mismatching MIME types
     * @default true
     */
    blockMismatchingMimeTypes?: boolean;

    /**
     * Enable token authentication for Docker repositories
     * @default true
     */
    enableTokenAuthentication?: boolean;

    /**
     * Store artifacts locally when proxying
     * @default true
     */
    storeArtifactsLocally?: boolean;

    /**
     * Network socket timeout in milliseconds
     * @default 15000
     */
    socketTimeoutMillis?: number;

    /**
     * Cache period for retrieval operations in seconds
     * @default 7200
     */
    retrievalCachePeriodSeconds?: number;

    /**
     * Cache period for missed artifacts in seconds
     * @default 1800
     */
    missedCachePeriodSeconds?: number;

    /**
     * Fail the request if the remote repository is not available
     * @default false
     */
    hardFail?: boolean;

    /**
     * Set the repository to offline mode
     * @default false
     */
    offline?: boolean;

    /**
     * Bypass HEAD requests and directly perform GET requests
     * @default false
     */
    bypassHeadRequests?: boolean;

    /**
     * Enable priority resolution
     * @default false
     */
    priorityResolution?: boolean;

    /**
     * Enable Xray indexing
     * @default false
     */
    xrayIndex?: boolean;

    /**
     * List of property sets to apply to the repository
     * @default []
     */
    propertySets?: string[];

    /**
     * Additional tags to apply to created resources
     */
    tags?: Record<string, string>;
}

/**
 * Outputs from the JFrog Integration component
 */
export interface JfrogIntegrationOutputs {
    /**
     * The URL of the remote repository
     */
    repositoryUrl: pulumi.Output<string>;


    /**
     * Human-readable usage instructions
     */
    usageInstructions: pulumi.Output<string>;
}

/**
 * JFrog Integration Component
 * 
 * This component sets up a JFrog Artifactory remote repository to integrate with Echo's registry,
 * allowing you to proxy Echo images through your Artifactory instance.
 * 
 * @example
 * ```typescript
 * import { JfrogIntegration } from "@buildecho/echo-pulumi-jfrog-mirror";
 * 
 * const integration = new JfrogIntegration("echo-integration", {
 *     echoAccessKeyName: config.requireSecret("echoAccessKeyName"),
 *     echoAccessKeyValue: config.requireSecret("echoAccessKeyValue")
 * });
 * 
 * export const repositoryUrl = integration.repositoryUrl;
 * export const instructions = integration.usageInstructions;
 * ```
 */
export class JfrogIntegration extends pulumi.ComponentResource {
    public readonly usageInstructions: pulumi.Output<string>;

    constructor(name: string, args: JfrogIntegrationInput, opts?: pulumi.ComponentResourceOptions) {
        super("echo-pulumi-jfrog-mirror:index:JfrogIntegration", name, args, opts);

        // Set defaults
        const repositoryName = args.remoteRepositoryName || "echo";
        const echoRegistryUrl = args.echoRegistryUrl || "https://reg.echohq.com";
        const description = args.description || "Echo Registry remote repository for container images";
        const notes = args.notes || "Managed by Pulumi - Echo Registry integration";
        const includesPattern = args.includesPattern || "**/*";
        const excludesPattern = args.excludesPattern || "";
        const repoLayoutRef = args.repoLayoutRef || "simple-default";
        const blockMismatchingMimeTypes = args.blockMismatchingMimeTypes ?? true;
        const enableTokenAuthentication = args.enableTokenAuthentication ?? true;
        const storeArtifactsLocally = args.storeArtifactsLocally ?? true;
        const socketTimeoutMillis = args.socketTimeoutMillis || 15000;
        const retrievalCachePeriodSeconds = args.retrievalCachePeriodSeconds || 7200;
        const missedCachePeriodSeconds = args.missedCachePeriodSeconds || 1800;
        const hardFail = args.hardFail ?? false;
        const offline = args.offline ?? false;
        const bypassHeadRequests = args.bypassHeadRequests ?? false;
        const priorityResolution = args.priorityResolution ?? false;
        const xrayIndex = args.xrayIndex ?? false;
        const propertySets = args.propertySets || ["artifactory"];

        // Create the remote Docker repository
        const remoteRepository = new artifactory.RemoteDockerRepository(`${name}-remote`, {
            key: repositoryName,
            url: echoRegistryUrl,
            username: args.echoAccessKeyName,
            password: args.echoAccessKeyValue,
            description: description,
            notes: notes,
            includesPattern: includesPattern,
            excludesPattern: excludesPattern,
            repoLayoutRef: repoLayoutRef,
            blockMismatchingMimeTypes: blockMismatchingMimeTypes,
            enableTokenAuthentication: enableTokenAuthentication,
            storeArtifactsLocally: storeArtifactsLocally,
            socketTimeoutMillis: socketTimeoutMillis,
            retrievalCachePeriodSeconds: retrievalCachePeriodSeconds,
            missedCachePeriodSeconds: missedCachePeriodSeconds,
            hardFail: hardFail,
            offline: offline,
            bypassHeadRequests: bypassHeadRequests,
            priorityResolution: priorityResolution,
            xrayIndex: xrayIndex,
            propertySets: propertySets,
        }, { parent: this });

        // Set outputs

        // one line docker pull command
        this.usageInstructions = pulumi.output(`docker pull <JFrog instance URL>/${repositoryName}/static:latest`);
        // Register outputs
        this.registerOutputs({
            usageInstructions: this.usageInstructions
        });
    }

}
