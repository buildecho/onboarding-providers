import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getBlobstoreFile(args: GetBlobstoreFileArgs, opts?: pulumi.InvokeOptions): Promise<GetBlobstoreFileResult>;
/**
 * A collection of arguments for invoking getBlobstoreFile.
 */
export interface GetBlobstoreFileArgs {
    name: string;
}
/**
 * A collection of values returned by getBlobstoreFile.
 */
export interface GetBlobstoreFileResult {
    readonly availableSpaceInBytes: number;
    readonly blobCount: number;
    readonly id: string;
    readonly name: string;
    readonly path: string;
    readonly softQuotas: outputs.GetBlobstoreFileSoftQuota[];
    readonly totalSizeInBytes: number;
}
export declare function getBlobstoreFileOutput(args: GetBlobstoreFileOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetBlobstoreFileResult>;
/**
 * A collection of arguments for invoking getBlobstoreFile.
 */
export interface GetBlobstoreFileOutputArgs {
    name: pulumi.Input<string>;
}
