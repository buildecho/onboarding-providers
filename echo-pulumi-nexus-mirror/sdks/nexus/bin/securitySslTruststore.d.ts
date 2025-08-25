import * as pulumi from "@pulumi/pulumi";
export declare class SecuritySslTruststore extends pulumi.CustomResource {
    /**
     * Get an existing SecuritySslTruststore resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: SecuritySslTruststoreState, opts?: pulumi.CustomResourceOptions): SecuritySslTruststore;
    /**
     * Returns true if the given object is an instance of SecuritySslTruststore.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is SecuritySslTruststore;
    /**
     * The fingerprint of the cert
     */
    readonly fingerprint: pulumi.Output<string>;
    /**
     * The cert in PEM format
     */
    readonly pem: pulumi.Output<string>;
    /**
     * Create a SecuritySslTruststore resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: SecuritySslTruststoreArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering SecuritySslTruststore resources.
 */
export interface SecuritySslTruststoreState {
    /**
     * The fingerprint of the cert
     */
    fingerprint?: pulumi.Input<string>;
    /**
     * The cert in PEM format
     */
    pem?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a SecuritySslTruststore resource.
 */
export interface SecuritySslTruststoreArgs {
    /**
     * The cert in PEM format
     */
    pem: pulumi.Input<string>;
}
