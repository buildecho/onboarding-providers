import * as pulumi from "@pulumi/pulumi";
import * as harbor from "@pulumiverse/harbor";

/**
 * Configuration options for the Echo Harbor Integration
 */
export interface HarborIntegrationConfig {
    /**
     * Whether to create resources under this component
     * @default true
     */
    create?: boolean;
    
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
     * Additional tags to apply to created resources
     */
    tags?: Record<string, string>;
    
    /**
     * Name for the Harbor registry resource
     * @default "echo-mirror-registry"
     */
    registryName?: string;
    
    /**
     * Name for the Harbor project  
     * @default "echo-mirror"
     */
    projectName?: string;
    
    /**
     * Description for the Echo registry in Harbor
     * @default "Echo Registry integration for container image caching"
     */
    registryDescription?: string;
    
    /**
     * Whether to make the project public
     * @default false
     */
    projectPublic?: boolean;
    
    /**
     * Enable vulnerability scanning for the project
     * @default true
     */
    vulnerabilityScanning?: boolean;
    
    /**
     * Enable content trust for the project
     * @default false
     */
    enableContentTrust?: boolean;
    
    /**
     * Enable content trust cosign for the project
     * @default false
     */
    enableContentTrustCosign?: boolean;
    
    /**
     * Automatically generate SBOM for images pushed to this project
     * @default false
     */
    autoSbomGeneration?: boolean;
}

/**
 * Outputs from the Harbor Integration component
 */
export interface HarborIntegrationOutputs {
    /**
     * The Harbor registry resource
     */
    registry?: harbor.Registry;
    
    /**
     * The Harbor project resource configured as proxy cache
     */
    project?: harbor.Project;
    
    /**
     * The registry ID for reference
     */
    registryId?: pulumi.Output<number | undefined>;
    
    /**
     * The registry name
     */
    registryName?: pulumi.Output<string | undefined>;
    
    /**
     * The project name
     */
    projectName?: pulumi.Output<string | undefined>;

    /**
     * The Echo registry URL being proxied
     */
    echoRegistryUrl?: pulumi.Output<string | undefined>;
    
    /**
     * Human-readable usage instructions
     */
    usageInstructions: pulumi.Output<string>;
}

/**
 * Echo Harbor Integration Component
 * 
 * This component configures Harbor to integrate with Echo Registry, enabling Harbor 
 * to act as a proxy cache for Echo container images.
 * 
 * @example
 * ```typescript
 * import { HarborIntegration } from "@echo/pulumi-harbor-integration";
 * 
 * const harborIntegration = new HarborIntegration("echo-harbor", {
 *     echoAccessKeyName: "my-echo-access-key",
 *     echoAccessKeyValue: pulumi.secret("my-echo-access-key-value")
 * });
 * 
 * export const projectName = harborIntegration.projectName;
 * export const instructions = harborIntegration.usageInstructions;
 * ```
 */
export class HarborIntegration extends pulumi.ComponentResource {
    public readonly registry?: harbor.Registry;
    public readonly project?: harbor.Project;
    public readonly registryId?: pulumi.Output<number | undefined>;
    public readonly registryName?: pulumi.Output<string | undefined>;
    public readonly projectName?: pulumi.Output<string | undefined>;
    public readonly echoRegistryUrl?: pulumi.Output<string | undefined>;
    public readonly usageInstructions: pulumi.Output<string>;
    
    constructor(name: string, config: HarborIntegrationConfig, opts?: pulumi.ComponentResourceOptions) {
        super("echo:harbor:Integration", name, {}, opts);
        
        // Set defaults
        const create = config.create ?? true;
        const echoRegistryUrl = config.echoRegistryUrl || "https://reg.echohq.com";
        const registryName = config.registryName || "echo-mirror-registry";
        const projectName = config.projectName || "echo-mirror";
        const registryDescription = config.registryDescription || "Echo Registry integration for container image caching";
        const projectPublic = config.projectPublic ?? false;
        const vulnerabilityScanning = config.vulnerabilityScanning ?? true;
        const enableContentTrust = config.enableContentTrust ?? false;
        const enableContentTrustCosign = config.enableContentTrustCosign ?? false;
        const autoSbomGeneration = config.autoSbomGeneration ?? false;
        
        if (create) {
            // Create Harbor registry configuration for Echo
            this.registry = new harbor.Registry(`${name}-registry`, {
                providerName: "docker-registry",
                endpointUrl: echoRegistryUrl,
                name: registryName,
                description: registryDescription,
                accessId: config.echoAccessKeyName,
                accessSecret: config.echoAccessKeyValue,
            }, { parent: this });
            
            // Create Harbor project as proxy cache
            this.project = new harbor.Project(`${name}-project`, {
                name: projectName,
                registryId: this.registry.registryId,
                public: projectPublic,
                vulnerabilityScanning: vulnerabilityScanning,
                enableContentTrust: enableContentTrust,
                enableContentTrustCosign: enableContentTrustCosign,
                autoSbomGeneration: autoSbomGeneration,
            }, { parent: this, dependsOn: [this.registry] });
            
            this.registryId = this.registry.registryId;
            this.registryName = pulumi.output(registryName);
            this.projectName = pulumi.output(projectName);
            this.echoRegistryUrl = pulumi.output(echoRegistryUrl);
            
            // Generate usage instructions
            this.usageInstructions = pulumi.all([
                this.projectName,
                this.echoRegistryUrl
            ]).apply(([proj, registryUrl]) => {
                return this.generateUsageInstructions(proj!, registryUrl!);
            });
        } else {
            // Set empty outputs when create is false
            this.registryId = pulumi.output(undefined);
            this.registryName = pulumi.output(undefined);
            this.projectName = pulumi.output(undefined);
            this.echoRegistryUrl = pulumi.output(undefined);
            this.usageInstructions = pulumi.output("");
        }
        
        // Register outputs
        this.registerOutputs({
            registry: this.registry,
            project: this.project,
            registryId: this.registryId,
            registryName: this.registryName,
            projectName: this.projectName,
            echoRegistryUrl: this.echoRegistryUrl,
            usageInstructions: this.usageInstructions
        });
    }
    
    private generateUsageInstructions(projectName: string, echoRegistryUrl: string): string {
        return `
🎉 Echo Registry Harbor Integration Setup Complete!

Your Harbor instance is now configured to proxy Echo Registry images for improved performance and enhanced security.

📦 How to Pull Echo Images through Harbor:
─────────────────────────────────────────────
Use your Harbor proxy cache instead of pulling directly from Echo registry:

  docker pull <your-harbor-instance>/${projectName}/<image-name>:<tag>

Example:
  docker pull harbor.example.com/${projectName}/nginx:latest

Instead of:
  docker pull ${echoRegistryUrl.replace('https://', '')}/nginx:latest

💡 Benefits:
- ⚡ Faster image pulls (cached locally in Harbor)
- 🔒 Enhanced security with Harbor's vulnerability scanning and policies
- 📊 Better visibility and control over image usage
- 🛡️ Comprehensive vulnerability scanning with Harbor's integrated scanners
- 📋 SBOM generation for supply chain security
- 🔐 Content trust enforcement options
- 💰 Reduced data transfer costs from upstream registry

🔐 Authentication:
─────────────────
1. Log in to your Harbor instance:
   docker login <your-harbor-instance>

2. Use your Harbor credentials or robot accounts for programmatic access

📚 Additional Notes:
- The first pull will fetch from Echo and cache in Harbor
- Subsequent pulls use the cached version for faster performance
- Configure Harbor's cleanup policies to manage storage
- Set up Harbor's replication rules for multi-registry scenarios
- Enable Harbor's webhook notifications for CI/CD integration

🔧 Harbor Configuration:
- Registry Name: ${registryName}
- Project Name: ${projectName}
- Project Type: Proxy Cache Project
- Upstream Registry: ${echoRegistryUrl}
- Vulnerability Scanning: Enabled
- Content Trust: ${this.project?.enableContentTrust ? 'Enabled' : 'Disabled'}
- SBOM Generation: ${this.project?.autoSbomGeneration ? 'Enabled' : 'Disabled'}

⚙️ Advanced Harbor Features:
You can configure additional Harbor features like:
- Custom vulnerability scanning policies
- Content trust requirements with Notary/Cosign
- Automated cleanup and retention policies
- Webhook notifications for image events
- Replication rules for multi-site deployments
- Robot accounts for service authentication
- LDAP/OIDC integration for user management

Need help? Contact Echo support at support@echohq.com.
`;
    }
}

/**
 * Helper function to create Harbor integration with minimal configuration
 * 
 * @example
 * ```typescript
 * import { createHarborIntegration } from "@echo/pulumi-harbor-integration";
 * 
 * const integration = createHarborIntegration("echo-harbor", {
 *     echoAccessKeyName: "my-access-key",
 *     echoAccessKeyValue: pulumi.secret("my-access-key-value")
 * });
 * 
 * export const instructions = integration.usageInstructions;
 * ```
 */
export function createHarborIntegration(
    name: string,
    config: HarborIntegrationConfig,
    opts?: pulumi.ComponentResourceOptions
): HarborIntegrationOutputs {
    const integration = new HarborIntegration(name, config, opts);
    
    return {
        registry: integration.registry,
        project: integration.project,
        registryId: integration.registryId,
        registryName: integration.registryName,
        projectName: integration.projectName,
        echoRegistryUrl: integration.echoRegistryUrl,
        usageInstructions: integration.usageInstructions
    };
}

// Re-export harbor types that users might need
export { harbor }; 