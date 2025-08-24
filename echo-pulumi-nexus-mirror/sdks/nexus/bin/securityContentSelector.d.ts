import * as pulumi from "@pulumi/pulumi";
export declare class SecurityContentSelector extends pulumi.CustomResource {
    /**
     * Get an existing SecurityContentSelector resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: SecurityContentSelectorState, opts?: pulumi.CustomResourceOptions): SecurityContentSelector;
    /**
     * Returns true if the given object is an instance of SecurityContentSelector.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is SecurityContentSelector;
    /**
     * A description of the content selector
     */
    readonly description: pulumi.Output<string | undefined>;
    /**
     * The content selector expression
     */
    readonly expression: pulumi.Output<string>;
    /**
     * Content selector name
     */
    readonly name: pulumi.Output<string>;
    /**
     * Create a SecurityContentSelector resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: SecurityContentSelectorArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering SecurityContentSelector resources.
 */
export interface SecurityContentSelectorState {
    /**
     * A description of the content selector
     */
    description?: pulumi.Input<string>;
    /**
     * The content selector expression
     */
    expression?: pulumi.Input<string>;
    /**
     * Content selector name
     */
    name?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a SecurityContentSelector resource.
 */
export interface SecurityContentSelectorArgs {
    /**
     * A description of the content selector
     */
    description?: pulumi.Input<string>;
    /**
     * The content selector expression
     */
    expression: pulumi.Input<string>;
    /**
     * Content selector name
     */
    name?: pulumi.Input<string>;
}
