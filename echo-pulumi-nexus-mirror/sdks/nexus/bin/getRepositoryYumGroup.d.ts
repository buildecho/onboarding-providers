import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryYumGroup(args: GetRepositoryYumGroupArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryYumGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryYumGroup.
 */
export interface GetRepositoryYumGroupArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryYumGroup.
 */
export interface GetRepositoryYumGroupResult {
    readonly groups: outputs.GetRepositoryYumGroupGroup[];
    readonly id: string;
    readonly name: string;
    readonly online: boolean;
    readonly storages: outputs.GetRepositoryYumGroupStorage[];
    readonly yumSignings: outputs.GetRepositoryYumGroupYumSigning[];
}
export declare function getRepositoryYumGroupOutput(args: GetRepositoryYumGroupOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryYumGroupResult>;
/**
 * A collection of arguments for invoking getRepositoryYumGroup.
 */
export interface GetRepositoryYumGroupOutputArgs {
    name: pulumi.Input<string>;
}
