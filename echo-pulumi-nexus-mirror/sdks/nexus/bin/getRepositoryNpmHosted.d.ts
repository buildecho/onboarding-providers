import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryNpmHosted(args: GetRepositoryNpmHostedArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryNpmHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryNpmHosted.
 */
export interface GetRepositoryNpmHostedArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryNpmHosted.
 */
export interface GetRepositoryNpmHostedResult {
    readonly cleanups: outputs.GetRepositoryNpmHostedCleanup[];
    readonly components: outputs.GetRepositoryNpmHostedComponent[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryNpmHostedStorage[];
}
export declare function getRepositoryNpmHostedOutput(args: GetRepositoryNpmHostedOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryNpmHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryNpmHosted.
 */
export interface GetRepositoryNpmHostedOutputArgs {
    name: pulumi.Input<string>;
}
