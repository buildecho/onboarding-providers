import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class RepositoryDockerGroup extends pulumi.CustomResource {
    /**
     * Get an existing RepositoryDockerGroup resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: RepositoryDockerGroupState, opts?: pulumi.CustomResourceOptions): RepositoryDockerGroup;
    /**
     * Returns true if the given object is an instance of RepositoryDockerGroup.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is RepositoryDockerGroup;
    /**
     * docker contains the configuration of the docker repository
     */
    readonly docker: pulumi.Output<outputs.RepositoryDockerGroupDocker>;
    /**
     * Configuration for repository group
     */
    readonly group: pulumi.Output<outputs.RepositoryDockerGroupGroup>;
    /**
     * A unique identifier for this repository
     */
    readonly name: pulumi.Output<string>;
    /**
     * Whether this repository accepts incoming requests
     */
    readonly online: pulumi.Output<boolean | undefined>;
    /**
     * The storage configuration of the repository
     */
    readonly storage: pulumi.Output<outputs.RepositoryDockerGroupStorage>;
    /**
     * Create a RepositoryDockerGroup resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: RepositoryDockerGroupArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering RepositoryDockerGroup resources.
 */
export interface RepositoryDockerGroupState {
    /**
     * docker contains the configuration of the docker repository
     */
    docker?: pulumi.Input<inputs.RepositoryDockerGroupDocker>;
    /**
     * Configuration for repository group
     */
    group?: pulumi.Input<inputs.RepositoryDockerGroupGroup>;
    /**
     * A unique identifier for this repository
     */
    name?: pulumi.Input<string>;
    /**
     * Whether this repository accepts incoming requests
     */
    online?: pulumi.Input<boolean>;
    /**
     * The storage configuration of the repository
     */
    storage?: pulumi.Input<inputs.RepositoryDockerGroupStorage>;
}
/**
 * The set of arguments for constructing a RepositoryDockerGroup resource.
 */
export interface RepositoryDockerGroupArgs {
    /**
     * docker contains the configuration of the docker repository
     */
    docker: pulumi.Input<inputs.RepositoryDockerGroupDocker>;
    /**
     * Configuration for repository group
     */
    group: pulumi.Input<inputs.RepositoryDockerGroupGroup>;
    /**
     * A unique identifier for this repository
     */
    name?: pulumi.Input<string>;
    /**
     * Whether this repository accepts incoming requests
     */
    online?: pulumi.Input<boolean>;
    /**
     * The storage configuration of the repository
     */
    storage: pulumi.Input<inputs.RepositoryDockerGroupStorage>;
}
