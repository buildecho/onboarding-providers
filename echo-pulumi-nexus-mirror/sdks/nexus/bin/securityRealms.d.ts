import * as pulumi from "@pulumi/pulumi";
export declare class SecurityRealms extends pulumi.CustomResource {
    /**
     * Get an existing SecurityRealms resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: SecurityRealmsState, opts?: pulumi.CustomResourceOptions): SecurityRealms;
    /**
     * Returns true if the given object is an instance of SecurityRealms.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is SecurityRealms;
    /**
     * Set the active security realms in the order they should be used.
     */
    readonly actives: pulumi.Output<string[]>;
    /**
     * Create a SecurityRealms resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: SecurityRealmsArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering SecurityRealms resources.
 */
export interface SecurityRealmsState {
    /**
     * Set the active security realms in the order they should be used.
     */
    actives?: pulumi.Input<pulumi.Input<string>[]>;
}
/**
 * The set of arguments for constructing a SecurityRealms resource.
 */
export interface SecurityRealmsArgs {
    /**
     * Set the active security realms in the order they should be used.
     */
    actives: pulumi.Input<pulumi.Input<string>[]>;
}
