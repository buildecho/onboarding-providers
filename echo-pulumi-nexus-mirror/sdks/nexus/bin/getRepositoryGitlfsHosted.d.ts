import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryGitlfsHosted(args: GetRepositoryGitlfsHostedArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryGitlfsHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryGitlfsHosted.
 */
export interface GetRepositoryGitlfsHostedArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryGitlfsHosted.
 */
export interface GetRepositoryGitlfsHostedResult {
    readonly cleanups: outputs.GetRepositoryGitlfsHostedCleanup[];
    readonly components: outputs.GetRepositoryGitlfsHostedComponent[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryGitlfsHostedStorage[];
}
export declare function getRepositoryGitlfsHostedOutput(args: GetRepositoryGitlfsHostedOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryGitlfsHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryGitlfsHosted.
 */
export interface GetRepositoryGitlfsHostedOutputArgs {
    name: pulumi.Input<string>;
}
