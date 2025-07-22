import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class BlobstoreS3 extends pulumi.CustomResource {
    /**
     * Get an existing BlobstoreS3 resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: BlobstoreS3State, opts?: pulumi.CustomResourceOptions): BlobstoreS3;
    /**
     * Returns true if the given object is an instance of BlobstoreS3.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is BlobstoreS3;
    /**
     * Count of blobs
     */
    readonly blobCount: pulumi.Output<number>;
    /**
     * The S3 bucket configuration.
     */
    readonly bucketConfiguration: pulumi.Output<outputs.BlobstoreS3BucketConfiguration>;
    /**
     * Blobstore name
     */
    readonly name: pulumi.Output<string>;
    /**
     * Soft quota of the blobstore
     */
    readonly softQuota: pulumi.Output<outputs.BlobstoreS3SoftQuota | undefined>;
    /**
     * The total size of the blobstore in Bytes
     */
    readonly totalSizeInBytes: pulumi.Output<number>;
    /**
     * Create a BlobstoreS3 resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: BlobstoreS3Args, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering BlobstoreS3 resources.
 */
export interface BlobstoreS3State {
    /**
     * Count of blobs
     */
    blobCount?: pulumi.Input<number>;
    /**
     * The S3 bucket configuration.
     */
    bucketConfiguration?: pulumi.Input<inputs.BlobstoreS3BucketConfiguration>;
    /**
     * Blobstore name
     */
    name?: pulumi.Input<string>;
    /**
     * Soft quota of the blobstore
     */
    softQuota?: pulumi.Input<inputs.BlobstoreS3SoftQuota>;
    /**
     * The total size of the blobstore in Bytes
     */
    totalSizeInBytes?: pulumi.Input<number>;
}
/**
 * The set of arguments for constructing a BlobstoreS3 resource.
 */
export interface BlobstoreS3Args {
    /**
     * The S3 bucket configuration.
     */
    bucketConfiguration: pulumi.Input<inputs.BlobstoreS3BucketConfiguration>;
    /**
     * Blobstore name
     */
    name?: pulumi.Input<string>;
    /**
     * Soft quota of the blobstore
     */
    softQuota?: pulumi.Input<inputs.BlobstoreS3SoftQuota>;
}
