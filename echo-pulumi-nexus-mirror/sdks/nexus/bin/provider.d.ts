import * as pulumi from "@pulumi/pulumi";
/**
 * The provider type for the nexus package. By default, resources use package-wide configuration
 * settings, however an explicit `Provider` instance may be created and passed during resource
 * construction to achieve fine-grained programmatic control over provider settings. See the
 * [documentation](https://www.pulumi.com/docs/reference/programming-model/#providers) for more information.
 */
export declare class Provider extends pulumi.ProviderResource {
    /**
     * Returns true if the given object is an instance of Provider.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is Provider;
    /**
     * Path to a client PEM certificate to load for mTLS. Reading environment variable NEXUS_CLIENT_CERT_PATH. Default:``
     */
    readonly clientCertPath: pulumi.Output<string | undefined>;
    /**
     * Path to a client PEM key to load for mTLS. Reading environment variable NEXUS_CLIENT_KEY_PATH. Default:``
     */
    readonly clientKeyPath: pulumi.Output<string | undefined>;
    /**
     * Password of user to connect to API. Reading environment variable NEXUS_PASSWORD. Default:`admin123`
     */
    readonly password: pulumi.Output<string | undefined>;
    /**
     * Path to a root CA certificate to load for mTLS. Reading environment variable NEXUS_ROOT_CA_PATH. Default:``
     */
    readonly rootCaPath: pulumi.Output<string | undefined>;
    /**
     * URL of Nexus to reach API. Reading environment variable NEXUS_URL. Default:`http://127.0.0.1:8080`
     */
    readonly url: pulumi.Output<string | undefined>;
    /**
     * Username used to connect to API. Reading environment variable NEXUS_USERNAME. Default:`admin`
     */
    readonly username: pulumi.Output<string | undefined>;
    /**
     * Create a Provider resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: ProviderArgs, opts?: pulumi.ResourceOptions);
    /**
     * This function returns a Terraform config object with terraform-namecased keys,to be used with the Terraform Module Provider.
     */
    terraformConfig(): pulumi.Output<{
        [key: string]: any;
    }>;
}
/**
 * The set of arguments for constructing a Provider resource.
 */
export interface ProviderArgs {
    /**
     * Path to a client PEM certificate to load for mTLS. Reading environment variable NEXUS_CLIENT_CERT_PATH. Default:``
     */
    clientCertPath?: pulumi.Input<string>;
    /**
     * Path to a client PEM key to load for mTLS. Reading environment variable NEXUS_CLIENT_KEY_PATH. Default:``
     */
    clientKeyPath?: pulumi.Input<string>;
    /**
     * Boolean to specify wether insecure SSL connections are allowed or not. Reading environment variable
     * NEXUS_INSECURE_SKIP_VERIFY. Default:`true`
     */
    insecure?: pulumi.Input<boolean>;
    /**
     * Password of user to connect to API. Reading environment variable NEXUS_PASSWORD. Default:`admin123`
     */
    password?: pulumi.Input<string>;
    /**
     * Path to a root CA certificate to load for mTLS. Reading environment variable NEXUS_ROOT_CA_PATH. Default:``
     */
    rootCaPath?: pulumi.Input<string>;
    /**
     * Timeout in seconds to connect to API. Reading environment variable NEXUS_TIMEOUT. Default:`30`
     */
    timeout?: pulumi.Input<number>;
    /**
     * URL of Nexus to reach API. Reading environment variable NEXUS_URL. Default:`http://127.0.0.1:8080`
     */
    url?: pulumi.Input<string>;
    /**
     * Username used to connect to API. Reading environment variable NEXUS_USERNAME. Default:`admin`
     */
    username?: pulumi.Input<string>;
}
export declare namespace Provider {
    /**
     * The results of the Provider.terraformConfig method.
     */
    interface TerraformConfigResult {
        readonly result: {
            [key: string]: any;
        };
    }
}
