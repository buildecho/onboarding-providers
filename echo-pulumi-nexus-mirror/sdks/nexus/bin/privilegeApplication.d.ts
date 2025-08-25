import * as pulumi from "@pulumi/pulumi";
export declare class PrivilegeApplication extends pulumi.CustomResource {
    /**
     * Get an existing PrivilegeApplication resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: PrivilegeApplicationState, opts?: pulumi.CustomResourceOptions): PrivilegeApplication;
    /**
     * Returns true if the given object is an instance of PrivilegeApplication.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is PrivilegeApplication;
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
     * A domain
     */
    readonly domain: pulumi.Output<string>;
    /**
     * The name of the privilege. This value cannot be changed.
     */
    readonly name: pulumi.Output<string>;
    /**
     * Create a PrivilegeApplication resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: PrivilegeApplicationArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering PrivilegeApplication resources.
 */
export interface PrivilegeApplicationState {
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
     * A domain
     */
    domain?: pulumi.Input<string>;
    /**
     * The name of the privilege. This value cannot be changed.
     */
    name?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a PrivilegeApplication resource.
 */
export interface PrivilegeApplicationArgs {
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
     * A domain
     */
    domain: pulumi.Input<string>;
    /**
     * The name of the privilege. This value cannot be changed.
     */
    name?: pulumi.Input<string>;
}
