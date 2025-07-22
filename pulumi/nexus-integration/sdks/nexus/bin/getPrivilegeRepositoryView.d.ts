import * as pulumi from "@pulumi/pulumi";
export declare function getPrivilegeRepositoryView(args: GetPrivilegeRepositoryViewArgs, opts?: pulumi.InvokeOptions): Promise<GetPrivilegeRepositoryViewResult>;
/**
 * A collection of arguments for invoking getPrivilegeRepositoryView.
 */
export interface GetPrivilegeRepositoryViewArgs {
    name: string;
}
/**
 * A collection of values returned by getPrivilegeRepositoryView.
 */
export interface GetPrivilegeRepositoryViewResult {
    readonly actions: string[];
    readonly description: string;
    readonly format: string;
    readonly id: string;
    readonly name: string;
    readonly readonly: boolean;
    readonly repository: string;
}
export declare function getPrivilegeRepositoryViewOutput(args: GetPrivilegeRepositoryViewOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetPrivilegeRepositoryViewResult>;
/**
 * A collection of arguments for invoking getPrivilegeRepositoryView.
 */
export interface GetPrivilegeRepositoryViewOutputArgs {
    name: pulumi.Input<string>;
}
