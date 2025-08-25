import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getSecurityLdap(opts?: pulumi.InvokeOptions): Promise<GetSecurityLdapResult>;
/**
 * A collection of values returned by getSecurityLdap.
 */
export interface GetSecurityLdapResult {
    readonly id: string;
    readonly ldaps: outputs.GetSecurityLdapLdap[];
}
export declare function getSecurityLdapOutput(opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetSecurityLdapResult>;
