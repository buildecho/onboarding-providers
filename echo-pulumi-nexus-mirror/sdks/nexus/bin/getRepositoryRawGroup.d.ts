import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryRawGroup(args: GetRepositoryRawGroupArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryRawGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryRawGroup.
 */
export interface GetRepositoryRawGroupArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryRawGroup.
 */
export interface GetRepositoryRawGroupResult {
    readonly groups: outputs.GetRepositoryRawGroupGroup[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryRawGroupStorage[];
}
export declare function getRepositoryRawGroupOutput(args: GetRepositoryRawGroupOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryRawGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryRawGroup.
 */
export interface GetRepositoryRawGroupOutputArgs {
    name: pulumi.Input<string>;
}
