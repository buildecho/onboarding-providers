import * as pulumi from "@pulumi/pulumi";
export declare class MailConfig extends pulumi.CustomResource {
    /**
     * Get an existing MailConfig resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: MailConfigState, opts?: pulumi.CustomResourceOptions): MailConfig;
    /**
     * Returns true if the given object is an instance of MailConfig.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is MailConfig;
    /**
     * Whether the config is enabled or not
     */
    readonly enabled: pulumi.Output<boolean | undefined>;
    /**
     * fromAddress
     */
    readonly fromAddress: pulumi.Output<string>;
    /**
     * hostname
     */
    readonly host: pulumi.Output<string>;
    /**
     * SSL on connect enabled
     */
    readonly nexusTrustStoreEnabled: pulumi.Output<boolean | undefined>;
    /**
     * Password
     */
    readonly password: pulumi.Output<string | undefined>;
    /**
     * port
     */
    readonly port: pulumi.Output<number>;
    /**
     * SSL on connect enabled
     */
    readonly sslOnConnectEnabled: pulumi.Output<boolean | undefined>;
    /**
     * SSL on connect enabled
     */
    readonly sslServerIdentityCheckEnabled: pulumi.Output<boolean | undefined>;
    /**
     * Star TLS Enabled
     */
    readonly startTlsEnabled: pulumi.Output<boolean | undefined>;
    /**
     * Star TLS required
     */
    readonly startTlsRequired: pulumi.Output<boolean | undefined>;
    /**
     * Subject prefix
     */
    readonly subjectPrefix: pulumi.Output<string | undefined>;
    /**
     * Username
     */
    readonly username: pulumi.Output<string | undefined>;
    /**
     * Create a MailConfig resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: MailConfigArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering MailConfig resources.
 */
export interface MailConfigState {
    /**
     * Whether the config is enabled or not
     */
    enabled?: pulumi.Input<boolean>;
    /**
     * fromAddress
     */
    fromAddress?: pulumi.Input<string>;
    /**
     * hostname
     */
    host?: pulumi.Input<string>;
    /**
     * SSL on connect enabled
     */
    nexusTrustStoreEnabled?: pulumi.Input<boolean>;
    /**
     * Password
     */
    password?: pulumi.Input<string>;
    /**
     * port
     */
    port?: pulumi.Input<number>;
    /**
     * SSL on connect enabled
     */
    sslOnConnectEnabled?: pulumi.Input<boolean>;
    /**
     * SSL on connect enabled
     */
    sslServerIdentityCheckEnabled?: pulumi.Input<boolean>;
    /**
     * Star TLS Enabled
     */
    startTlsEnabled?: pulumi.Input<boolean>;
    /**
     * Star TLS required
     */
    startTlsRequired?: pulumi.Input<boolean>;
    /**
     * Subject prefix
     */
    subjectPrefix?: pulumi.Input<string>;
    /**
     * Username
     */
    username?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a MailConfig resource.
 */
export interface MailConfigArgs {
    /**
     * Whether the config is enabled or not
     */
    enabled?: pulumi.Input<boolean>;
    /**
     * fromAddress
     */
    fromAddress: pulumi.Input<string>;
    /**
     * hostname
     */
    host: pulumi.Input<string>;
    /**
     * SSL on connect enabled
     */
    nexusTrustStoreEnabled?: pulumi.Input<boolean>;
    /**
     * Password
     */
    password?: pulumi.Input<string>;
    /**
     * port
     */
    port: pulumi.Input<number>;
    /**
     * SSL on connect enabled
     */
    sslOnConnectEnabled?: pulumi.Input<boolean>;
    /**
     * SSL on connect enabled
     */
    sslServerIdentityCheckEnabled?: pulumi.Input<boolean>;
    /**
     * Star TLS Enabled
     */
    startTlsEnabled?: pulumi.Input<boolean>;
    /**
     * Star TLS required
     */
    startTlsRequired?: pulumi.Input<boolean>;
    /**
     * Subject prefix
     */
    subjectPrefix?: pulumi.Input<string>;
    /**
     * Username
     */
    username?: pulumi.Input<string>;
}
