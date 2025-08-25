import * as pulumi from "@pulumi/pulumi";
export declare class PrivilegeWildcard extends pulumi.CustomResource {
    /**
     * Get an existing PrivilegeWildcard resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: PrivilegeWildcardState, opts?: pulumi.CustomResourceOptions): PrivilegeWildcard;
    /**
     * Returns true if the given object is an instance of PrivilegeWildcard.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is PrivilegeWildcard;
    /**
     * A description
     */
    readonly description: pulumi.Output<string | undefined>;
    /**
     * The name of the privilege. This value cannot be changed.
     */
    readonly name: pulumi.Output<string>;
    /**
     * The privilege pattern
     */
    readonly pattern: pulumi.Output<string | undefined>;
    /**
     * Create a PrivilegeWildcard resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: PrivilegeWildcardArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering PrivilegeWildcard resources.
 */
export interface PrivilegeWildcardState {
    /**
     * A description
     */
    description?: pulumi.Input<string>;
    /**
     * The name of the privilege. This value cannot be changed.
     */
    name?: pulumi.Input<string>;
    /**
     * The privilege pattern
     */
    pattern?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a PrivilegeWildcard resource.
 */
export interface PrivilegeWildcardArgs {
    /**
     * A description
     */
    description?: pulumi.Input<string>;
    /**
     * The name of the privilege. This value cannot be changed.
     */
    name?: pulumi.Input<string>;
    /**
     * The privilege pattern
     */
    pattern?: pulumi.Input<string>;
}
