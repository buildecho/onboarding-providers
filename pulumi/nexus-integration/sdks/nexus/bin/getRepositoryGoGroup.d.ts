import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryGoGroup(args: GetRepositoryGoGroupArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryGoGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryGoGroup.
 */
export interface GetRepositoryGoGroupArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryGoGroup.
 */
export interface GetRepositoryGoGroupResult {
    readonly groups: outputs.GetRepositoryGoGroupGroup[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryGoGroupStorage[];
}
export declare function getRepositoryGoGroupOutput(args: GetRepositoryGoGroupOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryGoGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryGoGroup.
 */
export interface GetRepositoryGoGroupOutputArgs {
    name: pulumi.Input<string>;
}
