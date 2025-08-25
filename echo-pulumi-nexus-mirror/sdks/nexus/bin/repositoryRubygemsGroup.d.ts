import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class RepositoryRubygemsGroup extends pulumi.CustomResource {
    /**
     * Get an existing RepositoryRubygemsGroup resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: RepositoryRubygemsGroupState, opts?: pulumi.CustomResourceOptions): RepositoryRubygemsGroup;
    /**
     * Returns true if the given object is an instance of RepositoryRubygemsGroup.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is RepositoryRubygemsGroup;
    /**
     * Configuration for repository group
     */
    readonly group: pulumi.Output<outputs.RepositoryRubygemsGroupGroup>;
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
    readonly storage: pulumi.Output<outputs.RepositoryRubygemsGroupStorage>;
    /**
     * Create a RepositoryRubygemsGroup resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: RepositoryRubygemsGroupArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering RepositoryRubygemsGroup resources.
 */
export interface RepositoryRubygemsGroupState {
    /**
     * Configuration for repository group
     */
    group?: pulumi.Input<inputs.RepositoryRubygemsGroupGroup>;
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
    storage?: pulumi.Input<inputs.RepositoryRubygemsGroupStorage>;
}
/**
 * The set of arguments for constructing a RepositoryRubygemsGroup resource.
 */
export interface RepositoryRubygemsGroupArgs {
    /**
     * Configuration for repository group
     */
    group: pulumi.Input<inputs.RepositoryRubygemsGroupGroup>;
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
    storage: pulumi.Input<inputs.RepositoryRubygemsGroupStorage>;
}
