import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryRHosted(args: GetRepositoryRHostedArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryRHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryRHosted.
 */
export interface GetRepositoryRHostedArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryRHosted.
 */
export interface GetRepositoryRHostedResult {
    readonly cleanups: outputs.GetRepositoryRHostedCleanup[];
    readonly components: outputs.GetRepositoryRHostedComponent[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryRHostedStorage[];
}
export declare function getRepositoryRHostedOutput(args: GetRepositoryRHostedOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryRHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryRHosted.
 */
export interface GetRepositoryRHostedOutputArgs {
    name: pulumi.Input<string>;
}
