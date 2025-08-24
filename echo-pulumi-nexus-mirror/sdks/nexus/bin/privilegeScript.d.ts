import * as pulumi from "@pulumi/pulumi";
export declare class PrivilegeScript extends pulumi.CustomResource {
    /**
     * Get an existing PrivilegeScript resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: PrivilegeScriptState, opts?: pulumi.CustomResourceOptions): PrivilegeScript;
    /**
     * Returns true if the given object is an instance of PrivilegeScript.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is PrivilegeScript;
    /**
     * A list of allowed actions. For a list of applicable values see
     * https://help.sonatype.com/repomanager3/nexus-repository-administration/access-control/privileges#Privileges-PrivilegeTypes
     */
    readonly actions: pulumi.Output<string[]>;
    /**
     * A description
     */
    readonly description: pulumi.Output<string | undefined>;
    /**
     * The name of the privilege. This value cannot be changed.
     */
    readonly name: pulumi.Output<string>;
    /**
     * The script Name
     */
    readonly scriptName: pulumi.Output<string>;
    /**
     * Create a PrivilegeScript resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: PrivilegeScriptArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering PrivilegeScript resources.
 */
export interface PrivilegeScriptState {
    /**
     * A list of allowed actions. For a list of applicable values see
     * https://help.sonatype.com/repomanager3/nexus-repository-administration/access-control/privileges#Privileges-PrivilegeTypes
     */
    actions?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * A description
     */
    description?: pulumi.Input<string>;
    /**
     * The name of the privilege. This value cannot be changed.
     */
    name?: pulumi.Input<string>;
    /**
     * The script Name
     */
    scriptName?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a PrivilegeScript resource.
 */
export interface PrivilegeScriptArgs {
    /**
     * A list of allowed actions. For a list of applicable values see
     * https://help.sonatype.com/repomanager3/nexus-repository-administration/access-control/privileges#Privileges-PrivilegeTypes
     */
    actions: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * A description
     */
    description?: pulumi.Input<string>;
    /**
     * The name of the privilege. This value cannot be changed.
     */
    name?: pulumi.Input<string>;
    /**
     * The script Name
     */
    scriptName: pulumi.Input<string>;
}
