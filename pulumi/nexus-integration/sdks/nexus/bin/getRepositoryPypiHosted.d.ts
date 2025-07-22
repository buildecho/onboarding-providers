import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryPypiHosted(args: GetRepositoryPypiHostedArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryPypiHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryPypiHosted.
 */
export interface GetRepositoryPypiHostedArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryPypiHosted.
 */
export interface GetRepositoryPypiHostedResult {
    readonly cleanups: outputs.GetRepositoryPypiHostedCleanup[];
    readonly components: outputs.GetRepositoryPypiHostedComponent[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryPypiHostedStorage[];
}
export declare function getRepositoryPypiHostedOutput(args: GetRepositoryPypiHostedOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryPypiHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryPypiHosted.
 */
export interface GetRepositoryPypiHostedOutputArgs {
    name: pulumi.Input<string>;
}
