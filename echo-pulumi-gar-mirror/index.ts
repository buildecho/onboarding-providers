import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

/**
 * Configuration options for the GCP Artifact Registry Remote Repository
 *
 * One component orchestrates the image (DOCKER) remote and the library
 * (PYTHON / NPM / MAVEN) remotes; each is provisioned only when its flag is
 * set. Images use the image access key, libraries share the library access key.
 * Credentials are stored in Secret Manager.
 */
export interface GcpGarRemoteInput {

    /**
     * The GCP project ID where resources will be created
     */
    projectId: string;

    /**
     * The location for the Artifact Registry repositories
     * @default "us-central1"
     */
    location?: string;

    /**
     * Base repository name. Per-format repositories derive from it
     * (<name>, <name>-pypi, <name>-npm, <name>-maven) unless overridden.
     * @default "echo"
     */
    repositoryName?: string;

    /**
     * Description for the repositories
     * @default "Remote repository for Echo Registry integration"
     */
    description?: string;

    // --- Images (container registry) ---

    /** Provision the Docker remote that proxies Echo's image registry. */
    echoImages?: boolean;

    /** Echo image access key name (username) for the Docker remote. */
    echoImageKeyName?: pulumi.Input<string>;

    /** Echo image access key value (password) for the Docker remote. */
    echoImageKeyValue?: pulumi.Input<string>;

    /** Optional override for the Docker remote repository id. Defaults to repositoryName. */
    echoImageRepositoryName?: string;

    /**
     * Echo image registry URL
     * @default "https://reg.echohq.com"
     */
    echoRegistryUrl?: string;

    /**
     * @deprecated Use echoImageKeyName. Kept for backwards compatibility with the
     * original image-only component; provisions the Docker remote when set.
     */
    echoAccessKeyName?: pulumi.Input<string>;

    /** @deprecated Use echoImageKeyValue. */
    echoAccessKeyValue?: pulumi.Input<string>;

    /**
     * Secret Manager secret name for the Echo image access key.
     * @default "echo-gar-mirror-secret"
     */
    echoAccessKeySecretName?: string;

    // --- Libraries (package registries), one shared library key ---

    /** Provision the PyPI (PYTHON) remote that proxies Echo's PyPI index. */
    echoLibraryPypi?: boolean;

    /** Provision the npm (NPM) remote that proxies Echo's npm index. */
    echoLibraryNpm?: boolean;

    /** Provision the Maven (MAVEN) remote that proxies Echo's Maven index. */
    echoLibraryMaven?: boolean;

    /** Echo library access key name (username) for the library remotes. */
    echoLibraryKeyName?: pulumi.Input<string>;

    /** Echo library access key value (password) for the library remotes. */
    echoLibraryKeyValue?: pulumi.Input<string>;

    /**
     * Secret Manager secret name for the Echo library access key.
     * @default "echo-gar-mirror-library-secret"
     */
    echoLibraryKeySecretName?: string;

    /** @default "https://pypi.echohq.com" */
    echoPypiUrl?: string;

    /** @default "https://npm.echohq.com" */
    echoNpmUrl?: string;

    /** @default "https://maven.echohq.com" */
    echoMavenUrl?: string;

    /** Optional override for the PyPI remote repository id. Defaults to <name>-pypi. */
    echoPypiRepositoryName?: string;

    /** Optional override for the npm remote repository id. Defaults to <name>-npm. */
    echoNpmRepositoryName?: string;

    /** Optional override for the Maven remote repository id. Defaults to <name>-maven. */
    echoMavenRepositoryName?: string;

    // --- IAM ---

    /**
     * List of members who should have reader access to the created repositories.
     * Format: "user:email@example.com", "serviceAccount:sa@project.iam.gserviceaccount.com", etc.
     */
    readerMembers?: string[];

    /**
     * List of members who should have writer access to the created repositories.
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
     * Repository id of the Docker (image) remote, or undefined if not created.
     */
    imageRepositoryKey: pulumi.Output<string | undefined>;

    /**
     * Repository ids of the library remotes that were created.
     */
    libraryRepositoryKeys: pulumi.Output<string[]>;

    /**
     * Multi-line usage instructions for the created repositories.
     */
    usageInstructions: pulumi.Output<string>;

    /**
     * @deprecated Use imageRepositoryKey. Repository id of the Docker (image)
     * remote, kept for backwards compatibility with the image-only module.
     */
    repositoryId: pulumi.Output<string | undefined>;

    /**
     * @deprecated Secret id of the Echo image access key secret, kept for
     * backwards compatibility with the image-only module.
     */
    secretId: pulumi.Output<string | undefined>;

    /**
     * @deprecated Full resource name of the image secret version, kept for
     * backwards compatibility with the image-only module.
     */
    secretVersionName: pulumi.Output<string | undefined>;
}

/**
 * GCP Artifact Registry Remote Repository Component
 *
 * Provisions GCP Artifact Registry remote repositories that proxy Echo — a
 * Docker remote for images and PYTHON/NPM/MAVEN remotes for libraries — based
 * on the inputs. Credentials are stored in Secret Manager.
 *
 * @example
 * ```typescript
 * import { GcpGarRemote } from "@buildecho/echo-pulumi-gar-mirror";
 *
 * const echoRemote = new GcpGarRemote("echo-remote", {
 *     projectId: "my-gcp-project",
 *     echoImages: true,
 *     echoImageKeyName: config.requireSecret("echoImageKeyName"),
 *     echoImageKeyValue: config.requireSecret("echoImageKeyValue"),
 *     echoLibraryPypi: true,
 *     echoLibraryKeyName: config.requireSecret("echoLibraryKeyName"),
 *     echoLibraryKeyValue: config.requireSecret("echoLibraryKeyValue"),
 * });
 *
 * export const usage = echoRemote.usageInstructions;
 * ```
 */
export class GcpGarRemote extends pulumi.ComponentResource {
    public readonly imageRepositoryKey: pulumi.Output<string | undefined>;
    public readonly libraryRepositoryKeys: pulumi.Output<string[]>;
    public readonly usageInstructions: pulumi.Output<string>;
    /** @deprecated Use imageRepositoryKey. */
    public readonly repositoryId: pulumi.Output<string | undefined>;
    /** @deprecated Image secret id, kept for backwards compatibility. */
    public readonly secretId: pulumi.Output<string | undefined>;
    /** @deprecated Image secret version name, kept for backwards compatibility. */
    public readonly secretVersionName: pulumi.Output<string | undefined>;

    constructor(name: string, args: GcpGarRemoteInput, opts?: pulumi.ComponentResourceOptions) {
        super("echo-pulumi-gar-mirror:index:GcpGarRemote", name, args, opts);

        // Set defaults
        const location = args.location || "us-central1";
        const repositoryName = args.repositoryName || "echo";
        const description = args.description || "Remote repository for Echo Registry integration";
        const imageSecretName = args.echoAccessKeySecretName || "echo-gar-mirror-secret";
        const librarySecretName = args.echoLibraryKeySecretName || "echo-gar-mirror-library-secret";

        const labels = { ...args.labels };

        // Get current project info
        const project = gcp.organizations.getProject({
            projectId: args.projectId,
        });

        const garServiceAccount = pulumi.interpolate`serviceAccount:service-${project.then(p => p.number)}@gcp-sa-artifactregistry.iam.gserviceaccount.com`;

        const createdRepositories: gcp.artifactregistry.Repository[] = [];
        const instructions: string[] = [];

        // --- Image (Docker) remote ---
        // Provision when explicitly enabled, or (legacy) when a deprecated access
        // key was supplied. Image key prefers the new field, falls back to access.
        const createDocker = args.echoImages === true || args.echoAccessKeyName !== undefined;
        if (createDocker) {
            const imageRepository = args.echoImageRepositoryName || repositoryName;

            // Create Secret Manager secret for the Echo image access key
            const secret = new gcp.secretmanager.Secret(`${name}-echo-access-key`, {
                secretId: imageSecretName,
                replication: {
                    auto: {},
                },
                labels: {
                    ...labels,
                    purpose: "echo-registry-authentication",
                },
                project: args.projectId,
            }, { parent: this });

            const echoAccessKeySecretVersion = new gcp.secretmanager.SecretVersion(`${name}-echo-access-key-version`, {
                secret: secret.id,
                secretData: args.echoImageKeyValue ?? args.echoAccessKeyValue ?? "",
            }, { parent: this });

            const repository = new gcp.artifactregistry.Repository(`${name}-remote-repo`, {
                repositoryId: imageRepository,
                location: location,
                format: "DOCKER",
                mode: "REMOTE_REPOSITORY",
                description: description,
                remoteRepositoryConfig: {
                    description: "Remote repository pointing to Echo Registry (reg.echohq.com)",
                    dockerRepository: {
                        customRepository: {
                            uri: args.echoRegistryUrl || "https://reg.echohq.com",
                        },
                    },
                    upstreamCredentials: {
                        usernamePasswordCredentials: {
                            username: args.echoImageKeyName ?? args.echoAccessKeyName ?? "",
                            passwordSecretVersion: echoAccessKeySecretVersion.name,
                        },
                    },
                },
                labels: labels,
                project: args.projectId,
            }, { parent: this });

            // Grant the GAR service account access to the image secret
            new gcp.secretmanager.SecretIamMember(`${name}-gar-secret-accessor`, {
                secretId: secret.secretId,
                role: "roles/secretmanager.secretAccessor",
                member: garServiceAccount,
                project: args.projectId,
            }, { parent: this });

            createdRepositories.push(repository);
            this.imageRepositoryKey = repository.repositoryId;
            this.repositoryId = repository.repositoryId;
            this.secretId = secret.secretId;
            this.secretVersionName = echoAccessKeySecretVersion.name;
            instructions.push(`Images:  docker pull ${location}-docker.pkg.dev/${args.projectId}/${imageRepository}/static:latest`);
        } else {
            this.imageRepositoryKey = pulumi.output(undefined);
            this.repositoryId = pulumi.output(undefined);
            this.secretId = pulumi.output(undefined);
            this.secretVersionName = pulumi.output(undefined);
        }

        // --- Library remotes (one shared library key) ---
        const createLibrary = args.echoLibraryPypi === true || args.echoLibraryNpm === true || args.echoLibraryMaven === true;
        const libraryRepositoryKeys: pulumi.Output<string>[] = [];

        if (createLibrary) {
            const librarySecret = new gcp.secretmanager.Secret(`${name}-echo-library-key`, {
                secretId: librarySecretName,
                replication: {
                    auto: {},
                },
                labels: {
                    ...labels,
                    purpose: "echo-library-authentication",
                },
                project: args.projectId,
            }, { parent: this });

            const librarySecretVersion = new gcp.secretmanager.SecretVersion(`${name}-echo-library-key-version`, {
                secret: librarySecret.id,
                secretData: args.echoLibraryKeyValue ?? "",
            }, { parent: this });

            // Grant the GAR service account access to the library secret
            new gcp.secretmanager.SecretIamMember(`${name}-gar-library-secret-accessor`, {
                secretId: librarySecret.secretId,
                role: "roles/secretmanager.secretAccessor",
                member: garServiceAccount,
                project: args.projectId,
            }, { parent: this });

            const libraryUpstreamCredentials = {
                usernamePasswordCredentials: {
                    username: args.echoLibraryKeyName ?? "",
                    passwordSecretVersion: librarySecretVersion.name,
                },
            };

            if (args.echoLibraryPypi) {
                const key = args.echoPypiRepositoryName || `${repositoryName}-pypi`;
                const repository = new gcp.artifactregistry.Repository(`${name}-pypi`, {
                    repositoryId: key,
                    location: location,
                    format: "PYTHON",
                    mode: "REMOTE_REPOSITORY",
                    description: description,
                    remoteRepositoryConfig: {
                        description: "Remote repository pointing to Echo PyPI (pypi.echohq.com)",
                        pythonRepository: {
                            customRepository: {
                                uri: args.echoPypiUrl || "https://pypi.echohq.com",
                            },
                        },
                        upstreamCredentials: libraryUpstreamCredentials,
                    },
                    labels: labels,
                    project: args.projectId,
                }, { parent: this });
                createdRepositories.push(repository);
                libraryRepositoryKeys.push(repository.repositoryId);
                instructions.push(`PyPI:    pip install --index-url https://${location}-python.pkg.dev/${args.projectId}/${key}/simple/ <package>`);
            }

            if (args.echoLibraryNpm) {
                const key = args.echoNpmRepositoryName || `${repositoryName}-npm`;
                const repository = new gcp.artifactregistry.Repository(`${name}-npm`, {
                    repositoryId: key,
                    location: location,
                    format: "NPM",
                    mode: "REMOTE_REPOSITORY",
                    description: description,
                    remoteRepositoryConfig: {
                        description: "Remote repository pointing to Echo npm (npm.echohq.com)",
                        npmRepository: {
                            customRepository: {
                                uri: args.echoNpmUrl || "https://npm.echohq.com",
                            },
                        },
                        upstreamCredentials: libraryUpstreamCredentials,
                    },
                    labels: labels,
                    project: args.projectId,
                }, { parent: this });
                createdRepositories.push(repository);
                libraryRepositoryKeys.push(repository.repositoryId);
                instructions.push(`npm:     npm install --registry https://${location}-npm.pkg.dev/${args.projectId}/${key}/ <package>`);
            }

            if (args.echoLibraryMaven) {
                const key = args.echoMavenRepositoryName || `${repositoryName}-maven`;
                const repository = new gcp.artifactregistry.Repository(`${name}-maven`, {
                    repositoryId: key,
                    location: location,
                    format: "MAVEN",
                    mode: "REMOTE_REPOSITORY",
                    description: description,
                    remoteRepositoryConfig: {
                        description: "Remote repository pointing to Echo Maven (maven.echohq.com)",
                        mavenRepository: {
                            customRepository: {
                                uri: args.echoMavenUrl || "https://maven.echohq.com",
                            },
                        },
                        upstreamCredentials: libraryUpstreamCredentials,
                    },
                    labels: labels,
                    project: args.projectId,
                }, { parent: this });
                createdRepositories.push(repository);
                libraryRepositoryKeys.push(repository.repositoryId);
                instructions.push(`Maven:   add https://${location}-maven.pkg.dev/${args.projectId}/${key} as a repository in your settings.xml`);
            }
        }

        // Create IAM bindings for repository readers/writers across all created
        // repos. The first repo (the image remote, index 0) keeps the unindexed
        // logical name it had in the image-only module so existing deployments
        // don't replace their bindings; additional repos are suffixed.
        const bindingSuffix = (i: number) => (i === 0 ? "" : `-${i}`);
        if (args.readerMembers && args.readerMembers.length > 0) {
            createdRepositories.forEach((repository, i) => {
                new gcp.artifactregistry.RepositoryIamBinding(`${name}-readers${bindingSuffix(i)}`, {
                    repository: repository.name,
                    location: repository.location,
                    role: "roles/artifactregistry.reader",
                    members: args.readerMembers!,
                    project: args.projectId,
                }, { parent: this });
            });
        }

        if (args.writerMembers && args.writerMembers.length > 0) {
            createdRepositories.forEach((repository, i) => {
                new gcp.artifactregistry.RepositoryIamBinding(`${name}-writers${bindingSuffix(i)}`, {
                    repository: repository.name,
                    location: repository.location,
                    role: "roles/artifactregistry.writer",
                    members: args.writerMembers!,
                    project: args.projectId,
                }, { parent: this });
            });
        }

        // Set outputs
        this.libraryRepositoryKeys = pulumi.all(libraryRepositoryKeys);
        this.usageInstructions = pulumi.output(instructions.join("\n"));

        // Register outputs
        this.registerOutputs({
            imageRepositoryKey: this.imageRepositoryKey,
            libraryRepositoryKeys: this.libraryRepositoryKeys,
            usageInstructions: this.usageInstructions,
            repositoryId: this.repositoryId,
            secretId: this.secretId,
            secretVersionName: this.secretVersionName,
        });
    }
}
