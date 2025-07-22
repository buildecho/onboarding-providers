import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class RepositoryYumHosted extends pulumi.CustomResource {
    /**
     * Get an existing RepositoryYumHosted resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: RepositoryYumHostedState, opts?: pulumi.CustomResourceOptions): RepositoryYumHosted;
    /**
     * Returns true if the given object is an instance of RepositoryYumHosted.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is RepositoryYumHosted;
    /**
     * Cleanup policies
     */
    readonly cleanups: pulumi.Output<outputs.RepositoryYumHostedCleanup[] | undefined>;
    /**
     * Component configuration for the hosted repository
     */
    readonly component: pulumi.Output<outputs.RepositoryYumHostedComponent | undefined>;
    /**
     * Validate that all paths are RPMs or yum metadata. Possible values: `STRICT` or `PERMISSIVE`
     */
    readonly deployPolicy: pulumi.Output<string | undefined>;
    /**
     * A unique identifier for this repository
     */
    readonly name: pulumi.Output<string>;
    /**
     * Whether this repository accepts incoming requests
     */
    readonly online: pulumi.Output<boolean | undefined>;
    /**
     * Specifies the repository depth where repodata folder(s) are created. Possible values: 0-5
     */
    readonly repodataDepth: pulumi.Output<number | undefined>;
    /**
     * The storage configuration of the repository
     */
    readonly storage: pulumi.Output<outputs.RepositoryYumHostedStorage>;
    /**
     * Create a RepositoryYumHosted resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: RepositoryYumHostedArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering RepositoryYumHosted resources.
 */
export interface RepositoryYumHostedState {
    /**
     * Cleanup policies
     */
    cleanups?: pulumi.Input<pulumi.Input<inputs.RepositoryYumHostedCleanup>[]>;
    /**
     * Component configuration for the hosted repository
     */
    component?: pulumi.Input<inputs.RepositoryYumHostedComponent>;
    /**
     * Validate that all paths are RPMs or yum metadata. Possible values: `STRICT` or `PERMISSIVE`
     */
    deployPolicy?: pulumi.Input<string>;
    /**
     * A unique identifier for this repository
     */
    name?: pulumi.Input<string>;
    /**
     * Whether this repository accepts incoming requests
     */
    online?: pulumi.Input<boolean>;
    /**
     * Specifies the repository depth where repodata folder(s) are created. Possible values: 0-5
     */
    repodataDepth?: pulumi.Input<number>;
    /**
     * The storage configuration of the repository
     */
    storage?: pulumi.Input<inputs.RepositoryYumHostedStorage>;
}
/**
 * The set of arguments for constructing a RepositoryYumHosted resource.
 */
export interface RepositoryYumHostedArgs {
    /**
     * Cleanup policies
     */
    cleanups?: pulumi.Input<pulumi.Input<inputs.RepositoryYumHostedCleanup>[]>;
    /**
     * Component configuration for the hosted repository
     */
    component?: pulumi.Input<inputs.RepositoryYumHostedComponent>;
    /**
     * Validate that all paths are RPMs or yum metadata. Possible values: `STRICT` or `PERMISSIVE`
     */
    deployPolicy?: pulumi.Input<string>;
    /**
     * A unique identifier for this repository
     */
    name?: pulumi.Input<string>;
    /**
     * Whether this repository accepts incoming requests
     */
    online?: pulumi.Input<boolean>;
    /**
     * Specifies the repository depth where repodata folder(s) are created. Possible values: 0-5
     */
    repodataDepth?: pulumi.Input<number>;
    /**
     * The storage configuration of the repository
     */
    storage: pulumi.Input<inputs.RepositoryYumHostedStorage>;
}
