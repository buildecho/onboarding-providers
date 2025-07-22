import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class BlobstoreAzure extends pulumi.CustomResource {
    /**
     * Get an existing BlobstoreAzure resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: BlobstoreAzureState, opts?: pulumi.CustomResourceOptions): BlobstoreAzure;
    /**
     * Returns true if the given object is an instance of BlobstoreAzure.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is BlobstoreAzure;
    /**
     * Count of blobs
     */
    readonly blobCount: pulumi.Output<number>;
    /**
     * The Azure specific configuration details for the Azure object that'll contain the blob store
     */
    readonly bucketConfiguration: pulumi.Output<outputs.BlobstoreAzureBucketConfiguration>;
    /**
     * Blobstore name
     */
    readonly name: pulumi.Output<string>;
    /**
     * Soft quota of the blobstore
     */
    readonly softQuota: pulumi.Output<outputs.BlobstoreAzureSoftQuota | undefined>;
    /**
     * The total size of the blobstore in Bytes
     */
    readonly totalSizeInBytes: pulumi.Output<number>;
    /**
     * Create a BlobstoreAzure resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: BlobstoreAzureArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering BlobstoreAzure resources.
 */
export interface BlobstoreAzureState {
    /**
     * Count of blobs
     */
    blobCount?: pulumi.Input<number>;
    /**
     * The Azure specific configuration details for the Azure object that'll contain the blob store
     */
    bucketConfiguration?: pulumi.Input<inputs.BlobstoreAzureBucketConfiguration>;
    /**
     * Blobstore name
     */
    name?: pulumi.Input<string>;
    /**
     * Soft quota of the blobstore
     */
    softQuota?: pulumi.Input<inputs.BlobstoreAzureSoftQuota>;
    /**
     * The total size of the blobstore in Bytes
     */
    totalSizeInBytes?: pulumi.Input<number>;
}
/**
 * The set of arguments for constructing a BlobstoreAzure resource.
 */
export interface BlobstoreAzureArgs {
    /**
     * The Azure specific configuration details for the Azure object that'll contain the blob store
     */
    bucketConfiguration: pulumi.Input<inputs.BlobstoreAzureBucketConfiguration>;
    /**
     * Blobstore name
     */
    name?: pulumi.Input<string>;
    /**
     * Soft quota of the blobstore
     */
    softQuota?: pulumi.Input<inputs.BlobstoreAzureSoftQuota>;
}
