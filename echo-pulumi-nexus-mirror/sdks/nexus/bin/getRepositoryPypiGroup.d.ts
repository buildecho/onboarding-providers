import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryPypiGroup(args: GetRepositoryPypiGroupArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryPypiGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryPypiGroup.
 */
export interface GetRepositoryPypiGroupArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryPypiGroup.
 */
export interface GetRepositoryPypiGroupResult {
    readonly groups: outputs.GetRepositoryPypiGroupGroup[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryPypiGroupStorage[];
}
export declare function getRepositoryPypiGroupOutput(args: GetRepositoryPypiGroupOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryPypiGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryPypiGroup.
 */
export interface GetRepositoryPypiGroupOutputArgs {
    name: pulumi.Input<string>;
}
