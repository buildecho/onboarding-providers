import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryRubygemsHosted(args: GetRepositoryRubygemsHostedArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryRubygemsHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryRubygemsHosted.
 */
export interface GetRepositoryRubygemsHostedArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryRubygemsHosted.
 */
export interface GetRepositoryRubygemsHostedResult {
    readonly cleanups: outputs.GetRepositoryRubygemsHostedCleanup[];
    readonly components: outputs.GetRepositoryRubygemsHostedComponent[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryRubygemsHostedStorage[];
}
export declare function getRepositoryRubygemsHostedOutput(args: GetRepositoryRubygemsHostedOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryRubygemsHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryRubygemsHosted.
 */
export interface GetRepositoryRubygemsHostedOutputArgs {
    name: pulumi.Input<string>;
}
