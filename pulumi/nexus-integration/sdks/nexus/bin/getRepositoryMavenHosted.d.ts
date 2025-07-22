import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryMavenHosted(args: GetRepositoryMavenHostedArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryMavenHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryMavenHosted.
 */
export interface GetRepositoryMavenHostedArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryMavenHosted.
 */
export interface GetRepositoryMavenHostedResult {
    readonly cleanups: outputs.GetRepositoryMavenHostedCleanup[];
    readonly components: outputs.GetRepositoryMavenHostedComponent[];
    readonly id: string;
    readonly mavens: outputs.GetRepositoryMavenHostedMaven[];
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryMavenHostedStorage[];
}
export declare function getRepositoryMavenHostedOutput(args: GetRepositoryMavenHostedOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryMavenHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryMavenHosted.
 */
export interface GetRepositoryMavenHostedOutputArgs {
    name: pulumi.Input<string>;
}
