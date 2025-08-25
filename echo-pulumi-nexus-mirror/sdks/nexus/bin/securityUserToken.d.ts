import * as pulumi from "@pulumi/pulumi";
export declare class SecurityUserToken extends pulumi.CustomResource {
    /**
     * Get an existing SecurityUserToken resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: SecurityUserTokenState, opts?: pulumi.CustomResourceOptions): SecurityUserToken;
    /**
     * Returns true if the given object is an instance of SecurityUserToken.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is SecurityUserToken;
    /**
     * Activate the feature of user tokens.
     */
    readonly enabled: pulumi.Output<boolean>;
    /**
     * Number of days for which you want user tokens to remain valid.
     */
    readonly expirationDays: pulumi.Output<number | undefined>;
    /**
     * Set user tokens expiration.
     */
    readonly expirationEnabled: pulumi.Output<boolean | undefined>;
    /**
     * Require user tokens for repository authentication. This does not effect UI access.
     */
    readonly protectContent: pulumi.Output<boolean | undefined>;
    /**
     * Create a SecurityUserToken resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: SecurityUserTokenArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering SecurityUserToken resources.
 */
export interface SecurityUserTokenState {
    /**
     * Activate the feature of user tokens.
     */
    enabled?: pulumi.Input<boolean>;
    /**
     * Number of days for which you want user tokens to remain valid.
     */
    expirationDays?: pulumi.Input<number>;
    /**
     * Set user tokens expiration.
     */
    expirationEnabled?: pulumi.Input<boolean>;
    /**
     * Require user tokens for repository authentication. This does not effect UI access.
     */
    protectContent?: pulumi.Input<boolean>;
}
/**
 * The set of arguments for constructing a SecurityUserToken resource.
 */
export interface SecurityUserTokenArgs {
    /**
     * Activate the feature of user tokens.
     */
    enabled: pulumi.Input<boolean>;
    /**
     * Number of days for which you want user tokens to remain valid.
     */
    expirationDays?: pulumi.Input<number>;
    /**
     * Set user tokens expiration.
     */
    expirationEnabled?: pulumi.Input<boolean>;
    /**
     * Require user tokens for repository authentication. This does not effect UI access.
     */
    protectContent?: pulumi.Input<boolean>;
}
