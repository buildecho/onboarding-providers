import * as pulumi from "@pulumi/pulumi";
export declare function getSecuritySsl(args: GetSecuritySslArgs, opts?: pulumi.InvokeOptions): Promise<GetSecuritySslResult>;
/**
 * A collection of arguments for invoking getSecuritySsl.
 */
export interface GetSecuritySslArgs {
    host: string;
    port?: number;
}
/**
 * A collection of values returned by getSecuritySsl.
 */
export interface GetSecuritySslResult {
    readonly expiresOn: number;
    readonly fingerprint: string;
    readonly host: string;
    readonly id: string;
    readonly issuedOn: number;
    readonly issuerCommonName: string;
    readonly issuerOrganization: string;
    readonly issuerOrganizationUnit: string;
    readonly pem: string;
    readonly port?: number;
    readonly serialNumber: string;
    readonly subjectCommonName: string;
    readonly subjectOrganization: string;
    readonly subjectOrganizationUnit: string;
}
export declare function getSecuritySslOutput(args: GetSecuritySslOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetSecuritySslResult>;
/**
 * A collection of arguments for invoking getSecuritySsl.
 */
export interface GetSecuritySslOutputArgs {
    host: pulumi.Input<string>;
    port?: pulumi.Input<number>;
}
