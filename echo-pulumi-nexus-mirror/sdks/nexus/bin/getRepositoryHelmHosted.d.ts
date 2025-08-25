import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryHelmHosted(args: GetRepositoryHelmHostedArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryHelmHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryHelmHosted.
 */
export interface GetRepositoryHelmHostedArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryHelmHosted.
 */
export interface GetRepositoryHelmHostedResult {
    readonly cleanups: outputs.GetRepositoryHelmHostedCleanup[];
    readonly components: outputs.GetRepositoryHelmHostedComponent[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryHelmHostedStorage[];
}
export declare function getRepositoryHelmHostedOutput(args: GetRepositoryHelmHostedOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryHelmHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryHelmHosted.
 */
export interface GetRepositoryHelmHostedOutputArgs {
    name: pulumi.Input<string>;
}
