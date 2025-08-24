import * as pulumi from "@pulumi/pulumi";
export declare class SecurityUser extends pulumi.CustomResource {
    /**
     * Get an existing SecurityUser resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: SecurityUserState, opts?: pulumi.CustomResourceOptions): SecurityUser;
    /**
     * Returns true if the given object is an instance of SecurityUser.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is SecurityUser;
    /**
     * The email address associated with the user.
     */
    readonly email: pulumi.Output<string>;
    /**
     * The first name of the user.
     */
    readonly firstname: pulumi.Output<string>;
    /**
     * The last name of the user.
     */
    readonly lastname: pulumi.Output<string>;
    /**
     * The password for the user.
     */
    readonly password: pulumi.Output<string>;
    /**
     * The roles which the user has been assigned within Nexus.
     */
    readonly roles: pulumi.Output<string[] | undefined>;
    /**
     * The user's status, e.g. active or disabled.
     */
    readonly status: pulumi.Output<string | undefined>;
    /**
     * The userid which is required for login. This value cannot be changed.
     */
    readonly userid: pulumi.Output<string>;
    /**
     * Create a SecurityUser resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: SecurityUserArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering SecurityUser resources.
 */
export interface SecurityUserState {
    /**
     * The email address associated with the user.
     */
    email?: pulumi.Input<string>;
    /**
     * The first name of the user.
     */
    firstname?: pulumi.Input<string>;
    /**
     * The last name of the user.
     */
    lastname?: pulumi.Input<string>;
    /**
     * The password for the user.
     */
    password?: pulumi.Input<string>;
    /**
     * The roles which the user has been assigned within Nexus.
     */
    roles?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * The user's status, e.g. active or disabled.
     */
    status?: pulumi.Input<string>;
    /**
     * The userid which is required for login. This value cannot be changed.
     */
    userid?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a SecurityUser resource.
 */
export interface SecurityUserArgs {
    /**
     * The email address associated with the user.
     */
    email: pulumi.Input<string>;
    /**
     * The first name of the user.
     */
    firstname: pulumi.Input<string>;
    /**
     * The last name of the user.
     */
    lastname: pulumi.Input<string>;
    /**
     * The password for the user.
     */
    password: pulumi.Input<string>;
    /**
     * The roles which the user has been assigned within Nexus.
     */
    roles?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * The user's status, e.g. active or disabled.
     */
    status?: pulumi.Input<string>;
    /**
     * The userid which is required for login. This value cannot be changed.
     */
    userid: pulumi.Input<string>;
}
