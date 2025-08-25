import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryNugetGroup(args: GetRepositoryNugetGroupArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryNugetGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryNugetGroup.
 */
export interface GetRepositoryNugetGroupArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryNugetGroup.
 */
export interface GetRepositoryNugetGroupResult {
    readonly groups: outputs.GetRepositoryNugetGroupGroup[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryNugetGroupStorage[];
}
export declare function getRepositoryNugetGroupOutput(args: GetRepositoryNugetGroupOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryNugetGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryNugetGroup.
 */
export interface GetRepositoryNugetGroupOutputArgs {
    name: pulumi.Input<string>;
}
