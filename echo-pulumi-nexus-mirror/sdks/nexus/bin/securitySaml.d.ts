import * as pulumi from "@pulumi/pulumi";
export declare class SecuritySaml extends pulumi.CustomResource {
    /**
     * Get an existing SecuritySaml resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: SecuritySamlState, opts?: pulumi.CustomResourceOptions): SecuritySaml;
    /**
     * Returns true if the given object is an instance of SecuritySaml.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is SecuritySaml;
    /**
     * IdP field mappings for user's email address
     */
    readonly emailAttribute: pulumi.Output<string | undefined>;
    /**
     * Entity ID URI
     */
    readonly entityId: pulumi.Output<string | undefined>;
    /**
     * IdP field mappings for user's given name
     */
    readonly firstNameAttribute: pulumi.Output<string | undefined>;
    /**
     * IdP field mappings for user's groups
     */
    readonly groupsAttribute: pulumi.Output<string | undefined>;
    /**
     * SAML Identity Provider Metadata XML
     */
    readonly idpMetadata: pulumi.Output<string>;
    /**
     * IdP field mappings for user's family name
     */
    readonly lastNameAttribute: pulumi.Output<string | undefined>;
    /**
     * IdP field mappings for username
     */
    readonly usernameAttribute: pulumi.Output<string>;
    /**
     * By default, if a signing key is found in the IdP metadata, then NXRM will attempt to validate signatures on the
     * assertions.
     */
    readonly validateAssertionSignature: pulumi.Output<boolean | undefined>;
    /**
     * By default, if a signing key is found in the IdP metadata, then NXRM will attempt to validate signatures on the
     * response.
     */
    readonly validateResponseSignature: pulumi.Output<boolean | undefined>;
    /**
     * Create a SecuritySaml resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: SecuritySamlArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering SecuritySaml resources.
 */
export interface SecuritySamlState {
    /**
     * IdP field mappings for user's email address
     */
    emailAttribute?: pulumi.Input<string>;
    /**
     * Entity ID URI
     */
    entityId?: pulumi.Input<string>;
    /**
     * IdP field mappings for user's given name
     */
    firstNameAttribute?: pulumi.Input<string>;
    /**
     * IdP field mappings for user's groups
     */
    groupsAttribute?: pulumi.Input<string>;
    /**
     * SAML Identity Provider Metadata XML
     */
    idpMetadata?: pulumi.Input<string>;
    /**
     * IdP field mappings for user's family name
     */
    lastNameAttribute?: pulumi.Input<string>;
    /**
     * IdP field mappings for username
     */
    usernameAttribute?: pulumi.Input<string>;
    /**
     * By default, if a signing key is found in the IdP metadata, then NXRM will attempt to validate signatures on the
     * assertions.
     */
    validateAssertionSignature?: pulumi.Input<boolean>;
    /**
     * By default, if a signing key is found in the IdP metadata, then NXRM will attempt to validate signatures on the
     * response.
     */
    validateResponseSignature?: pulumi.Input<boolean>;
}
/**
 * The set of arguments for constructing a SecuritySaml resource.
 */
export interface SecuritySamlArgs {
    /**
     * IdP field mappings for user's email address
     */
    emailAttribute?: pulumi.Input<string>;
    /**
     * Entity ID URI
     */
    entityId?: pulumi.Input<string>;
    /**
     * IdP field mappings for user's given name
     */
    firstNameAttribute?: pulumi.Input<string>;
    /**
     * IdP field mappings for user's groups
     */
    groupsAttribute?: pulumi.Input<string>;
    /**
     * SAML Identity Provider Metadata XML
     */
    idpMetadata: pulumi.Input<string>;
    /**
     * IdP field mappings for user's family name
     */
    lastNameAttribute?: pulumi.Input<string>;
    /**
     * IdP field mappings for username
     */
    usernameAttribute: pulumi.Input<string>;
    /**
     * By default, if a signing key is found in the IdP metadata, then NXRM will attempt to validate signatures on the
     * assertions.
     */
    validateAssertionSignature?: pulumi.Input<boolean>;
    /**
     * By default, if a signing key is found in the IdP metadata, then NXRM will attempt to validate signatures on the
     * response.
     */
    validateResponseSignature?: pulumi.Input<boolean>;
}
