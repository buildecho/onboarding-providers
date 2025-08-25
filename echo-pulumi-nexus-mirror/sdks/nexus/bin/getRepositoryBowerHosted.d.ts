import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryBowerHosted(args: GetRepositoryBowerHostedArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryBowerHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryBowerHosted.
 */
export interface GetRepositoryBowerHostedArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryBowerHosted.
 */
export interface GetRepositoryBowerHostedResult {
    readonly cleanups: outputs.GetRepositoryBowerHostedCleanup[];
    readonly components: outputs.GetRepositoryBowerHostedComponent[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryBowerHostedStorage[];
}
export declare function getRepositoryBowerHostedOutput(args: GetRepositoryBowerHostedOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryBowerHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryBowerHosted.
 */
export interface GetRepositoryBowerHostedOutputArgs {
    name: pulumi.Input<string>;
}
