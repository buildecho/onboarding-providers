import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class BlobstoreFile extends pulumi.CustomResource {
    /**
     * Get an existing BlobstoreFile resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: BlobstoreFileState, opts?: pulumi.CustomResourceOptions): BlobstoreFile;
    /**
     * Returns true if the given object is an instance of BlobstoreFile.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is BlobstoreFile;
    /**
     * Available space in Bytes
     */
    readonly availableSpaceInBytes: pulumi.Output<number>;
    /**
     * Count of blobs
     */
    readonly blobCount: pulumi.Output<number>;
    /**
     * Blobstore name
     */
    readonly name: pulumi.Output<string>;
    /**
     * The path to the blobstore contents. This can be an absolute path to anywhere on the system nxrm has access to or it can
     * be a path relative to the sonatype-work directory
     */
    readonly path: pulumi.Output<string | undefined>;
    /**
     * Soft quota of the blobstore
     */
    readonly softQuota: pulumi.Output<outputs.BlobstoreFileSoftQuota | undefined>;
    /**
     * The total size of the blobstore in Bytes
     */
    readonly totalSizeInBytes: pulumi.Output<number>;
    /**
     * Create a BlobstoreFile resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: BlobstoreFileArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering BlobstoreFile resources.
 */
export interface BlobstoreFileState {
    /**
     * Available space in Bytes
     */
    availableSpaceInBytes?: pulumi.Input<number>;
    /**
     * Count of blobs
     */
    blobCount?: pulumi.Input<number>;
    /**
     * Blobstore name
     */
    name?: pulumi.Input<string>;
    /**
     * The path to the blobstore contents. This can be an absolute path to anywhere on the system nxrm has access to or it can
     * be a path relative to the sonatype-work directory
     */
    path?: pulumi.Input<string>;
    /**
     * Soft quota of the blobstore
     */
    softQuota?: pulumi.Input<inputs.BlobstoreFileSoftQuota>;
    /**
     * The total size of the blobstore in Bytes
     */
    totalSizeInBytes?: pulumi.Input<number>;
}
/**
 * The set of arguments for constructing a BlobstoreFile resource.
 */
export interface BlobstoreFileArgs {
    /**
     * Blobstore name
     */
    name?: pulumi.Input<string>;
    /**
     * The path to the blobstore contents. This can be an absolute path to anywhere on the system nxrm has access to or it can
     * be a path relative to the sonatype-work directory
     */
    path?: pulumi.Input<string>;
    /**
     * Soft quota of the blobstore
     */
    softQuota?: pulumi.Input<inputs.BlobstoreFileSoftQuota>;
}
