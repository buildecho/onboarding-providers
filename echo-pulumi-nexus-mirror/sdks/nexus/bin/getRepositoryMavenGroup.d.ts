import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryMavenGroup(args: GetRepositoryMavenGroupArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryMavenGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryMavenGroup.
 */
export interface GetRepositoryMavenGroupArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryMavenGroup.
 */
export interface GetRepositoryMavenGroupResult {
    readonly groups: outputs.GetRepositoryMavenGroupGroup[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryMavenGroupStorage[];
}
export declare function getRepositoryMavenGroupOutput(args: GetRepositoryMavenGroupOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryMavenGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryMavenGroup.
 */
export interface GetRepositoryMavenGroupOutputArgs {
    name: pulumi.Input<string>;
}
