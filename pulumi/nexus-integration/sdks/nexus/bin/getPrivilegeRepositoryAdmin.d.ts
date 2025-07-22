import * as pulumi from "@pulumi/pulumi";
export declare function getPrivilegeRepositoryAdmin(args: GetPrivilegeRepositoryAdminArgs, opts?: pulumi.InvokeOptions): Promise<GetPrivilegeRepositoryAdminResult>;
/**
 * A collection of arguments for invoking getPrivilegeRepositoryAdmin.
 */
export interface GetPrivilegeRepositoryAdminArgs {
    name: string;
}
/**
 * A collection of values returned by getPrivilegeRepositoryAdmin.
 */
export interface GetPrivilegeRepositoryAdminResult {
    readonly actions: string[];
    readonly description: string;
    readonly format: string;
    readonly id: string;
    readonly name: string;
    readonly readonly: boolean;
    readonly repository: string;
}
export declare function getPrivilegeRepositoryAdminOutput(args: GetPrivilegeRepositoryAdminOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetPrivilegeRepositoryAdminResult>;
/**
 * A collection of arguments for invoking getPrivilegeRepositoryAdmin.
 */
export interface GetPrivilegeRepositoryAdminOutputArgs {
    name: pulumi.Input<string>;
}
