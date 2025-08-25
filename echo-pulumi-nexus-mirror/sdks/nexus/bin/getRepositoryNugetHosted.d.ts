import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryNugetHosted(args: GetRepositoryNugetHostedArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryNugetHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryNugetHosted.
 */
export interface GetRepositoryNugetHostedArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryNugetHosted.
 */
export interface GetRepositoryNugetHostedResult {
    readonly cleanups: outputs.GetRepositoryNugetHostedCleanup[];
    readonly components: outputs.GetRepositoryNugetHostedComponent[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryNugetHostedStorage[];
}
export declare function getRepositoryNugetHostedOutput(args: GetRepositoryNugetHostedOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryNugetHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryNugetHosted.
 */
export interface GetRepositoryNugetHostedOutputArgs {
    name: pulumi.Input<string>;
}
