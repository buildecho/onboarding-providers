import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryDockerHosted(args: GetRepositoryDockerHostedArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryDockerHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryDockerHosted.
 */
export interface GetRepositoryDockerHostedArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryDockerHosted.
 */
export interface GetRepositoryDockerHostedResult {
    readonly cleanups: outputs.GetRepositoryDockerHostedCleanup[];
    readonly components: outputs.GetRepositoryDockerHostedComponent[];
    readonly dockers: outputs.GetRepositoryDockerHostedDocker[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryDockerHostedStorage[];
}
export declare function getRepositoryDockerHostedOutput(args: GetRepositoryDockerHostedOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryDockerHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryDockerHosted.
 */
export interface GetRepositoryDockerHostedOutputArgs {
    name: pulumi.Input<string>;
}
