import * as pulumi from "@pulumi/pulumi";
import * as harbor from "@pulumiverse/harbor";

/**
 * Configuration options for the Echo Harbor Integration
 */
export interface HarborIntegrationConfig {
    
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
     * Custom name for the Harbor registry resource
     * @default "echo-registry"
     */
    registryName?: string;
    
    /**
     * Custom name for the Harbor project
     * @default "echo"
     */
    projectName?: string;
    
    /**
     * Description for the Echo registry in Harbor
     * @default "Echo Registry"
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
    registryId?: pulumi.Output<number>;
    
    /**
     * The project name
     */
    projectName?: pulumi.Output<string>;
    
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
    public readonly registryId?: pulumi.Output<number>;
    public readonly projectName?: pulumi.Output<string>;
    public readonly usageInstructions: pulumi.Output<string>;
    
    constructor(name: string, config: HarborIntegrationConfig, opts?: pulumi.ComponentResourceOptions) {
        super("echo:harbor:Integration", name, {}, opts);
        
        // Set defaults
        const echoRegistryUrl = config.echoRegistryUrl || "https://reg.echohq.com";
        const registryName = config.registryName || "echo-registry";
        const projectName = config.projectName || "echo";
        const registryDescription = config.registryDescription || "Echo Registry";
        const projectPublic = config.projectPublic ?? false;
        const vulnerabilityScanning = config.vulnerabilityScanning ?? true;
        const enableContentTrust = config.enableContentTrust ?? false;
        const enableContentTrustCosign = config.enableContentTrustCosign ?? false;
        const autoSbomGeneration = config.autoSbomGeneration ?? false;
        
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
            this.projectName = pulumi.output(projectName);
            
            // Generate usage instructions
            this.usageInstructions = pulumi.all([
                this.projectName,
                pulumi.output(echoRegistryUrl)
            ]).apply(([proj, registryUrl]) => {
                return this.generateUsageInstructions(proj, registryUrl);
            });
        
        // Register outputs
        this.registerOutputs({
            registry: this.registry,
            project: this.project,
            registryId: this.registryId,
            projectName: this.projectName,
            usageInstructions: this.usageInstructions
        });
    }
    
    private generateUsageInstructions(projectName: string, echoRegistryUrl: string): string {
        return `
🎉 Harbor Echo Integration Setup Complete!

Your Harbor instance is now configured to proxy Echo Registry images.

📦 How to Pull Echo Images through Harbor:
─────────────────────────────────────────────
Instead of pulling directly from Echo:
  docker pull ${echoRegistryUrl.replace('https://', '')}/nginx:latest

Pull through Harbor proxy cache:
  docker pull <your-harbor-instance>/${projectName}/nginx:latest

Example:
  docker pull harbor.example.com/${projectName}/nginx:latest

💡 Benefits:
- ⚡ Faster pulls (images cached locally in Harbor)
- 🔒 Enhanced security with Harbor's scanning and policies
- 📊 Better visibility and control over image usage
- 🛡️ Vulnerability scanning with Harbor's integrated scanners
- 📋 SBOM generation for supply chain security
- 🔐 Content trust enforcement options

⚠️  Important Notes:
1. The first pull will fetch from Echo and cache in Harbor
2. Subsequent pulls use the cached version
3. Harbor will periodically check for updates
4. Configure Harbor's cleanup policies to manage storage

🔧 Harbor Configuration:
- Registry Name: echo-registry
- Project Name: ${projectName}
- Type: Proxy Cache Project

📚 Additional Configuration:
You can configure additional Harbor features like:
- Vulnerability scanning policies
- Content trust requirements
- Retention policies
- Webhook notifications
- Replication rules

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
        projectName: integration.projectName,
        usageInstructions: integration.usageInstructions
    };
}

// Re-export harbor types that users might need
export { harbor }; 