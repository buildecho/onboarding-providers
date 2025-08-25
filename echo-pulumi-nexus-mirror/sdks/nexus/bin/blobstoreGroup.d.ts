import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class BlobstoreGroup extends pulumi.CustomResource {
    /**
     * Get an existing BlobstoreGroup resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: BlobstoreGroupState, opts?: pulumi.CustomResourceOptions): BlobstoreGroup;
    /**
     * Returns true if the given object is an instance of BlobstoreGroup.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is BlobstoreGroup;
    /**
     * Available space in Bytes
     */
    readonly availableSpaceInBytes: pulumi.Output<number>;
    /**
     * Count of blobs
     */
    readonly blobCount: pulumi.Output<number>;
    /**
     * The policy how to fill the members. Possible values: `roundRobin` or `writeToFirst`
     */
    readonly fillPolicy: pulumi.Output<string>;
    /**
     * List of the names of blob stores that are members of this group
     */
    readonly members: pulumi.Output<string[]>;
    /**
     * Blobstore name
     */
    readonly name: pulumi.Output<string>;
    /**
     * Soft quota of the blobstore
     */
    readonly softQuota: pulumi.Output<outputs.BlobstoreGroupSoftQuota | undefined>;
    /**
     * The total size of the blobstore in Bytes
     */
    readonly totalSizeInBytes: pulumi.Output<number>;
    /**
     * Create a BlobstoreGroup resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: BlobstoreGroupArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering BlobstoreGroup resources.
 */
export interface BlobstoreGroupState {
    /**
     * Available space in Bytes
     */
    availableSpaceInBytes?: pulumi.Input<number>;
    /**
     * Count of blobs
     */
    blobCount?: pulumi.Input<number>;
    /**
     * The policy how to fill the members. Possible values: `roundRobin` or `writeToFirst`
     */
    fillPolicy?: pulumi.Input<string>;
    /**
     * List of the names of blob stores that are members of this group
     */
    members?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Blobstore name
     */
    name?: pulumi.Input<string>;
    /**
     * Soft quota of the blobstore
     */
    softQuota?: pulumi.Input<inputs.BlobstoreGroupSoftQuota>;
    /**
     * The total size of the blobstore in Bytes
     */
    totalSizeInBytes?: pulumi.Input<number>;
}
/**
 * The set of arguments for constructing a BlobstoreGroup resource.
 */
export interface BlobstoreGroupArgs {
    /**
     * The policy how to fill the members. Possible values: `roundRobin` or `writeToFirst`
     */
    fillPolicy: pulumi.Input<string>;
    /**
     * List of the names of blob stores that are members of this group
     */
    members: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Blobstore name
     */
    name?: pulumi.Input<string>;
    /**
     * Soft quota of the blobstore
     */
    softQuota?: pulumi.Input<inputs.BlobstoreGroupSoftQuota>;
}
