import * as pulumi from "@pulumi/pulumi";
export declare function getRoutingRule(args: GetRoutingRuleArgs, opts?: pulumi.InvokeOptions): Promise<GetRoutingRuleResult>;
/**
 * A collection of arguments for invoking getRoutingRule.
 */
export interface GetRoutingRuleArgs {
    name: string;
}
/**
 * A collection of values returned by getRoutingRule.
 */
export interface GetRoutingRuleResult {
    readonly description: string;
    readonly id: string;
    readonly matchers: string[];
    readonly mode: string;
    readonly name: string;
}
export declare function getRoutingRuleOutput(args: GetRoutingRuleOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRoutingRuleResult>;
/**
 * A collection of arguments for invoking getRoutingRule.
 */
export interface GetRoutingRuleOutputArgs {
    name: pulumi.Input<string>;
}
