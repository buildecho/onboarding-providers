import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getBlobstoreS3(args: GetBlobstoreS3Args, opts?: pulumi.InvokeOptions): Promise<GetBlobstoreS3Result>;
/**
 * A collection of arguments for invoking getBlobstoreS3.
 */
export interface GetBlobstoreS3Args {
    name: string;
}
/**
 * A collection of values returned by getBlobstoreS3.
 */
export interface GetBlobstoreS3Result {
    readonly blobCount: number;
    readonly bucketConfigurations: outputs.GetBlobstoreS3BucketConfiguration[];
    readonly id: string;
    readonly name: string;
    readonly softQuotas: outputs.GetBlobstoreS3SoftQuota[];
    readonly totalSizeInBytes: number;
}
export declare function getBlobstoreS3Output(args: GetBlobstoreS3OutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetBlobstoreS3Result>;
/**
 * A collection of arguments for invoking getBlobstoreS3.
 */
export interface GetBlobstoreS3OutputArgs {
    name: pulumi.Input<string>;
}
