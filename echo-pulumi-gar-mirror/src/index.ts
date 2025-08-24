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
     * The repository ID
     */
    repositoryId: pulumi.Output<string>;
    
    /**
     * The full repository name
     */
    repositoryName: pulumi.Output<string>;
    
    /**
     * The repository URL for pulling images
     */
    repositoryUrl: pulumi.Output<string>;
    
    /**
     * The secret ID storing Echo credentials
     */
    secretId: pulumi.Output<string>;
    
    /**
     * The secret version name
     */
    secretVersionName: pulumi.Output<string>;
    
    /**
     * Docker login command for this repository
     */
    dockerLoginCommand: pulumi.Output<string>;
    
    /**
     * Example docker pull command
     */
    dockerPullExample: pulumi.Output<string>;
    
    /**
     * Human-readable summary of what was created
     */
    summary: pulumi.Output<string>;
    
    /**
     * The Artifact Registry repository resource
     */
    repository: gcp.artifactregistry.Repository;
    
    /**
     * The Secret Manager secret resource
     */
    secret: gcp.secretmanager.Secret;
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
 * export const dockerPullExample = echoRemote.dockerPullExample;
 * ```
 */
export class GcpGarRemote extends pulumi.ComponentResource {
    public readonly repositoryId: pulumi.Output<string>;
    public readonly repositoryName: pulumi.Output<string>;
    public readonly repositoryUrl: pulumi.Output<string>;
    public readonly secretId: pulumi.Output<string>;
    public readonly secretVersionName: pulumi.Output<string>;
    public readonly dockerLoginCommand: pulumi.Output<string>;
    public readonly dockerPullExample: pulumi.Output<string>;
    public readonly summary: pulumi.Output<string>;
    public readonly repository: gcp.artifactregistry.Repository;
    public readonly secret: gcp.secretmanager.Secret;
    
    constructor(name: string, config: GcpGarRemoteConfig, opts?: pulumi.ComponentResourceOptions) {
        super("echo:gcp:ArtifactRegistryRemote", name, {}, opts);
        
        // Set defaults
        const location = config.location || "us-central1";
        const cacheRepositoryName = config.repositoryName || "echo-mirror";
        const echoRegistryUrl = config.echoRegistryUrl || "https://reg.echohq.com";
        const description = config.description || "Remote repository for Echo Registry integration";
        
        // Merge labels
        const defaultLabels = {
            "managed-by": "pulumi",
            "integration": "echo-registry",
            "remote-type": "custom",
            "component": name
        };
        const labels = { ...defaultLabels, ...config.labels };
        
        // Get current project info
        const project = gcp.organizations.getProject({
            projectId: config.projectId,
        });
        
        // Create Secret Manager secret for Echo access key
        this.secret = new gcp.secretmanager.Secret(`${name}-echo-access-key`, {
            secretId: `${cacheRepositoryName}-echo-access-key`,
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
            repositoryId: cacheRepositoryName,
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
        const garSecretAccessor = new gcp.secretmanager.SecretIamMember(`${name}-gar-secret-accessor`, {
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
        
        // Set outputs
        this.repositoryId = this.repository.repositoryId;
        this.repositoryName = this.repository.name;
        this.repositoryUrl = pulumi.interpolate`${location}-docker.pkg.dev/${config.projectId}/${this.repository.repositoryId}`;
        this.secretId = this.secret.secretId;
        this.secretVersionName = echoAccessKeySecretVersion.name;
        this.dockerLoginCommand = pulumi.interpolate`gcloud auth configure-docker ${location}-docker.pkg.dev`;
        this.dockerPullExample = pulumi.interpolate`docker pull ${this.repositoryUrl}/<echo-image-name>:<tag>`;
        
        // Generate summary
        this.summary = pulumi.interpolate`
🎉 GCP Artifact Registry Remote Repository Setup Complete!

Your Artifact Registry is now configured to proxy Echo images.

📦 Repository Details:
─────────────────────────────
Repository: ${this.repositoryName}
URL: ${this.repositoryUrl}
Secret: ${this.secretId}
Location: ${location}

🔐 Authentication:
─────────────────
1. Authenticate Docker with GCP:
   ${this.dockerLoginCommand}

2. Pull Echo images through GCP:
   ${this.dockerPullExample}

💡 Benefits:
- 🔒 Enhanced security with GCP IAM controls
- 📊 Unified image management in GCP
- 🚀 Leverage GCP's global infrastructure
- 📈 Integrated with GCP monitoring and logging

⚠️  Important: Ensure your GCP credentials have the necessary permissions:
- roles/artifactregistry.reader (to pull images)
- roles/artifactregistry.writer (to push images)

Need help? Contact Echo support at support@echohq.com.
`;
        
        // Register outputs
        this.registerOutputs({
            repositoryId: this.repositoryId,
            repositoryName: this.repositoryName,
            repositoryUrl: this.repositoryUrl,
            secretId: this.secretId,
            secretVersionName: this.secretVersionName,
            dockerLoginCommand: this.dockerLoginCommand,
            dockerPullExample: this.dockerPullExample,
            summary: this.summary
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
        repositoryId: remote.repositoryId,
        repositoryName: remote.repositoryName,
        repositoryUrl: remote.repositoryUrl,
        secretId: remote.secretId,
        secretVersionName: remote.secretVersionName,
        dockerLoginCommand: remote.dockerLoginCommand,
        dockerPullExample: remote.dockerPullExample,
        summary: remote.summary,
        repository: remote.repository,
        secret: remote.secret
    };
}

// Re-export GCP types that users might need
export { gcp }; 
