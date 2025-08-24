import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryAptHosted(args: GetRepositoryAptHostedArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryAptHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryAptHosted.
 */
export interface GetRepositoryAptHostedArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryAptHosted.
 */
export interface GetRepositoryAptHostedResult {
    readonly cleanups: outputs.GetRepositoryAptHostedCleanup[];
    readonly components: outputs.GetRepositoryAptHostedComponent[];
    readonly distribution: string;
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly signings: outputs.GetRepositoryAptHostedSigning[];
    readonly storages: outputs.GetRepositoryAptHostedStorage[];
}
export declare function getRepositoryAptHostedOutput(args: GetRepositoryAptHostedOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryAptHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryAptHosted.
 */
export interface GetRepositoryAptHostedOutputArgs {
    name: pulumi.Input<string>;
}
