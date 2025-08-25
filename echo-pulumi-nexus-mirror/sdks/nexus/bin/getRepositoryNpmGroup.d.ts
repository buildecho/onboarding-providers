import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryNpmGroup(args: GetRepositoryNpmGroupArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryNpmGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryNpmGroup.
 */
export interface GetRepositoryNpmGroupArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryNpmGroup.
 */
export interface GetRepositoryNpmGroupResult {
    readonly groups: outputs.GetRepositoryNpmGroupGroup[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryNpmGroupStorage[];
}
export declare function getRepositoryNpmGroupOutput(args: GetRepositoryNpmGroupOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryNpmGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryNpmGroup.
 */
export interface GetRepositoryNpmGroupOutputArgs {
    name: pulumi.Input<string>;
}
