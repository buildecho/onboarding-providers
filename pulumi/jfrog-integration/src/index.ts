import * as pulumi from "@pulumi/pulumi";
import * as artifactory from "@pulumi/artifactory";

/**
 * Configuration options for the JFrog Integration with Echo Registry
 */
export interface JfrogIntegrationConfig {
    /**
     * The key (name) for the remote repository in Artifactory
     * @default "echo"
     */
    repositoryKey?: string;

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
     * The key (name) of the remote repository
     */
    repositoryKey: pulumi.Output<string>;

    /**
     * The URL of the remote repository
     */
    repositoryUrl: pulumi.Output<string>;

    /**
     * The remote repository resource
     */
    remoteRepository: artifactory.RemoteDockerRepository;

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
 * import { JfrogIntegration } from "@echo/pulumi-jfrog-integration";
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
    public readonly repositoryKey: pulumi.Output<string>;
    public readonly repositoryUrl: pulumi.Output<string>;
    public readonly remoteRepository: artifactory.RemoteDockerRepository;
    public readonly usageInstructions: pulumi.Output<string>;

    constructor(name: string, config: JfrogIntegrationConfig, opts?: pulumi.ComponentResourceOptions) {
        super("echo:jfrog:Integration", name, {}, opts);

        // Set defaults
        const repositoryKey = config.repositoryKey || "echo";
        const echoRegistryUrl = config.echoRegistryUrl || "https://reg.echohq.com";
        const description = config.description || "Echo Registry remote repository for container images";
        const notes = config.notes || "Managed by Pulumi - Echo Registry integration";
        const includesPattern = config.includesPattern || "**/*";
        const excludesPattern = config.excludesPattern || "";
        const repoLayoutRef = config.repoLayoutRef || "simple-default";
        const blockMismatchingMimeTypes = config.blockMismatchingMimeTypes ?? true;
        const enableTokenAuthentication = config.enableTokenAuthentication ?? true;
        const storeArtifactsLocally = config.storeArtifactsLocally ?? true;
        const socketTimeoutMillis = config.socketTimeoutMillis || 15000;
        const retrievalCachePeriodSeconds = config.retrievalCachePeriodSeconds || 7200;
        const missedCachePeriodSeconds = config.missedCachePeriodSeconds || 1800;
        const hardFail = config.hardFail ?? false;
        const offline = config.offline ?? false;
        const bypassHeadRequests = config.bypassHeadRequests ?? false;
        const priorityResolution = config.priorityResolution ?? false;
        const xrayIndex = config.xrayIndex ?? false;
        const propertySets = config.propertySets || ["artifactory"];

        // Create the remote Docker repository
        this.remoteRepository = new artifactory.RemoteDockerRepository(`${name}-remote`, {
            key: repositoryKey,
            url: echoRegistryUrl,
            username: config.echoAccessKeyName,
            password: config.echoAccessKeyValue,
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
        this.repositoryKey = pulumi.output(repositoryKey);
        this.repositoryUrl = pulumi.interpolate`${echoRegistryUrl}`;

        // Generate usage instructions
        this.usageInstructions = pulumi.all([this.repositoryKey]).apply(([key]) => {
            return this.generateUsageInstructions(key);
        });

        // Register outputs
        this.registerOutputs({
            repositoryKey: this.repositoryKey,
            repositoryUrl: this.repositoryUrl,
            usageInstructions: this.usageInstructions
        });
    }

    private generateUsageInstructions(repositoryKey: string): string {
        return `
🎉 JFrog Artifactory Integration with Echo Registry Complete!

Your Artifactory is now configured to proxy Echo images.

📦 How to Pull Echo Images through Artifactory:
─────────────────────────────────────────────────
Instead of pulling directly from Echo's registry, use your Artifactory:

  docker pull <your-artifactory-url>/${repositoryKey}/<image-name>:<tag>

Example:
  docker pull artifactory.example.com/${repositoryKey}/static:latest

💡 Benefits:
- 🔒 Centralized access control through Artifactory
- ⚡ Local caching for faster pulls
- 📊 Better visibility and auditing
- 🛡️ Security scanning with Xray (if enabled)
- 🔄 Automatic synchronization with Echo registry

⚠️  Important Configuration Steps:
1. Ensure your Docker client is configured to authenticate with Artifactory
2. Configure your CI/CD pipelines to use the Artifactory URL
3. Set up appropriate permissions in Artifactory for users/services

🔧 Docker Login:
  docker login <your-artifactory-url>

📚 Additional Resources:
- JFrog Artifactory Documentation: https://jfrog.com/help/r/jfrog-artifactory-documentation
- Echo Registry Documentation: https://docs.echohq.com

Need help? Contact Echo support at support@echohq.com.
`;
    }
}

/**
 * Helper function to create JFrog integration with minimal configuration
 * 
 * @example
 * ```typescript
 * import { createJfrogIntegration } from "@echo/pulumi-jfrog-integration";
 * 
 * const integration = createJfrogIntegration("echo-integration", {
 *     echoAccessKeyName: "my-echo-username",
 *     echoAccessKeyValue: "my-echo-password"
 * });
 * ```
 */
export function createJfrogIntegration(
    name: string,
    config: JfrogIntegrationConfig,
    opts?: pulumi.ComponentResourceOptions
): JfrogIntegrationOutputs {
    const integration = new JfrogIntegration(name, config, opts);

    return {
        repositoryKey: integration.repositoryKey,
        repositoryUrl: integration.repositoryUrl,
        remoteRepository: integration.remoteRepository,
        usageInstructions: integration.usageInstructions
    };
}

// Re-export artifactory types that users might need
export { artifactory };