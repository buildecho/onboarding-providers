import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getSecuritySslTruststore(opts?: pulumi.InvokeOptions): Promise<GetSecuritySslTruststoreResult>;
/**
 * A collection of values returned by getSecuritySslTruststore.
 */
export interface GetSecuritySslTruststoreResult {
    readonly certificates: outputs.GetSecuritySslTruststoreCertificate[];
    readonly id: string;
}
export declare function getSecuritySslTruststoreOutput(opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetSecuritySslTruststoreResult>;
