import * as pulumi from "@pulumi/pulumi";
export declare class Script extends pulumi.CustomResource {
    /**
     * Get an existing Script resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: ScriptState, opts?: pulumi.CustomResourceOptions): Script;
    /**
     * Returns true if the given object is an instance of Script.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is Script;
    /**
     * The content of this script.
     */
    readonly content: pulumi.Output<string>;
    /**
     * The name of the script.
     */
    readonly name: pulumi.Output<string>;
    /**
     * The type of the script. Default: `groovy`
     */
    readonly type: pulumi.Output<string | undefined>;
    /**
     * Create a Script resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: ScriptArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering Script resources.
 */
export interface ScriptState {
    /**
     * The content of this script.
     */
    content?: pulumi.Input<string>;
    /**
     * The name of the script.
     */
    name?: pulumi.Input<string>;
    /**
     * The type of the script. Default: `groovy`
     */
    type?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a Script resource.
 */
export interface ScriptArgs {
    /**
     * The content of this script.
     */
    content: pulumi.Input<string>;
    /**
     * The name of the script.
     */
    name?: pulumi.Input<string>;
    /**
     * The type of the script. Default: `groovy`
     */
    type?: pulumi.Input<string>;
}
