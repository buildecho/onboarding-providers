import * as pulumi from "@pulumi/pulumi";
import * as nexus from "@pulumi/nexus";

export {RepositoryDockerProxy} from "@pulumi/nexus"


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
    echoAccessKeyName: pulumi.Input<string>;
    
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
     * Description for the repository
     * @default "Echo Registry mirror for container images"
     */
    description?: string;
    
    /**
     * HTTP port for Docker registry connector
     * @default 8082
     */
    httpPort?: number;
    
    /**
     * HTTPS port for Docker registry connector
     * @default 8083
     */
    httpsPort?: number;
    
    /**
     * Name of the blob store to use for repository storage
     * @default "default"
     */
    blobStoreName?: string;
    
    /**
     * Whether this repository should be online
     * @default true
     */
    repositoryOnline?: boolean;
    
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
 *     httpPort: 8082,
 *     httpsPort: 8083
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
        
        // Set defaults with Echo-focused simplicity
        const echoRegistryUrl = args.echoRegistryUrl || "https://reg.echohq.com";
        const repositoryName = args.repositoryName || "echo";
        const description = args.description || "Echo Registry mirror for container images";
        const httpPort = args.httpPort || 8082;
        const httpsPort = args.httpsPort || 8083;
        const blobStoreName = args.blobStoreName || "default";
        const repositoryOnline = args.repositoryOnline ?? true;
        
        // Create Nexus Docker proxy repository with sensible Echo-focused defaults
        this.repository = new nexus.RepositoryDockerProxy(`${name}-repository`, {
            name: repositoryName,
            online: repositoryOnline,
            
            // Docker configuration with Echo-optimized defaults
            docker: {
                forceBasicAuth: true,
                httpPort: httpPort,
                httpsPort: httpsPort,
                v1Enabled: false,
                subdomain: "echo"
            },
            
            // Docker proxy index configuration for registry
            dockerProxy: {
                indexType: "REGISTRY"
            },
            
            // Storage configuration
            storage: {
                blobStoreName: blobStoreName,
                strictContentTypeValidation: true
            },
            
            // Proxy configuration optimized for Echo registry
            proxy: {
                remoteUrl: echoRegistryUrl,
                contentMaxAge: 1440, // 24 hours
                metadataMaxAge: 1440 // 24 hours
            },
            
            // HTTP client configuration with Echo registry authentication
            httpClient: {
                blocked: false,
                autoBlock: true,
                
                // Connection settings optimized for Echo registry
                connection: {
                    retries: 3,
                    timeout: 60,
                    enableCircularRedirects: false,
                    enableCookies: false,
                    useTrustStore: false,
                    userAgentSuffix: "echo-pulumi-nexus-mirror"
                },
                
                // Echo registry authentication
                authentication: {
                    type: "username",
                    username: args.echoAccessKeyName,
                    password: args.echoAccessKeyValue
                }
            },
            
            // Negative cache configuration
            negativeCache: {
                enabled: true,
                ttl: 1440 // 24 hours
            }
            
        }, { parent: this });
        
        this.repositoryName = pulumi.output(repositoryName);
        
        // Generate simple Docker pull command
        this.usageInstructions = pulumi.output(
            `docker pull <nexus-host>:${httpPort}/${repositoryName}/<image>:<tag>`
        );
        
        // Register outputs
        this.registerOutputs({
            repositoryName: this.repositoryName,
            usageInstructions: this.usageInstructions
        });
    }
    
}
