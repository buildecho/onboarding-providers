import * as pulumi from "@pulumi/pulumi";
export declare function getSecurityContentSelector(args: GetSecurityContentSelectorArgs, opts?: pulumi.InvokeOptions): Promise<GetSecurityContentSelectorResult>;
/**
 * A collection of arguments for invoking getSecurityContentSelector.
 */
export interface GetSecurityContentSelectorArgs {
    name: string;
}
/**
 * A collection of values returned by getSecurityContentSelector.
 */
export interface GetSecurityContentSelectorResult {
    readonly description: string;
    readonly expression: string;
    readonly id: string;
    readonly name: string;
}
export declare function getSecurityContentSelectorOutput(args: GetSecurityContentSelectorOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetSecurityContentSelectorResult>;
/**
 * A collection of arguments for invoking getSecurityContentSelector.
 */
export interface GetSecurityContentSelectorOutputArgs {
    name: pulumi.Input<string>;
}
