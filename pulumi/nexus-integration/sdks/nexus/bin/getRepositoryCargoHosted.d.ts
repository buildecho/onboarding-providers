import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryCargoHosted(args: GetRepositoryCargoHostedArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryCargoHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryCargoHosted.
 */
export interface GetRepositoryCargoHostedArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryCargoHosted.
 */
export interface GetRepositoryCargoHostedResult {
    readonly cleanups: outputs.GetRepositoryCargoHostedCleanup[];
    readonly components: outputs.GetRepositoryCargoHostedComponent[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryCargoHostedStorage[];
}
export declare function getRepositoryCargoHostedOutput(args: GetRepositoryCargoHostedOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryCargoHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryCargoHosted.
 */
export interface GetRepositoryCargoHostedOutputArgs {
    name: pulumi.Input<string>;
}
