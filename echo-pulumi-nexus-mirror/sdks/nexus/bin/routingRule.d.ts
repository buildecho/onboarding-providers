import * as pulumi from "@pulumi/pulumi";
export declare class RoutingRule extends pulumi.CustomResource {
    /**
     * Get an existing RoutingRule resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: RoutingRuleState, opts?: pulumi.CustomResourceOptions): RoutingRule;
    /**
     * Returns true if the given object is an instance of RoutingRule.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is RoutingRule;
    /**
     * The description of the routing rule
     */
    readonly description: pulumi.Output<string | undefined>;
    /**
     * Matchers is a list of regular expressions used to identify request paths that are allowed or blocked (depending on above
     * mode)
     */
    readonly matchers: pulumi.Output<string[]>;
    /**
     * The mode describe how to hande with mathing requests. Possible values: `BLOCK` or `ALLOW` Default: `BLOCK`
     */
    readonly mode: pulumi.Output<string | undefined>;
    /**
     * The name of the routing rule
     */
    readonly name: pulumi.Output<string>;
    /**
     * Create a RoutingRule resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: RoutingRuleArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering RoutingRule resources.
 */
export interface RoutingRuleState {
    /**
     * The description of the routing rule
     */
    description?: pulumi.Input<string>;
    /**
     * Matchers is a list of regular expressions used to identify request paths that are allowed or blocked (depending on above
     * mode)
     */
    matchers?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * The mode describe how to hande with mathing requests. Possible values: `BLOCK` or `ALLOW` Default: `BLOCK`
     */
    mode?: pulumi.Input<string>;
    /**
     * The name of the routing rule
     */
    name?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a RoutingRule resource.
 */
export interface RoutingRuleArgs {
    /**
     * The description of the routing rule
     */
    description?: pulumi.Input<string>;
    /**
     * Matchers is a list of regular expressions used to identify request paths that are allowed or blocked (depending on above
     * mode)
     */
    matchers: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * The mode describe how to hande with mathing requests. Possible values: `BLOCK` or `ALLOW` Default: `BLOCK`
     */
    mode?: pulumi.Input<string>;
    /**
     * The name of the routing rule
     */
    name?: pulumi.Input<string>;
}
