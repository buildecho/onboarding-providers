import * as pulumi from "@pulumi/pulumi";
export declare function getPrivilegeWildcard(args: GetPrivilegeWildcardArgs, opts?: pulumi.InvokeOptions): Promise<GetPrivilegeWildcardResult>;
/**
 * A collection of arguments for invoking getPrivilegeWildcard.
 */
export interface GetPrivilegeWildcardArgs {
    name: string;
}
/**
 * A collection of values returned by getPrivilegeWildcard.
 */
export interface GetPrivilegeWildcardResult {
    readonly description: string;
    readonly id: string;
    readonly name: string;
    readonly pattern: string;
    readonly readonly: boolean;
}
export declare function getPrivilegeWildcardOutput(args: GetPrivilegeWildcardOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetPrivilegeWildcardResult>;
/**
 * A collection of arguments for invoking getPrivilegeWildcard.
 */
export interface GetPrivilegeWildcardOutputArgs {
    name: pulumi.Input<string>;
}
