import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryRGroup(args: GetRepositoryRGroupArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryRGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryRGroup.
 */
export interface GetRepositoryRGroupArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryRGroup.
 */
export interface GetRepositoryRGroupResult {
    readonly groups: outputs.GetRepositoryRGroupGroup[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryRGroupStorage[];
}
export declare function getRepositoryRGroupOutput(args: GetRepositoryRGroupOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryRGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryRGroup.
 */
export interface GetRepositoryRGroupOutputArgs {
    name: pulumi.Input<string>;
}
