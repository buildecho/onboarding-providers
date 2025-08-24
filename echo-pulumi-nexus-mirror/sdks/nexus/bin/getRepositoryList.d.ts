import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryList(opts?: pulumi.InvokeOptions): Promise<GetRepositoryListResult>;
/**
 * A collection of values returned by getRepositoryList.
 */
export interface GetRepositoryListResult {
    readonly id: string;
    readonly items: outputs.GetRepositoryListItem[];
}
export declare function getRepositoryListOutput(opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryListResult>;
