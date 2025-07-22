import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryBowerGroup(args: GetRepositoryBowerGroupArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryBowerGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryBowerGroup.
 */
export interface GetRepositoryBowerGroupArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryBowerGroup.
 */
export interface GetRepositoryBowerGroupResult {
    readonly groups: outputs.GetRepositoryBowerGroupGroup[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryBowerGroupStorage[];
}
export declare function getRepositoryBowerGroupOutput(args: GetRepositoryBowerGroupOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryBowerGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryBowerGroup.
 */
export interface GetRepositoryBowerGroupOutputArgs {
    name: pulumi.Input<string>;
}
