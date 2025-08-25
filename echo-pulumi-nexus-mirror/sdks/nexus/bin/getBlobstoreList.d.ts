import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getBlobstoreList(opts?: pulumi.InvokeOptions): Promise<GetBlobstoreListResult>;
/**
 * A collection of values returned by getBlobstoreList.
 */
export interface GetBlobstoreListResult {
    readonly id: string;
    readonly items: outputs.GetBlobstoreListItem[];
}
export declare function getBlobstoreListOutput(opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetBlobstoreListResult>;
