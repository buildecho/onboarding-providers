import * as pulumi from "@pulumi/pulumi";
export declare class SecurityLdap extends pulumi.CustomResource {
    /**
     * Get an existing SecurityLdap resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: SecurityLdapState, opts?: pulumi.CustomResourceOptions): SecurityLdap;
    /**
     * Returns true if the given object is an instance of SecurityLdap.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is SecurityLdap;
    /**
     * The password to bind with. Required if authScheme other than none.
     */
    readonly authPassword: pulumi.Output<string | undefined>;
    /**
     * The SASL realm to bind to. Required if authScheme is CRAM_MD5 or DIGEST_MD5
     */
    readonly authRealm: pulumi.Output<string | undefined>;
    /**
     * Authentication scheme used for connecting to LDAP server
     */
    readonly authSchema: pulumi.Output<string>;
    /**
     * This must be a fully qualified username if simple authentication is used. Required if authScheme other than none.
     */
    readonly authUsername: pulumi.Output<string>;
    /**
     * How long to wait before retrying
     */
    readonly connectionRetryDelaySeconds: pulumi.Output<number>;
    /**
     * How long to wait before timeout
     */
    readonly connectionTimeoutSeconds: pulumi.Output<number>;
    /**
     * The relative DN where group objects are found (e.g. ou=Group). This value will have the Search base DN value appended to
     * form the full Group search base DN.
     */
    readonly groupBaseDn: pulumi.Output<string | undefined>;
    /**
     * This field specifies the attribute of the Object class that defines the Group ID. Required if groupType is static
     */
    readonly groupIdAttribute: pulumi.Output<string | undefined>;
    /**
     * LDAP attribute containing the usernames for the group. Required if groupType is static
     */
    readonly groupMemberAttribute: pulumi.Output<string | undefined>;
    /**
     * The format of user ID stored in the group member attribute. Required if groupType is static
     */
    readonly groupMemberFormat: pulumi.Output<string | undefined>;
    /**
     * LDAP class for group objects. Required if groupType is static
     */
    readonly groupObjectClass: pulumi.Output<string | undefined>;
    /**
     * Are groups located in structures below the group base DN
     */
    readonly groupSubtree: pulumi.Output<boolean | undefined>;
    /**
     * Defines a type of groups used: static (a group contains a list of users) or dynamic (a user contains a list of groups).
     * Required if ldapGroupsAsRoles is true.
     */
    readonly groupType: pulumi.Output<string>;
    /**
     * LDAP server connection hostname
     */
    readonly host: pulumi.Output<string>;
    /**
     * Denotes whether LDAP assigned roles are used as Nexus Repository Manager roles
     */
    readonly ldapGroupsAsRoles: pulumi.Output<boolean | undefined>;
    /**
     * How many retry attempts
     */
    readonly maxIncidentCount: pulumi.Output<number>;
    /**
     * LDAP server name
     */
    readonly name: pulumi.Output<string>;
    /**
     * LDAP server connection port to use
     */
    readonly port: pulumi.Output<number>;
    /**
     * LDAP server connection Protocol to use
     */
    readonly protocol: pulumi.Output<string>;
    /**
     * LDAP location to be added to the connection URL
     */
    readonly searchBase: pulumi.Output<string>;
    /**
     * Whether to use certificates stored in Nexus Repository Manager's truststore
     */
    readonly useTrustStore: pulumi.Output<boolean | undefined>;
    /**
     * The relative DN where user objects are found (e.g. ou=people). This value will have the Search base DN value appended to
     * form the full User search base DN.
     */
    readonly userBaseDn: pulumi.Output<string | undefined>;
    /**
     * This is used to find an email address given the user ID
     */
    readonly userEmailAddressAttribute: pulumi.Output<string | undefined>;
    /**
     * This is used to find a user given its user ID
     */
    readonly userIdAttribute: pulumi.Output<string | undefined>;
    /**
     * LDAP search filter to limit user search
     */
    readonly userLdapFilter: pulumi.Output<string | undefined>;
    /**
     * Set this to the attribute used to store the attribute which holds groups DN in the user object. Required if groupType is
     * dynamic
     */
    readonly userMemberOfAttribute: pulumi.Output<string | undefined>;
    /**
     * LDAP class for user objects
     */
    readonly userObjectClass: pulumi.Output<string | undefined>;
    /**
     * If this field is blank the user will be authenticated against a bind with the LDAP server
     */
    readonly userPasswordAttribute: pulumi.Output<string | undefined>;
    /**
     * This is used to find a real name given the user ID
     */
    readonly userRealNameAttribute: pulumi.Output<string | undefined>;
    /**
     * Are users located in structures below the user base DN?
     */
    readonly userSubtree: pulumi.Output<boolean | undefined>;
    /**
     * Create a SecurityLdap resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: SecurityLdapArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering SecurityLdap resources.
 */
export interface SecurityLdapState {
    /**
     * The password to bind with. Required if authScheme other than none.
     */
    authPassword?: pulumi.Input<string>;
    /**
     * The SASL realm to bind to. Required if authScheme is CRAM_MD5 or DIGEST_MD5
     */
    authRealm?: pulumi.Input<string>;
    /**
     * Authentication scheme used for connecting to LDAP server
     */
    authSchema?: pulumi.Input<string>;
    /**
     * This must be a fully qualified username if simple authentication is used. Required if authScheme other than none.
     */
    authUsername?: pulumi.Input<string>;
    /**
     * How long to wait before retrying
     */
    connectionRetryDelaySeconds?: pulumi.Input<number>;
    /**
     * How long to wait before timeout
     */
    connectionTimeoutSeconds?: pulumi.Input<number>;
    /**
     * The relative DN where group objects are found (e.g. ou=Group). This value will have the Search base DN value appended to
     * form the full Group search base DN.
     */
    groupBaseDn?: pulumi.Input<string>;
    /**
     * This field specifies the attribute of the Object class that defines the Group ID. Required if groupType is static
     */
    groupIdAttribute?: pulumi.Input<string>;
    /**
     * LDAP attribute containing the usernames for the group. Required if groupType is static
     */
    groupMemberAttribute?: pulumi.Input<string>;
    /**
     * The format of user ID stored in the group member attribute. Required if groupType is static
     */
    groupMemberFormat?: pulumi.Input<string>;
    /**
     * LDAP class for group objects. Required if groupType is static
     */
    groupObjectClass?: pulumi.Input<string>;
    /**
     * Are groups located in structures below the group base DN
     */
    groupSubtree?: pulumi.Input<boolean>;
    /**
     * Defines a type of groups used: static (a group contains a list of users) or dynamic (a user contains a list of groups).
     * Required if ldapGroupsAsRoles is true.
     */
    groupType?: pulumi.Input<string>;
    /**
     * LDAP server connection hostname
     */
    host?: pulumi.Input<string>;
    /**
     * Denotes whether LDAP assigned roles are used as Nexus Repository Manager roles
     */
    ldapGroupsAsRoles?: pulumi.Input<boolean>;
    /**
     * How many retry attempts
     */
    maxIncidentCount?: pulumi.Input<number>;
    /**
     * LDAP server name
     */
    name?: pulumi.Input<string>;
    /**
     * LDAP server connection port to use
     */
    port?: pulumi.Input<number>;
    /**
     * LDAP server connection Protocol to use
     */
    protocol?: pulumi.Input<string>;
    /**
     * LDAP location to be added to the connection URL
     */
    searchBase?: pulumi.Input<string>;
    /**
     * Whether to use certificates stored in Nexus Repository Manager's truststore
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * The relative DN where user objects are found (e.g. ou=people). This value will have the Search base DN value appended to
     * form the full User search base DN.
     */
    userBaseDn?: pulumi.Input<string>;
    /**
     * This is used to find an email address given the user ID
     */
    userEmailAddressAttribute?: pulumi.Input<string>;
    /**
     * This is used to find a user given its user ID
     */
    userIdAttribute?: pulumi.Input<string>;
    /**
     * LDAP search filter to limit user search
     */
    userLdapFilter?: pulumi.Input<string>;
    /**
     * Set this to the attribute used to store the attribute which holds groups DN in the user object. Required if groupType is
     * dynamic
     */
    userMemberOfAttribute?: pulumi.Input<string>;
    /**
     * LDAP class for user objects
     */
    userObjectClass?: pulumi.Input<string>;
    /**
     * If this field is blank the user will be authenticated against a bind with the LDAP server
     */
    userPasswordAttribute?: pulumi.Input<string>;
    /**
     * This is used to find a real name given the user ID
     */
    userRealNameAttribute?: pulumi.Input<string>;
    /**
     * Are users located in structures below the user base DN?
     */
    userSubtree?: pulumi.Input<boolean>;
}
/**
 * The set of arguments for constructing a SecurityLdap resource.
 */
export interface SecurityLdapArgs {
    /**
     * The password to bind with. Required if authScheme other than none.
     */
    authPassword?: pulumi.Input<string>;
    /**
     * The SASL realm to bind to. Required if authScheme is CRAM_MD5 or DIGEST_MD5
     */
    authRealm?: pulumi.Input<string>;
    /**
     * Authentication scheme used for connecting to LDAP server
     */
    authSchema: pulumi.Input<string>;
    /**
     * This must be a fully qualified username if simple authentication is used. Required if authScheme other than none.
     */
    authUsername: pulumi.Input<string>;
    /**
     * How long to wait before retrying
     */
    connectionRetryDelaySeconds: pulumi.Input<number>;
    /**
     * How long to wait before timeout
     */
    connectionTimeoutSeconds: pulumi.Input<number>;
    /**
     * The relative DN where group objects are found (e.g. ou=Group). This value will have the Search base DN value appended to
     * form the full Group search base DN.
     */
    groupBaseDn?: pulumi.Input<string>;
    /**
     * This field specifies the attribute of the Object class that defines the Group ID. Required if groupType is static
     */
    groupIdAttribute?: pulumi.Input<string>;
    /**
     * LDAP attribute containing the usernames for the group. Required if groupType is static
     */
    groupMemberAttribute?: pulumi.Input<string>;
    /**
     * The format of user ID stored in the group member attribute. Required if groupType is static
     */
    groupMemberFormat?: pulumi.Input<string>;
    /**
     * LDAP class for group objects. Required if groupType is static
     */
    groupObjectClass?: pulumi.Input<string>;
    /**
     * Are groups located in structures below the group base DN
     */
    groupSubtree?: pulumi.Input<boolean>;
    /**
     * Defines a type of groups used: static (a group contains a list of users) or dynamic (a user contains a list of groups).
     * Required if ldapGroupsAsRoles is true.
     */
    groupType: pulumi.Input<string>;
    /**
     * LDAP server connection hostname
     */
    host: pulumi.Input<string>;
    /**
     * Denotes whether LDAP assigned roles are used as Nexus Repository Manager roles
     */
    ldapGroupsAsRoles?: pulumi.Input<boolean>;
    /**
     * How many retry attempts
     */
    maxIncidentCount: pulumi.Input<number>;
    /**
     * LDAP server name
     */
    name?: pulumi.Input<string>;
    /**
     * LDAP server connection port to use
     */
    port: pulumi.Input<number>;
    /**
     * LDAP server connection Protocol to use
     */
    protocol: pulumi.Input<string>;
    /**
     * LDAP location to be added to the connection URL
     */
    searchBase: pulumi.Input<string>;
    /**
     * Whether to use certificates stored in Nexus Repository Manager's truststore
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * The relative DN where user objects are found (e.g. ou=people). This value will have the Search base DN value appended to
     * form the full User search base DN.
     */
    userBaseDn?: pulumi.Input<string>;
    /**
     * This is used to find an email address given the user ID
     */
    userEmailAddressAttribute?: pulumi.Input<string>;
    /**
     * This is used to find a user given its user ID
     */
    userIdAttribute?: pulumi.Input<string>;
    /**
     * LDAP search filter to limit user search
     */
    userLdapFilter?: pulumi.Input<string>;
    /**
     * Set this to the attribute used to store the attribute which holds groups DN in the user object. Required if groupType is
     * dynamic
     */
    userMemberOfAttribute?: pulumi.Input<string>;
    /**
     * LDAP class for user objects
     */
    userObjectClass?: pulumi.Input<string>;
    /**
     * If this field is blank the user will be authenticated against a bind with the LDAP server
     */
    userPasswordAttribute?: pulumi.Input<string>;
    /**
     * This is used to find a real name given the user ID
     */
    userRealNameAttribute?: pulumi.Input<string>;
    /**
     * Are users located in structures below the user base DN?
     */
    userSubtree?: pulumi.Input<boolean>;
}
