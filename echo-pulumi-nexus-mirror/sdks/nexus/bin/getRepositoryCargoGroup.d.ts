import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryCargoGroup(args: GetRepositoryCargoGroupArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryCargoGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryCargoGroup.
 */
export interface GetRepositoryCargoGroupArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryCargoGroup.
 */
export interface GetRepositoryCargoGroupResult {
    readonly groups: outputs.GetRepositoryCargoGroupGroup[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryCargoGroupStorage[];
}
export declare function getRepositoryCargoGroupOutput(args: GetRepositoryCargoGroupOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryCargoGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryCargoGroup.
 */
export interface GetRepositoryCargoGroupOutputArgs {
    name: pulumi.Input<string>;
}
