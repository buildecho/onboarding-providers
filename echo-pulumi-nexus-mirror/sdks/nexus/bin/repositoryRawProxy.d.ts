import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class RepositoryRawProxy extends pulumi.CustomResource {
    /**
     * Get an existing RepositoryRawProxy resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: RepositoryRawProxyState, opts?: pulumi.CustomResourceOptions): RepositoryRawProxy;
    /**
     * Returns true if the given object is an instance of RepositoryRawProxy.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is RepositoryRawProxy;
    /**
     * Cleanup policies
     */
    readonly cleanups: pulumi.Output<outputs.RepositoryRawProxyCleanup[] | undefined>;
    /**
     * HTTP Client configuration for proxy repositories
     */
    readonly httpClient: pulumi.Output<outputs.RepositoryRawProxyHttpClient>;
    /**
     * A unique identifier for this repository
     */
    readonly name: pulumi.Output<string>;
    /**
     * Configuration of the negative cache handling
     */
    readonly negativeCache: pulumi.Output<outputs.RepositoryRawProxyNegativeCache>;
    /**
     * Whether this repository accepts incoming requests
     */
    readonly online: pulumi.Output<boolean | undefined>;
    /**
     * Configuration for the proxy repository
     */
    readonly proxy: pulumi.Output<outputs.RepositoryRawProxyProxy>;
    /**
     * The name of the routing rule assigned to this repository
     */
    readonly routingRule: pulumi.Output<string | undefined>;
    /**
     * The storage configuration of the repository
     */
    readonly storage: pulumi.Output<outputs.RepositoryRawProxyStorage>;
    /**
     * Create a RepositoryRawProxy resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: RepositoryRawProxyArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering RepositoryRawProxy resources.
 */
export interface RepositoryRawProxyState {
    /**
     * Cleanup policies
     */
    cleanups?: pulumi.Input<pulumi.Input<inputs.RepositoryRawProxyCleanup>[]>;
    /**
     * HTTP Client configuration for proxy repositories
     */
    httpClient?: pulumi.Input<inputs.RepositoryRawProxyHttpClient>;
    /**
     * A unique identifier for this repository
     */
    name?: pulumi.Input<string>;
    /**
     * Configuration of the negative cache handling
     */
    negativeCache?: pulumi.Input<inputs.RepositoryRawProxyNegativeCache>;
    /**
     * Whether this repository accepts incoming requests
     */
    online?: pulumi.Input<boolean>;
    /**
     * Configuration for the proxy repository
     */
    proxy?: pulumi.Input<inputs.RepositoryRawProxyProxy>;
    /**
     * The name of the routing rule assigned to this repository
     */
    routingRule?: pulumi.Input<string>;
    /**
     * The storage configuration of the repository
     */
    storage?: pulumi.Input<inputs.RepositoryRawProxyStorage>;
}
/**
 * The set of arguments for constructing a RepositoryRawProxy resource.
 */
export interface RepositoryRawProxyArgs {
    /**
     * Cleanup policies
     */
    cleanups?: pulumi.Input<pulumi.Input<inputs.RepositoryRawProxyCleanup>[]>;
    /**
     * HTTP Client configuration for proxy repositories
     */
    httpClient: pulumi.Input<inputs.RepositoryRawProxyHttpClient>;
    /**
     * A unique identifier for this repository
     */
    name?: pulumi.Input<string>;
    /**
     * Configuration of the negative cache handling
     */
    negativeCache: pulumi.Input<inputs.RepositoryRawProxyNegativeCache>;
    /**
     * Whether this repository accepts incoming requests
     */
    online?: pulumi.Input<boolean>;
    /**
     * Configuration for the proxy repository
     */
    proxy: pulumi.Input<inputs.RepositoryRawProxyProxy>;
    /**
     * The name of the routing rule assigned to this repository
     */
    routingRule?: pulumi.Input<string>;
    /**
     * The storage configuration of the repository
     */
    storage: pulumi.Input<inputs.RepositoryRawProxyStorage>;
}
