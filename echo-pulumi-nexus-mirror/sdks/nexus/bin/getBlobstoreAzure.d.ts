import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getBlobstoreAzure(args: GetBlobstoreAzureArgs, opts?: pulumi.InvokeOptions): Promise<GetBlobstoreAzureResult>;
/**
 * A collection of arguments for invoking getBlobstoreAzure.
 */
export interface GetBlobstoreAzureArgs {
    name: string;
}
/**
 * A collection of values returned by getBlobstoreAzure.
 */
export interface GetBlobstoreAzureResult {
    readonly blobCount: number;
    readonly bucketConfigurations: outputs.GetBlobstoreAzureBucketConfiguration[];
    readonly id: string;
    readonly name: string;
    readonly softQuotas: outputs.GetBlobstoreAzureSoftQuota[];
    readonly totalSizeInBytes: number;
}
export declare function getBlobstoreAzureOutput(args: GetBlobstoreAzureOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetBlobstoreAzureResult>;
/**
 * A collection of arguments for invoking getBlobstoreAzure.
 */
export interface GetBlobstoreAzureOutputArgs {
    name: pulumi.Input<string>;
}
