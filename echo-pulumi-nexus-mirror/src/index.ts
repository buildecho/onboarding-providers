import * as pulumi from "@pulumi/pulumi";
import * as nexus from "@pulumi/nexus";

/**
 * Configuration options for the Echo Nexus Integration
 */
export interface NexusIntegrationConfig {
    /**
     * The URL of the Echo registry
     * @default "https://reg.echohq.com"
     */
    echoRegistryUrl?: string;
    
    /**
     * The name of the Echo access key
     */
    echoAccessKeyName: string;
    
    /**
     * The value of the Echo access key
     */
    echoAccessKeyValue: pulumi.Input<string>;
    
    /**
     * Name of the Docker proxy repository
     * @default "echo"
     */
    repositoryName?: string;
    
    /**
     * Whether this repository should be online
     * @default true
     */
    repositoryOnline?: boolean;
    
    /**
     * Docker configuration options
     */
    dockerConfig?: {
        /**
         * Force basic authentication
         * @default true
         */
        forceBasicAuth?: boolean;
        
        /**
         * HTTP port for Docker registry
         */
        httpPort?: number;
        
        /**
         * HTTPS port for Docker registry
         */
        httpsPort?: number;
        
        /**
         * Enable Docker V1 API support
         * @default false
         */
        v1Enabled?: boolean;
        
        /**
         * Subdomain for Docker repository connector
         */
        subdomain?: string;
    };
    
    /**
     * Type of Docker index (REGISTRY, HUB, or CUSTOM)
     * @default "REGISTRY"
     */
    dockerIndexType?: "REGISTRY" | "HUB" | "CUSTOM";
    
    /**
     * URL of the Docker index (required if dockerIndexType is CUSTOM)
     */
    dockerIndexUrl?: string;
    
    /**
     * Storage configuration
     */
    storageConfig?: {
        /**
         * Name of the blob store to use
         * @default "default"
         */
        blobStoreName?: string;
        
        /**
         * Enable strict content type validation
         * @default true
         */
        strictContentTypeValidation?: boolean;
    };
    
    /**
     * Proxy configuration
     */
    proxyConfig?: {
        /**
         * How long to cache content metadata (in minutes)
         * @default 1440
         */
        contentMaxAge?: number;
        
        /**
         * How long to cache metadata (in minutes)
         * @default 1440
         */
        metadataMaxAge?: number;
    };
    
    /**
     * HTTP Client configuration
     */
    httpClientConfig?: {
        /**
         * Block outbound connections from this repository
         * @default false
         */
        blocked?: boolean;
        
        /**
         * Auto-block outbound connections if remote repository is unreachable
         * @default true
         */
        autoBlock?: boolean;
        
        /**
         * Connection configuration
         */
        connection?: {
            /**
             * Number of retries for connection attempts
             * @default 3
             */
            retries?: number;
            
            /**
             * Connection timeout in seconds
             * @default 60
             */
            timeout?: number;
            
            /**
             * Enable circular redirects
             * @default false
             */
            enableCircularRedirects?: boolean;
            
            /**
             * Enable cookies
             * @default false
             */
            enableCookies?: boolean;
            
            /**
             * Use Nexus trust store for certificate validation
             * @default false
             */
            useTrustStore?: boolean;
            
            /**
             * Custom user agent suffix
             */
            userAgentSuffix?: string;
        };
    };
    
    /**
     * Negative cache configuration
     */
    negativeCacheConfig?: {
        /**
         * Enable negative cache
         * @default true
         */
        enabled?: boolean;
        
        /**
         * Negative cache TTL in minutes
         * @default 1440
         */
        ttl?: number;
    };
    
    /**
     * Routing rule for this repository
     */
    routingRule?: string;
    
    /**
     * Additional tags to apply to created resources
     */
    tags?: Record<string, string>;
}

/**
 * Outputs from the Nexus Integration component
 */
export interface NexusIntegrationOutputs {
    /**
     * The Nexus Docker proxy repository resource
     */
    repository?: nexus.RepositoryDockerProxy;
    
    /**
     * The repository name
     */
    repositoryName?: pulumi.Output<string>;
    
    /**
     * The repository URL
     */
    repositoryUrl?: pulumi.Output<string>;
    
    /**
     * Docker pull command example
     */
    dockerPullCommand?: pulumi.Output<string>;
    
    /**
     * Human-readable usage instructions
     */
    usageInstructions: pulumi.Output<string>;
}

/**
 * Echo Nexus Integration Component
 * 
 * This component configures Sonatype Nexus to integrate with Echo Registry, creating
 * a Docker proxy repository that caches Echo container images.
 * 
 * @example
 * ```typescript
 * import { NexusIntegration } from "@buildecho/pulumi-nexus-integration";
 * 
 * const nexusIntegration = new NexusIntegration("echo-nexus", {
 *     echoAccessKeyName: "my-echo-access-key",
 *     echoAccessKeyValue: pulumi.secret("my-echo-access-key-value"),
 *     dockerConfig: {
 *         httpPort: 2525
 *     }
 * });
 * 
 * export const repositoryName = nexusIntegration.repositoryName;
 * export const dockerPullCommand = nexusIntegration.dockerPullCommand;
 * export const instructions = nexusIntegration.usageInstructions;
 * ```
 */
export class NexusIntegration extends pulumi.ComponentResource {
    public readonly repository?: nexus.RepositoryDockerProxy;
    public readonly repositoryName?: pulumi.Output<string>;
    public readonly repositoryUrl?: pulumi.Output<string>;
    public readonly dockerPullCommand?: pulumi.Output<string>;
    public readonly usageInstructions: pulumi.Output<string>;
    
    constructor(name: string, config: NexusIntegrationConfig, opts?: pulumi.ComponentResourceOptions) {
        super("echo:nexus:Integration", name, {}, opts);
        
        // Set defaults
        const echoRegistryUrl = config.echoRegistryUrl || "https://reg.echohq.com";
        const repositoryName = config.repositoryName || "echo";
        const repositoryOnline = config.repositoryOnline ?? true;
        
        // Docker defaults
        const dockerConfig = {
            forceBasicAuth: config.dockerConfig?.forceBasicAuth ?? true,
            httpPort: config.dockerConfig?.httpPort,
            httpsPort: config.dockerConfig?.httpsPort,
            v1Enabled: config.dockerConfig?.v1Enabled ?? false,
            subdomain: config.dockerConfig?.subdomain
        };
        
        // Storage defaults
        const storageConfig = {
            blobStoreName: config.storageConfig?.blobStoreName || "default",
            strictContentTypeValidation: config.storageConfig?.strictContentTypeValidation ?? true
        };
        
        // Proxy defaults
        const proxyConfig = {
            contentMaxAge: config.proxyConfig?.contentMaxAge ?? 1440,
            metadataMaxAge: config.proxyConfig?.metadataMaxAge ?? 1440
        };
        
        // HTTP Client defaults
        const httpClientConfig = {
            blocked: config.httpClientConfig?.blocked ?? false,
            autoBlock: config.httpClientConfig?.autoBlock ?? true,
            connection: {
                retries: config.httpClientConfig?.connection?.retries ?? 3,
                timeout: config.httpClientConfig?.connection?.timeout ?? 60,
                enableCircularRedirects: config.httpClientConfig?.connection?.enableCircularRedirects ?? false,
                enableCookies: config.httpClientConfig?.connection?.enableCookies ?? false,
                useTrustStore: config.httpClientConfig?.connection?.useTrustStore ?? false,
                userAgentSuffix: config.httpClientConfig?.connection?.userAgentSuffix
            }
        };
        
        // Negative cache defaults
        const negativeCacheConfig = {
            enabled: config.negativeCacheConfig?.enabled ?? true,
            ttl: config.negativeCacheConfig?.ttl ?? 1440
        };
        
        // Create Nexus Docker proxy repository
        this.repository = new nexus.RepositoryDockerProxy(`${name}-repository`, {
            name: repositoryName,
            online: repositoryOnline,
            
            // Docker configuration
            docker: {
                forceBasicAuth: dockerConfig.forceBasicAuth,
                httpPort: dockerConfig.httpPort,
                httpsPort: dockerConfig.httpsPort,
                v1Enabled: dockerConfig.v1Enabled,
                subdomain: dockerConfig.subdomain
            },
            
            // Docker proxy index configuration
            dockerProxy: {
                indexType: config.dockerIndexType || "REGISTRY",
                indexUrl: config.dockerIndexUrl
            },
            
            // Storage configuration
            storage: {
                blobStoreName: storageConfig.blobStoreName,
                strictContentTypeValidation: storageConfig.strictContentTypeValidation
            },
            
            // Proxy configuration
            proxy: {
                remoteUrl: echoRegistryUrl,
                contentMaxAge: proxyConfig.contentMaxAge,
                metadataMaxAge: proxyConfig.metadataMaxAge
            },
            
            // HTTP client configuration
            httpClient: {
                blocked: httpClientConfig.blocked,
                autoBlock: httpClientConfig.autoBlock,
                
                // Connection settings
                connection: {
                    retries: httpClientConfig.connection.retries,
                    timeout: httpClientConfig.connection.timeout,
                    enableCircularRedirects: httpClientConfig.connection.enableCircularRedirects,
                    enableCookies: httpClientConfig.connection.enableCookies,
                    useTrustStore: httpClientConfig.connection.useTrustStore,
                    userAgentSuffix: httpClientConfig.connection.userAgentSuffix
                },
                
                // Authentication
                authentication: {
                    type: "username",
                    username: config.echoAccessKeyName,
                    password: config.echoAccessKeyValue
                }
            },
            
            // Negative cache configuration
            negativeCache: {
                enabled: negativeCacheConfig.enabled,
                ttl: negativeCacheConfig.ttl
            },
            
            // Routing rule
            routingRule: config.routingRule
            
        }, { parent: this });
        
        this.repositoryName = pulumi.output(repositoryName);
        this.repositoryUrl = pulumi.interpolate`${echoRegistryUrl}/${repositoryName}`;
        
        // Generate Docker pull command
        this.dockerPullCommand = pulumi.all([
            this.repositoryName,
            pulumi.output(dockerConfig.httpPort),
            pulumi.output(dockerConfig.httpsPort)
        ]).apply(([repoName, httpPort, httpsPort]) => {
            const port = httpPort || httpsPort || "";
            const portSuffix = port ? `:${port}` : "";
            return `docker pull <nexus-host>${portSuffix}/${repoName}/<image>:<tag>`;
        });
        
        // Generate usage instructions
        this.usageInstructions = pulumi.all([
            this.repositoryName,
            pulumi.output(dockerConfig.httpPort),
            pulumi.output(dockerConfig.httpsPort),
            pulumi.output(echoRegistryUrl)
        ]).apply(([repoName, httpPort, httpsPort, registryUrl]) => {
            return this.generateUsageInstructions(repoName, httpPort, httpsPort, registryUrl);
        });
        
        // Register outputs
        this.registerOutputs({
            repository: this.repository,
            repositoryName: this.repositoryName,
            repositoryUrl: this.repositoryUrl,
            dockerPullCommand: this.dockerPullCommand,
            usageInstructions: this.usageInstructions
        });
    }
    
    private generateUsageInstructions(
        repositoryName: string, 
        httpPort: number | undefined, 
        httpsPort: number | undefined,
        echoRegistryUrl: string
    ): string {
        const port = httpPort || httpsPort || "";
        const portSuffix = port ? `:${port}` : "";
        const protocol = httpsPort ? "https" : "http";
        
        return `
🎉 Nexus Echo Integration Setup Complete!

Your Nexus instance is now configured to proxy Echo Registry images.

📦 How to Pull Echo Images through Nexus:
─────────────────────────────────────────────
Instead of pulling directly from Echo:
  docker pull ${echoRegistryUrl.replace('https://', '')}/nginx:latest

Pull through Nexus proxy repository:
  docker pull <your-nexus-host>${portSuffix}/${repositoryName}/nginx:latest

Example:
  docker pull nexus.example.com${portSuffix}/${repositoryName}/nginx:latest

🔐 Docker Login (if authentication is required):
  docker login nexus.example.com${portSuffix}

💡 Benefits:
- ⚡ Faster pulls (images cached locally in Nexus)
- 🔒 Enhanced security with Nexus access controls
- 📊 Better visibility and control over image usage
- 🛡️ Vulnerability scanning with Nexus Firewall (Pro)
- 📋 License analysis and compliance
- 🔄 Automatic cleanup policies to manage storage

⚠️  Important Notes:
1. The first pull will fetch from Echo and cache in Nexus
2. Subsequent pulls use the cached version
3. Nexus will respect cache TTL settings (default: 24 hours)
4. Configure cleanup policies to manage storage usage

🔧 Nexus Configuration:
- Repository Name: ${repositoryName}
- Repository Type: Docker (proxy)
- Remote URL: ${echoRegistryUrl}
${port ? `- Docker Port: ${port}` : '- Docker Port: Not configured (using default)'}
- Negative Cache: Enabled (24 hours)

📚 Additional Configuration:
You can configure additional Nexus features like:
- Cleanup policies for automatic storage management
- Content selectors for fine-grained access control
- Repository health checks
- Webhook notifications
- Repository replication (Pro)

🔗 Nexus Web UI:
Access your repository at: ${protocol}://<your-nexus-host>/repository/${repositoryName}/

Need help? Contact Echo support at support@echohq.com.
`;
    }
}

/**
 * Helper function to create Nexus integration with minimal configuration
 * 
 * @example
 * ```typescript
 * import { createNexusIntegration } from "@buildecho/pulumi-nexus-integration";
 * 
 * const integration = createNexusIntegration("echo-nexus", {
 *     echoAccessKeyName: "my-access-key",
 *     echoAccessKeyValue: pulumi.secret("my-access-key-value")
 * });
 * 
 * export const instructions = integration.usageInstructions;
 * ```
 */
export function createNexusIntegration(
    name: string,
    config: NexusIntegrationConfig,
    opts?: pulumi.ComponentResourceOptions
): NexusIntegrationOutputs {
    const integration = new NexusIntegration(name, config, opts);
    
    return {
        repository: integration.repository,
        repositoryName: integration.repositoryName,
        repositoryUrl: integration.repositoryUrl,
        dockerPullCommand: integration.dockerPullCommand,
        usageInstructions: integration.usageInstructions
    };
}

// Re-export nexus types that users might need
export { nexus }; 