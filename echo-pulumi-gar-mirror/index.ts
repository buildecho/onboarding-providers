import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

/**
 * Configuration options for the GCP Artifact Registry Remote Repository
 */
export interface GcpGarRemoteInput {

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
     * @default "echo"
     */
    cacheRepositoryName?: string;
    
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
     * Name for the secret that will be created.
     * @default "echo-gar-mirror-secret"
     */
    accessKeySecretName?: string;
    
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
     * The secret ID storing Echo credentials
     */
    secretId: pulumi.Output<string>;
    
    /**
     * The secret version name
     */
    secretVersionName: pulumi.Output<string>;
    
    /**
     * Single-line usage instructions
     */
    usageInstructions: pulumi.Output<string>;
}

/**
 * GCP Artifact Registry Remote Repository Component
 * 
 * This component sets up a GCP Artifact Registry remote repository that points to Echo's registry,
 * allowing you to pull Echo images through GCP's Artifact Registry.
 * 
 * @example
 * ```typescript
 * import { GcpGarRemote } from "@buildecho/echo-pulumi-gar-mirror";
 * 
 * const echoRemote = new GcpGarRemote("echo-remote", {
 *     projectId: "my-gcp-project",
 *     echoAccessKeyName: config.requireSecret("echoAccessKeyName"),
 *     echoAccessKeyValue: config.requireSecret("echoAccessKeyValue"),
 *     readerMembers: ["user:developer@example.com"]
 * });
 * 
 * export const usage = echoRemote.usageInstructions;
 * ```
 */
export class GcpGarRemote extends pulumi.ComponentResource {
    public readonly repositoryId: pulumi.Output<string>;
    public readonly secretId: pulumi.Output<string>;
    public readonly secretVersionName: pulumi.Output<string>;
    public readonly usageInstructions: pulumi.Output<string>;
    
    constructor(name: string, args: GcpGarRemoteInput, opts?: pulumi.ComponentResourceOptions) {
        super("echo-pulumi-gar-mirror:index:GcpGarRemote", name, args, opts);
        
        // Set defaults
        const location = args.location || "us-central1";
        const cacheRepositoryName = args.cacheRepositoryName || "echo";
        const echoRegistryUrl = args.echoRegistryUrl || "https://reg.echohq.com";
        const description = args.description || "Remote repository for Echo Registry integration";
        const secretName = args.accessKeySecretName || "echo-gar-mirror-secret";
        
        const labels = { ...args.labels };
        
        // Get current project info
        const project = gcp.organizations.getProject({
            projectId: args.projectId,
        });
        
        // Create Secret Manager secret for Echo access key
        const secret = new gcp.secretmanager.Secret(`${name}-echo-access-key`, {
            secretId: secretName,
            replication: {
                auto: {},
            },
            labels: {
                ...labels,
                purpose: "echo-registry-authentication",
            },
            project: args.projectId,
        }, { parent: this });
        
        // Create secret version with the Echo access key value
        const echoAccessKeySecretVersion = new gcp.secretmanager.SecretVersion(`${name}-echo-access-key-version`, {
            secret: secret.id,
            secretData: args.echoAccessKeyValue,
        }, { parent: this });
        
        // Create Artifact Registry remote repository
        const repository = new gcp.artifactregistry.Repository(`${name}-remote-repo`, {
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
                        username: args.echoAccessKeyName,
                        passwordSecretVersion: echoAccessKeySecretVersion.name,
                    },
                },
            },
            labels: labels,
            project: args.projectId,
        }, { parent: this });
        
        // Grant GAR service account access to the secret
         new gcp.secretmanager.SecretIamMember(`${name}-gar-secret-accessor`, {
            secretId: secret.secretId,
            role: "roles/secretmanager.secretAccessor",
            member: pulumi.interpolate`serviceAccount:service-${project.then(p => p.number)}@gcp-sa-artifactregistry.iam.gserviceaccount.com`,
            project: args.projectId,
        }, { parent: this });
        
        // Create IAM bindings for repository readers if specified
        if (args.readerMembers && args.readerMembers.length > 0) {
            new gcp.artifactregistry.RepositoryIamBinding(`${name}-readers`, {
                repository: repository.name,
                location: repository.location,
                role: "roles/artifactregistry.reader",
                members: args.readerMembers,
                project: args.projectId,
            }, { parent: this });
        }
        
        // Create IAM bindings for repository writers if specified
        if (args.writerMembers && args.writerMembers.length > 0) {
            new gcp.artifactregistry.RepositoryIamBinding(`${name}-writers`, {
                repository: repository.name,
                location: repository.location,
                role: "roles/artifactregistry.writer",
                members: args.writerMembers,
                project: args.projectId,
            }, { parent: this });
        }

        const repositoryUrl = pulumi.interpolate`${location}-docker.pkg.dev/${args.projectId}/${repository.repositoryId}`;
        
        // Set outputs
        this.repositoryId = repository.repositoryId;
        this.secretId = secret.secretId;
        this.secretVersionName = echoAccessKeySecretVersion.name;
        this.usageInstructions = pulumi.interpolate`docker pull ${repositoryUrl}/static:latest`;
        
        // Register outputs
        this.registerOutputs({
            repositoryId: this.repositoryId,
            secretId: this.secretId,
            secretVersionName: this.secretVersionName,
            usageInstructions: this.usageInstructions,
        });
    }
}
