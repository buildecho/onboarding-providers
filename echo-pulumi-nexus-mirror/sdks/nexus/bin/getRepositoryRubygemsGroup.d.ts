import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryRubygemsGroup(args: GetRepositoryRubygemsGroupArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryRubygemsGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryRubygemsGroup.
 */
export interface GetRepositoryRubygemsGroupArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryRubygemsGroup.
 */
export interface GetRepositoryRubygemsGroupResult {
    readonly groups: outputs.GetRepositoryRubygemsGroupGroup[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryRubygemsGroupStorage[];
}
export declare function getRepositoryRubygemsGroupOutput(args: GetRepositoryRubygemsGroupOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryRubygemsGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryRubygemsGroup.
 */
export interface GetRepositoryRubygemsGroupOutputArgs {
    name: pulumi.Input<string>;
}
