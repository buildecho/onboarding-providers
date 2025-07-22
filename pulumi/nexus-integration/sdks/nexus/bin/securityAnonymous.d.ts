import * as pulumi from "@pulumi/pulumi";
export declare class SecurityAnonymous extends pulumi.CustomResource {
    /**
     * Get an existing SecurityAnonymous resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: SecurityAnonymousState, opts?: pulumi.CustomResourceOptions): SecurityAnonymous;
    /**
     * Returns true if the given object is an instance of SecurityAnonymous.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is SecurityAnonymous;
    /**
     * Activate the anonymous access to the repository manager. Default: false
     */
    readonly enabled: pulumi.Output<boolean | undefined>;
    /**
     * The name of the used realm. Default: "NexusAuthorizingRealm"
     */
    readonly realmName: pulumi.Output<string | undefined>;
    /**
     * The user id used by anonymous access. Default: "anonymous"
     */
    readonly userId: pulumi.Output<string | undefined>;
    /**
     * Create a SecurityAnonymous resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: SecurityAnonymousArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering SecurityAnonymous resources.
 */
export interface SecurityAnonymousState {
    /**
     * Activate the anonymous access to the repository manager. Default: false
     */
    enabled?: pulumi.Input<boolean>;
    /**
     * The name of the used realm. Default: "NexusAuthorizingRealm"
     */
    realmName?: pulumi.Input<string>;
    /**
     * The user id used by anonymous access. Default: "anonymous"
     */
    userId?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a SecurityAnonymous resource.
 */
export interface SecurityAnonymousArgs {
    /**
     * Activate the anonymous access to the repository manager. Default: false
     */
    enabled?: pulumi.Input<boolean>;
    /**
     * The name of the used realm. Default: "NexusAuthorizingRealm"
     */
    realmName?: pulumi.Input<string>;
    /**
     * The user id used by anonymous access. Default: "anonymous"
     */
    userId?: pulumi.Input<string>;
}
