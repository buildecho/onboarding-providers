import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getBlobstoreGroup(args: GetBlobstoreGroupArgs, opts?: pulumi.InvokeOptions): Promise<GetBlobstoreGroupResult>;
/**
 * A collection of arguments for invoking getBlobstoreGroup.
 */
export interface GetBlobstoreGroupArgs {
    name: string;
}
/**
 * A collection of values returned by getBlobstoreGroup.
 */
export interface GetBlobstoreGroupResult {
    readonly availableSpaceInBytes: number;
    readonly blobCount: number;
    readonly fillPolicy: string;
    readonly id: string;
    readonly members: string[];
    readonly name: string;
    readonly softQuotas: outputs.GetBlobstoreGroupSoftQuota[];
    readonly totalSizeInBytes: number;
}
export declare function getBlobstoreGroupOutput(args: GetBlobstoreGroupOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetBlobstoreGroupResult>;
/**
 * A collection of arguments for invoking getBlobstoreGroup.
 */
export interface GetBlobstoreGroupOutputArgs {
    name: pulumi.Input<string>;
}
