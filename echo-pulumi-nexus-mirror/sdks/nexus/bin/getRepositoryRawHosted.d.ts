import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryRawHosted(args: GetRepositoryRawHostedArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryRawHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryRawHosted.
 */
export interface GetRepositoryRawHostedArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryRawHosted.
 */
export interface GetRepositoryRawHostedResult {
    readonly cleanups: outputs.GetRepositoryRawHostedCleanup[];
    readonly components: outputs.GetRepositoryRawHostedComponent[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryRawHostedStorage[];
}
export declare function getRepositoryRawHostedOutput(args: GetRepositoryRawHostedOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryRawHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryRawHosted.
 */
export interface GetRepositoryRawHostedOutputArgs {
    name: pulumi.Input<string>;
}
