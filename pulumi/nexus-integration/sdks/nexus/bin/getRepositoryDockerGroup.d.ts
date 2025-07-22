import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryDockerGroup(args: GetRepositoryDockerGroupArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryDockerGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryDockerGroup.
 */
export interface GetRepositoryDockerGroupArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryDockerGroup.
 */
export interface GetRepositoryDockerGroupResult {
    readonly dockers: outputs.GetRepositoryDockerGroupDocker[];
    readonly groups: outputs.GetRepositoryDockerGroupGroup[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryDockerGroupStorage[];
}
export declare function getRepositoryDockerGroupOutput(args: GetRepositoryDockerGroupOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryDockerGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryDockerGroup.
 */
export interface GetRepositoryDockerGroupOutputArgs {
    name: pulumi.Input<string>;
}
