import * as pulumi from "@pulumi/pulumi";
export declare function getSecurityRole(args: GetSecurityRoleArgs, opts?: pulumi.InvokeOptions): Promise<GetSecurityRoleResult>;
/**
 * A collection of arguments for invoking getSecurityRole.
 */
export interface GetSecurityRoleArgs {
    roleid: string;
}
/**
 * A collection of values returned by getSecurityRole.
 */
export interface GetSecurityRoleResult {
    readonly description: string;
    readonly id: string;
    readonly name: string;
    readonly privileges: string[];
    readonly roleid: string;
    readonly roles: string[];
}
export declare function getSecurityRoleOutput(args: GetSecurityRoleOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetSecurityRoleResult>;
/**
 * A collection of arguments for invoking getSecurityRole.
 */
export interface GetSecurityRoleOutputArgs {
    roleid: pulumi.Input<string>;
}
