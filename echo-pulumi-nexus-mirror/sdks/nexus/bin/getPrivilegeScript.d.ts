import * as pulumi from "@pulumi/pulumi";
export declare function getPrivilegeScript(args: GetPrivilegeScriptArgs, opts?: pulumi.InvokeOptions): Promise<GetPrivilegeScriptResult>;
/**
 * A collection of arguments for invoking getPrivilegeScript.
 */
export interface GetPrivilegeScriptArgs {
    name: string;
}
/**
 * A collection of values returned by getPrivilegeScript.
 */
export interface GetPrivilegeScriptResult {
    readonly actions: string[];
    readonly description: string;
    readonly id: string;
    readonly name: string;
    readonly readonly: boolean;
    readonly scriptName: string;
}
export declare function getPrivilegeScriptOutput(args: GetPrivilegeScriptOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetPrivilegeScriptResult>;
/**
 * A collection of arguments for invoking getPrivilegeScript.
 */
export interface GetPrivilegeScriptOutputArgs {
    name: pulumi.Input<string>;
}
