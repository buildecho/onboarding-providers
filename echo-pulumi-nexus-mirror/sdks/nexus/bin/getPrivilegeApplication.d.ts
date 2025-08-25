import * as pulumi from "@pulumi/pulumi";
export declare function getPrivilegeApplication(args: GetPrivilegeApplicationArgs, opts?: pulumi.InvokeOptions): Promise<GetPrivilegeApplicationResult>;
/**
 * A collection of arguments for invoking getPrivilegeApplication.
 */
export interface GetPrivilegeApplicationArgs {
    name: string;
}
/**
 * A collection of values returned by getPrivilegeApplication.
 */
export interface GetPrivilegeApplicationResult {
    readonly actions: string[];
    readonly description: string;
    readonly domain: string;
    readonly id: string;
    readonly name: string;
    readonly readonly: boolean;
}
export declare function getPrivilegeApplicationOutput(args: GetPrivilegeApplicationOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetPrivilegeApplicationResult>;
/**
 * A collection of arguments for invoking getPrivilegeApplication.
 */
export interface GetPrivilegeApplicationOutputArgs {
    name: pulumi.Input<string>;
}
