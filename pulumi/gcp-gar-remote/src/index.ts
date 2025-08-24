import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

/**
 * Configuration options for the GCP Artifact Registry Remote Repository
 */
export interface GcpGarRemoteConfig {
    /**
     * Whether to create resources under this component
     * @default true
     */
    create?: boolean;

    /**
     * The GCP project ID where resources will be created
     */
    projectId: string;
    
    /**
     * The location for the Artifact Registry repository
     * @default "us-central1"
     */
    location?: string;
    
    /**
     * Repository name for cached images - This will be the name of your repository
     * @default "echo-mirror"
     */
    repositoryName?: string;
    
    /**
     * Echo access key name (username)
     */
    echoAccessKeyName: pulumi.Input<string>;
    
    /**
     * Echo access key value (password/token)
     */
    echoAccessKeyValue: pulumi.Input<string>;
    
    /**
     * Echo registry URL
     * @default "https://reg.echohq.com"
     */
    echoRegistryUrl?: string;
    
    /**
     * Description for the repository
     * @default "Remote repository for Echo Registry integration"
     */
    description?: string;
    
    /**
     * Custom secret name for the Echo access key. If not provided, defaults to '{repositoryName}-echo-access-key'
     */
    echoAccessKeySecretName?: string;
    
    /**
     * List of members who should have reader access to the repository
     * Format: "user:email@example.com", "serviceAccount:sa@project.iam.gserviceaccount.com", etc.
     */
    readerMembers?: string[];
    
    /**
     * List of members who should have writer access to the repository
     * Format: "user:email@example.com", "serviceAccount:sa@project.iam.gserviceaccount.com", etc.
     */
    writerMembers?: string[];
    
    /**
     * Additional labels to apply to created resources
     */
    labels?: Record<string, string>;
}

/**
 * Outputs from the GCP Artifact Registry Remote Repository component
 */
export interface GcpGarRemoteOutputs {
    /**
     * Repository name for cached images
     */
    repositoryName: pulumi.Output<string | undefined>;
    
    /**
     * The full repository name
     */
    repositoryFullName: pulumi.Output<string | undefined>;
    
    /**
     * The repository URL for pulling images
     */
    repositoryUrl: pulumi.Output<string | undefined>;
    
    /**
     * The secret name storing Echo credentials
     */
    secretName: pulumi.Output<string | undefined>;
    
    /**
     * The secret version name
     */
    secretVersionName: pulumi.Output<string | undefined>;

    /**
     * The location of the Artifact Registry repository
     */
    location: pulumi.Output<string | undefined>;

    /**
     * The GCP project ID where resources were created
     */
    projectId: pulumi.Output<string | undefined>;
    
    /**
     * Human-readable usage instructions
     */
    usageInstructions: pulumi.Output<string>;
    
    /**
     * The Artifact Registry repository resource
     */
    repository: gcp.artifactregistry.Repository | undefined;
    
    /**
     * The Secret Manager secret resource
     */
    secret: gcp.secretmanager.Secret | undefined;
}

/**
 * GCP Artifact Registry Remote Repository Component
 * 
 * This component sets up a GCP Artifact Registry remote repository that points to Echo's registry,
 * allowing you to pull Echo images through GCP's Artifact Registry.
 * 
 * @example
 * ```typescript
 * import { GcpGarRemote } from "@echo/pulumi-gcp-gar-remote";
 * 
 * const echoRemote = new GcpGarRemote("echo-remote", {
 *     projectId: "my-gcp-project",
 *     echoAccessKeyName: config.requireSecret("echoAccessKeyName"),
 *     echoAccessKeyValue: config.requireSecret("echoAccessKeyValue"),
 *     readerMembers: ["user:developer@example.com"]
 * });
 * 
 * export const repositoryUrl = echoRemote.repositoryUrl;
 * export const instructions = echoRemote.usageInstructions;
 * ```
 */
export class GcpGarRemote extends pulumi.ComponentResource {
    public readonly repositoryName: pulumi.Output<string | undefined>;
    public readonly repositoryFullName: pulumi.Output<string | undefined>;
    public readonly repositoryUrl: pulumi.Output<string | undefined>;
    public readonly secretName: pulumi.Output<string | undefined>;
    public readonly secretVersionName: pulumi.Output<string | undefined>;
    public readonly location: pulumi.Output<string | undefined>;
    public readonly projectId: pulumi.Output<string | undefined>;
    public readonly usageInstructions: pulumi.Output<string>;
    public readonly repository: gcp.artifactregistry.Repository | undefined;
    public readonly secret: gcp.secretmanager.Secret | undefined;
    
    constructor(name: string, config: GcpGarRemoteConfig, opts?: pulumi.ComponentResourceOptions) {
        super("echo:gcp:ArtifactRegistryRemote", name, {}, opts);
        
        // Set defaults
        const create = config.create ?? true;
        const location = config.location || "us-central1";
        const repositoryName = config.repositoryName || "echo-mirror";
        const echoRegistryUrl = config.echoRegistryUrl || "https://reg.echohq.com";
        const description = config.description || "Remote repository for Echo Registry integration";
        const echoAccessKeySecretName = config.echoAccessKeySecretName || `${repositoryName}-echo-access-key`;
        
        // Merge labels
        const defaultLabels = {
            "managed-by": "pulumi",
            "purpose": "echo-registry-integration",
            "component": "artifact-registry-remote"
        };
        const labels = { ...defaultLabels, ...config.labels };
        
        let project: any;
        
        if (create) {
            // Get current project info
            project = gcp.organizations.getProject({
                projectId: config.projectId,
            });
            
            // Create Secret Manager secret for Echo access key
            this.secret = new gcp.secretmanager.Secret(`${name}-echo-access-key`, {
                secretId: echoAccessKeySecretName,
                replication: {
                    auto: {},
                },
                labels: {
                    ...labels,
                    purpose: "echo-registry-authentication",
                },
                project: config.projectId,
            }, { parent: this });
            
            // Create secret version with the Echo access key value
            const echoAccessKeySecretVersion = new gcp.secretmanager.SecretVersion(`${name}-echo-access-key-version`, {
                secret: this.secret.id,
                secretData: config.echoAccessKeyValue,
            }, { parent: this });
            
            // Create Artifact Registry remote repository
            this.repository = new gcp.artifactregistry.Repository(`${name}-remote-repo`, {
                repositoryId: repositoryName,
                location: location,
                format: "DOCKER",
                mode: "REMOTE_REPOSITORY",
                description: description,
                remoteRepositoryConfig: {
                    description: "Remote repository pointing to Echo Registry (reg.echohq.com)",
                    dockerRepository: {
                        customRepository: {
                            uri: echoRegistryUrl,
                        },
                    },
                    upstreamCredentials: {
                        usernamePasswordCredentials: {
                            username: config.echoAccessKeyName,
                            passwordSecretVersion: echoAccessKeySecretVersion.name,
                        },
                    },
                },
                labels: labels,
                project: config.projectId,
            }, { parent: this });
            
            // Grant GAR service account access to the secret
            new gcp.secretmanager.SecretIamMember(`${name}-gar-secret-accessor`, {
                secretId: this.secret.secretId,
                role: "roles/secretmanager.secretAccessor",
                member: pulumi.interpolate`serviceAccount:service-${project.then(p => p.number)}@gcp-sa-artifactregistry.iam.gserviceaccount.com`,
                project: config.projectId,
            }, { parent: this });
            
            // Create IAM bindings for repository readers if specified
            if (config.readerMembers && config.readerMembers.length > 0) {
                new gcp.artifactregistry.RepositoryIamBinding(`${name}-readers`, {
                    repository: this.repository.name,
                    location: this.repository.location,
                    role: "roles/artifactregistry.reader",
                    members: config.readerMembers,
                    project: config.projectId,
                }, { parent: this });
            }
            
            // Create IAM bindings for repository writers if specified
            if (config.writerMembers && config.writerMembers.length > 0) {
                new gcp.artifactregistry.RepositoryIamBinding(`${name}-writers`, {
                    repository: this.repository.name,
                    location: this.repository.location,
                    role: "roles/artifactregistry.writer",
                    members: config.writerMembers,
                    project: config.projectId,
                }, { parent: this });
            }
            
            // Set outputs for created resources
            this.repositoryName = this.repository.repositoryId;
            this.repositoryFullName = this.repository.name;
            this.repositoryUrl = pulumi.interpolate`${location}-docker.pkg.dev/${config.projectId}/${this.repository.repositoryId}`;
            this.secretName = this.secret.secretId;
            this.secretVersionName = echoAccessKeySecretVersion.name;
            this.location = pulumi.output(location);
            this.projectId = pulumi.output(config.projectId);
            
            // Generate usage instructions
            this.usageInstructions = pulumi.interpolate`
🎉 Echo Registry Remote Repository Setup Complete!

Your Google Artifact Registry is now configured to proxy Echo images for improved performance and reduced data transfer costs.

📦 How to Pull Echo Images:
─────────────────────────────
Use your GAR remote repository instead of pulling directly from Echo registry:

  docker pull ${this.repositoryUrl}/<image-name>:<tag>

Example:
  docker pull ${this.repositoryUrl}/nginx:latest

💡 Benefits:
- ⚡ Faster image pulls (cached locally in your GCP region)
- 🔒 Enhanced security with GCP IAM access controls
- 📊 Better visibility into image usage through GCP Cloud Logging
- 🌍 Leverage GCP's global infrastructure for faster access
- 💰 Reduced data transfer costs

🔐 Authentication:
─────────────────
1. Configure Docker authentication with GCP:
   gcloud auth configure-docker ${location}-docker.pkg.dev

2. Ensure your account/service has appropriate permissions:
   - roles/artifactregistry.reader (to pull images)
   - roles/artifactregistry.writer (to push images, if needed)

📚 Additional Notes:
- The first pull will fetch from Echo and cache in your GAR
- Subsequent pulls use the cached version for faster performance
- Configure Artifact Registry cleanup policies to manage storage costs
- Enable vulnerability scanning for additional security
- Set up IAM policies to control access to your repository

🔧 Repository Configuration:
- Repository: ${repositoryName}
- Location: ${location}
- Format: Docker
- Mode: Remote Repository
- Upstream: ${echoRegistryUrl}

Need help? Contact Echo support at support@echohq.com.
`;
        } else {
            // Set empty outputs when create is false
            this.repositoryName = pulumi.output(undefined);
            this.repositoryFullName = pulumi.output(undefined);
            this.repositoryUrl = pulumi.output(undefined);
            this.secretName = pulumi.output(undefined);
            this.secretVersionName = pulumi.output(undefined);
            this.location = pulumi.output(undefined);
            this.projectId = pulumi.output(undefined);
            this.usageInstructions = pulumi.output("");
        }
        
        // Register outputs
        this.registerOutputs({
            repositoryName: this.repositoryName,
            repositoryFullName: this.repositoryFullName,
            repositoryUrl: this.repositoryUrl,
            secretName: this.secretName,
            secretVersionName: this.secretVersionName,
            location: this.location,
            projectId: this.projectId,
            usageInstructions: this.usageInstructions
        });
    }
}

/**
 * Helper function to create GCP Artifact Registry remote repository with minimal configuration
 * 
 * @example
 * ```typescript
 * import { createGcpGarRemote } from "@echo/pulumi-gcp-gar-remote";
 * 
 * const remote = createGcpGarRemote("echo-remote", {
 *     projectId: "my-gcp-project",
 *     echoAccessKeyName: config.requireSecret("echoAccessKeyName"),
 *     echoAccessKeyValue: config.requireSecret("echoAccessKeyValue")
 * });
 * ```
 */
export function createGcpGarRemote(
    name: string,
    config: GcpGarRemoteConfig,
    opts?: pulumi.ComponentResourceOptions
): GcpGarRemoteOutputs {
    const remote = new GcpGarRemote(name, config, opts);
    
    return {
        repositoryName: remote.repositoryName,
        repositoryFullName: remote.repositoryFullName,
        repositoryUrl: remote.repositoryUrl,
        secretName: remote.secretName,
        secretVersionName: remote.secretVersionName,
        location: remote.location,
        projectId: remote.projectId,
        usageInstructions: remote.usageInstructions,
        repository: remote.repository,
        secret: remote.secret
    };
}

// Re-export GCP types that users might need
export { gcp }; 