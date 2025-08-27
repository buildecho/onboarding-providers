import * as pulumi from "@pulumi/pulumi";
import * as harbor from "@pulumiverse/harbor";

/**
 * Configuration options for the Echo Harbor Integration
 */
export interface HarborIntegrationInput {
    
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
    echoRegistryName?: string;
    
    /**
     * Custom name for the Harbor project
     * @default "echo"
     */
    cacheProjectName?: string;
    
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
 * import { HarborIntegration } from "@echo/pulumi-harbor-mirror";
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
    public readonly registryId?: pulumi.Output<number>;
    public readonly projectName?: pulumi.Output<string>;
    public readonly usageInstructions: pulumi.Output<string>;
    
    constructor(name: string, args: HarborIntegrationInput, opts?: pulumi.ComponentResourceOptions) {
        super("echo-pulumi-harbor-mirror:index:HarborIntegration", name, args, opts);
        
        // Set defaults
        const echoRegistryUrl = args.echoRegistryUrl || "https://reg.echohq.com";
        const registryName = args.echoRegistryName || "echo-registry";
        const projectName = args.cacheProjectName || "echo";
        const registryDescription = args.registryDescription || "Echo Registry";
        const projectPublic = args.projectPublic ?? false;
        const vulnerabilityScanning = args.vulnerabilityScanning ?? true;
        const enableContentTrust = args.enableContentTrust ?? false;
        const enableContentTrustCosign = args.enableContentTrustCosign ?? false;
        const autoSbomGeneration = args.autoSbomGeneration ?? false;
        
            // Create Harbor registry configuration for Echo
            const registry = new harbor.Registry(`${name}-registry`, {
                providerName: "docker-registry",
                endpointUrl: echoRegistryUrl,
                name: registryName,
                description: registryDescription,
                accessId: args.echoAccessKeyName,
                accessSecret: args.echoAccessKeyValue,
            }, { parent: this });
            
            // Create Harbor project as proxy cache
            const project = new harbor.Project(`${name}-project`, {
                name: projectName,
                registryId: registry.registryId,
                public: projectPublic,
                vulnerabilityScanning: vulnerabilityScanning,
                enableContentTrust: enableContentTrust,
                enableContentTrustCosign: enableContentTrustCosign,
                autoSbomGeneration: autoSbomGeneration,
            }, { parent: this, dependsOn: [registry] });
            
            this.registryId = registry.registryId;
            this.projectName = pulumi.output(projectName);

            const config = new pulumi.Config();
            const harborUrl = config.get("harbor:url");

            // one line docker pull command
            this.usageInstructions = pulumi.all([
                this.projectName,
            ]).apply(([proj]) => {
                return pulumi.interpolate`docker pull ${harborUrl ?? "<harbor-instance>"}/${proj}/static:latest`;
            });
        
        // Register outputs
        this.registerOutputs({
            registryId: this.registryId,
            projectName: this.projectName,
            usageInstructions: this.usageInstructions,
        });
    }
    
}
