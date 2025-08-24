import * as pulumi from "@pulumi/pulumi";
import * as artifactory from "@pulumi/artifactory";

/**
 * Configuration options for the JFrog Integration with Echo Registry
 */
export interface JfrogIntegrationConfig {
    /**
     * Whether to create resources under this component
     * @default true
     */
    create?: boolean;

    /**
     * The key (name) for the remote repository in Artifactory
     * @default "echo-mirror"
     */
    repositoryName?: string;

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
     * The name of the remote repository
     */
    repositoryName: pulumi.Output<string | undefined>;

    /**
     * The URL of the Artifactory repository for pulling images
     */
    repositoryUrl: pulumi.Output<string | undefined>;

    /**
     * The Echo registry URL being proxied
     */
    echoRegistryUrl: pulumi.Output<string | undefined>;

    /**
     * The remote repository resource
     */
    remoteRepository: artifactory.RemoteDockerRepository | undefined;

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
    public readonly repositoryName: pulumi.Output<string | undefined>;
    public readonly repositoryUrl: pulumi.Output<string | undefined>;
    public readonly echoRegistryUrl: pulumi.Output<string | undefined>;
    public readonly remoteRepository: artifactory.RemoteDockerRepository | undefined;
    public readonly usageInstructions: pulumi.Output<string>;

    constructor(name: string, config: JfrogIntegrationConfig, opts?: pulumi.ComponentResourceOptions) {
        super("echo:jfrog:Integration", name, {}, opts);

        // Set defaults
        const create = config.create ?? true;
        const repositoryName = config.repositoryName || "echo-mirror";
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

        if (create) {
            // Create the remote Docker repository
            this.remoteRepository = new artifactory.RemoteDockerRepository(`${name}-remote`, {
                key: repositoryName,
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

            // Set outputs for created resources
            this.repositoryName = pulumi.output(repositoryName);
            this.repositoryUrl = pulumi.interpolate`<your-artifactory-url>/${repositoryName}`;
            this.echoRegistryUrl = pulumi.output(echoRegistryUrl);

            // Generate usage instructions
            this.usageInstructions = pulumi.all([this.repositoryName, this.echoRegistryUrl]).apply(([key, upstreamUrl]) => {
                return this.generateUsageInstructions(key!, upstreamUrl!);
            });
        } else {
            // Set empty outputs when create is false
            this.repositoryName = pulumi.output(undefined);
            this.repositoryUrl = pulumi.output(undefined);
            this.echoRegistryUrl = pulumi.output(undefined);
            this.usageInstructions = pulumi.output("");
        }

        // Register outputs
        this.registerOutputs({
            repositoryName: this.repositoryName,
            repositoryUrl: this.repositoryUrl,
            echoRegistryUrl: this.echoRegistryUrl,
            usageInstructions: this.usageInstructions
        });
    }

    private generateUsageInstructions(repositoryName: string, echoRegistryUrl: string): string {
        return `
🎉 Echo Registry JFrog Artifactory Integration Setup Complete!

Your JFrog Artifactory is now configured to proxy Echo Registry images for improved performance and centralized access control.

📦 How to Pull Echo Images through Artifactory:
─────────────────────────────────────────────────
Use your Artifactory proxy cache instead of pulling directly from Echo registry:

  docker pull <your-artifactory-url>/${repositoryName}/<image-name>:<tag>

Example:
  docker pull artifactory.example.com/${repositoryName}/nginx:latest

Instead of:
  docker pull ${echoRegistryUrl.replace('https://', '')}/nginx:latest

💡 Benefits:
- ⚡ Faster image pulls (cached locally in Artifactory)
- 🔒 Centralized access control through Artifactory's security model
- 📊 Better visibility and auditing of image usage
- 🛡️ Advanced security scanning with JFrog Xray (if enabled)
- 🔄 Automatic synchronization with Echo registry
- 💰 Reduced data transfer costs from upstream registry
- 📈 Enhanced CI/CD integration capabilities

🔐 Authentication:
─────────────────
1. Configure Docker authentication with Artifactory:
   docker login <your-artifactory-url>

2. Use your Artifactory credentials or API keys for programmatic access

📚 Additional Notes:
- The first pull will fetch from Echo and cache in Artifactory
- Subsequent pulls use the cached version for faster performance
- Configure Artifactory's cleanup policies to manage storage
- Enable JFrog Xray for comprehensive security scanning
- Set up build info collection for complete traceability

🔧 Artifactory Configuration:
- Repository Name: ${repositoryName}
- Repository Type: Remote Docker Repository
- Upstream Registry: ${echoRegistryUrl}
- Local Storage: Enabled for caching
- Token Authentication: Enabled
- Xray Indexing: ${this.remoteRepository?.xrayIndex ? 'Enabled' : 'Disabled'}

⚙️ Advanced JFrog Features:
You can configure additional JFrog features like:
- Advanced security scanning with Xray
- Build info collection and promotion
- Repository replication for HA/DR
- Docker registry v2 API compliance
- Advanced access control with RBAC
- Webhook integrations for CI/CD
- Artifact lifecycle management
- License compliance scanning

🚀 CI/CD Integration:
Configure your CI/CD pipelines to:
1. Authenticate with Artifactory using API keys
2. Pull base images from ${repositoryName}
3. Push built images to other Artifactory repositories
4. Collect and publish build information

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
        repositoryName: integration.repositoryName,
        repositoryUrl: integration.repositoryUrl,
        echoRegistryUrl: integration.echoRegistryUrl,
        remoteRepository: integration.remoteRepository,
        usageInstructions: integration.usageInstructions
    };
}

// Re-export artifactory types that users might need
export { artifactory };