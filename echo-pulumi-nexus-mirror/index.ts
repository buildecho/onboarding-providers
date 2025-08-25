import * as pulumi from "@pulumi/pulumi";
import * as nexus from "@pulumi/nexus";

/**
 * Configuration options for the Echo Nexus Integration
 */
export interface NexusIntegrationInput {
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
    dockerConfig?: pulumi.Input<{
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
    }>;
    
    /**
     * Type of Docker index (REGISTRY, HUB, or CUSTOM)
     * @default "REGISTRY"
     */
    dockerIndexType?: pulumi.Input<"REGISTRY" | "HUB" | "CUSTOM">;
    
    /**
     * URL of the Docker index (required if dockerIndexType is CUSTOM)
     */
    dockerIndexUrl?: string;
    
    /**
     * Storage configuration
     */
    storageConfig?: pulumi.Input<{
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
    }>;
    
    /**
     * Proxy configuration
     */
    proxyConfig?: pulumi.Input<{
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
    }>;
    
    /**
     * HTTP Client configuration
     */
    httpClientConfig?: pulumi.Input<{
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
    }>;
    
    /**
     * Negative cache configuration
     */
    negativeCacheConfig?: pulumi.Input<{
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
    }>;
    
    /**
     * Routing rule for this repository
     */
    routingRule?: pulumi.Input<string>;
    
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
     * The name of the repository
     */
    repositoryName: pulumi.Output<string>;
    
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
 * import { NexusIntegration } from "@buildecho/echo-pulumi-nexus-mirror";
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
 * export const instructions = nexusIntegration.usageInstructions;
 * ```
 */
export class NexusIntegration extends pulumi.ComponentResource {
    public readonly repository?: nexus.RepositoryDockerProxy;
    public readonly repositoryName: pulumi.Output<string>;
    public readonly usageInstructions: pulumi.Output<string>;
    
    constructor(name: string, args: NexusIntegrationInput, opts?: pulumi.ComponentResourceOptions) {
        super("echo-pulumi-nexus-mirror:index:NexusIntegration", name, args, opts);
        
        // Set defaults
        const echoRegistryUrl = args.echoRegistryUrl || "https://reg.echohq.com";
        const repositoryName = args.repositoryName || "echo";
        const repositoryOnline = args.repositoryOnline ?? true;
        
        // Docker defaults
        const dockerConfig = pulumi.all([args.dockerConfig]).apply(([dockerConfig]) => {
            return {
                forceBasicAuth: dockerConfig?.forceBasicAuth ?? true,
                httpPort: dockerConfig?.httpPort ?? 2524,
                httpsPort: dockerConfig?.httpsPort ?? 2525,
                v1Enabled: dockerConfig?.v1Enabled ?? false,
                subdomain: dockerConfig?.subdomain ?? "echo"
            };
        });
        
        // Storage defaults
        const storageConfig = pulumi.all([args.storageConfig]).apply(([storageConfig]) => {
            return {
                blobStoreName: storageConfig?.blobStoreName || "default",
                strictContentTypeValidation: storageConfig?.strictContentTypeValidation ?? true
            };
        });
        
        // Proxy defaults
        const proxyConfig = pulumi.all([args.proxyConfig]).apply(([proxyConfig]) => {
            return {
                contentMaxAge: proxyConfig?.contentMaxAge ?? 1440,
                metadataMaxAge: proxyConfig?.metadataMaxAge ?? 1440
            };
        });
        
        // HTTP Client defaults
        const httpClientConfig = pulumi.all([args.httpClientConfig]).apply(([httpClientConfig]) => {
            return {
            blocked: httpClientConfig?.blocked ?? false,
            autoBlock: httpClientConfig?.autoBlock ?? true,
            connection: {
                retries: httpClientConfig?.connection?.retries ?? 3,
                timeout: httpClientConfig?.connection?.timeout ?? 60,
                enableCircularRedirects: httpClientConfig?.connection?.enableCircularRedirects ?? false,
                enableCookies: httpClientConfig?.connection?.enableCookies ?? false,
                useTrustStore: httpClientConfig?.connection?.useTrustStore ?? false,
                userAgentSuffix: httpClientConfig?.connection?.userAgentSuffix ?? "echo-pulumi-nexus-mirror"
                }
            };
        });
        
        // Negative cache defaults
        const negativeCacheConfig = pulumi.all([args.negativeCacheConfig]).apply(([negativeCacheConfig]) => {
            return {
                enabled: negativeCacheConfig?.enabled ?? true,
                ttl: negativeCacheConfig?.ttl ?? 1440
            };
        });
        
        // Create Nexus Docker proxy repository
        this.repository = new nexus.RepositoryDockerProxy(`${name}-repository`, {
            name: repositoryName,
            online: repositoryOnline,
            
            // Docker configuration
            docker: {
                forceBasicAuth: dockerConfig?.forceBasicAuth,
                httpPort: dockerConfig?.httpPort,
                httpsPort: dockerConfig?.httpsPort,
                v1Enabled: dockerConfig?.v1Enabled,
                subdomain: dockerConfig?.subdomain
            },
            
            // Docker proxy index configuration
            dockerProxy: {
                indexType: args.dockerIndexType || "REGISTRY",
                indexUrl: args.dockerIndexUrl
            },
            
            // Storage configuration
            storage: {
                blobStoreName: storageConfig?.blobStoreName,
                strictContentTypeValidation: storageConfig?.strictContentTypeValidation
            },
            
            // Proxy configuration
            proxy: {
                remoteUrl: echoRegistryUrl,
                contentMaxAge: proxyConfig?.contentMaxAge,
                metadataMaxAge: proxyConfig?.metadataMaxAge
            },
            
            // HTTP client configuration
            httpClient: {
                blocked: httpClientConfig?.blocked,
                autoBlock: httpClientConfig?.autoBlock,
                
                // Connection settings
                connection: {
                    retries: httpClientConfig?.connection?.retries,
                    timeout: httpClientConfig?.connection?.timeout,
                    enableCircularRedirects: httpClientConfig?.connection?.enableCircularRedirects,
                    enableCookies: httpClientConfig?.connection?.enableCookies,
                    useTrustStore: httpClientConfig?.connection?.useTrustStore,
                    userAgentSuffix: httpClientConfig?.connection?.userAgentSuffix 
                },
                
                // Authentication
                authentication: {
                    type: "username",
                    username: args.echoAccessKeyName,
                    password: args.echoAccessKeyValue
                }
            },
            
            // Negative cache configuration
            negativeCache: {
                enabled: negativeCacheConfig?.enabled,
                ttl: negativeCacheConfig?.ttl
            },
            
            // Routing rule
            routingRule: args.routingRule
            
        }, { parent: this });
        
        this.repositoryName = pulumi.output(repositoryName);
        
        // Generate Docker pull command
        this.usageInstructions = pulumi.all([
            this.repositoryName,
            pulumi.output(dockerConfig.httpPort),
            pulumi.output(dockerConfig.httpsPort)
        ]).apply(([repoName, httpPort, httpsPort]) => {
            const port = httpPort || httpsPort || "";
            const portSuffix = port ? `:${port}` : "";
            return `docker pull <nexus-host>${portSuffix}/${repoName}/static:latest`;
        });
        
        
        // Register outputs
        this.registerOutputs({
            repositoryName: this.repositoryName,
            usageInstructions: this.usageInstructions
        });
    }
    
}
