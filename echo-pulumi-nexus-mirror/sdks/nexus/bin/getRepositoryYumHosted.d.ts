import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryYumHosted(args: GetRepositoryYumHostedArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryYumHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryYumHosted.
 */
export interface GetRepositoryYumHostedArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryYumHosted.
 */
export interface GetRepositoryYumHostedResult {
    readonly cleanups: outputs.GetRepositoryYumHostedCleanup[];
    readonly components: outputs.GetRepositoryYumHostedComponent[];
    readonly deployPolicy: string;
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly repodataDepth: number;
    readonly storages: outputs.GetRepositoryYumHostedStorage[];
}
export declare function getRepositoryYumHostedOutput(args: GetRepositoryYumHostedOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryYumHostedResult>;
/**
 * A collection of arguments for invoking getRepositoryYumHosted.
 */
export interface GetRepositoryYumHostedOutputArgs {
    name: pulumi.Input<string>;
}
