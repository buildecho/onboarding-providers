import * as pulumi from "@pulumi/pulumi";
export declare function getPrivilegeRepositoryContentSelector(args: GetPrivilegeRepositoryContentSelectorArgs, opts?: pulumi.InvokeOptions): Promise<GetPrivilegeRepositoryContentSelectorResult>;
/**
 * A collection of arguments for invoking getPrivilegeRepositoryContentSelector.
 */
export interface GetPrivilegeRepositoryContentSelectorArgs {
    name: string;
}
/**
 * A collection of values returned by getPrivilegeRepositoryContentSelector.
 */
export interface GetPrivilegeRepositoryContentSelectorResult {
    readonly actions: string[];
    readonly contentSelector: string;
    readonly description: string;
    readonly format: string;
    readonly id: string;
    readonly name: string;
    readonly readonly: boolean;
    readonly repository: string;
}
export declare function getPrivilegeRepositoryContentSelectorOutput(args: GetPrivilegeRepositoryContentSelectorOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetPrivilegeRepositoryContentSelectorResult>;
/**
 * A collection of arguments for invoking getPrivilegeRepositoryContentSelector.
 */
export interface GetPrivilegeRepositoryContentSelectorOutputArgs {
    name: pulumi.Input<string>;
}
