import * as pulumi from "@pulumi/pulumi";
export declare function getSecuritySaml(opts?: pulumi.InvokeOptions): Promise<GetSecuritySamlResult>;
/**
 * A collection of values returned by getSecuritySaml.
 */
export interface GetSecuritySamlResult {
    readonly emailAttribute: string;
    readonly entityId: string;
    readonly firstNameAttribute: string;
    readonly groupsAttribute: string;
    readonly id: string;
    readonly idpMetadata: string;
    readonly lastNameAttribute: string;
    readonly usernameAttribute: string;
    readonly validateAssertionSignature: boolean;
    readonly validateResponseSignature: boolean;
}
export declare function getSecuritySamlOutput(opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetSecuritySamlResult>;
