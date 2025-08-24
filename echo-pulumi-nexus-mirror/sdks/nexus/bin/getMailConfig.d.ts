import * as pulumi from "@pulumi/pulumi";
export declare function getMailConfig(opts?: pulumi.InvokeOptions): Promise<GetMailConfigResult>;
/**
 * A collection of values returned by getMailConfig.
 */
export interface GetMailConfigResult {
    readonly enabled: boolean;
    readonly fromAddress: string;
    readonly host: string;
    readonly id: string;
    readonly nexusTrustStoreEnabled: boolean;
    readonly port: number;
    readonly sslOnConnectEnabled: boolean;
    readonly sslServerIdentityCheckEnabled: boolean;
    readonly startTlsEnabled: boolean;
    readonly startTlsRequired: boolean;
    readonly subjectPrefix: string;
    readonly username: string;
}
export declare function getMailConfigOutput(opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetMailConfigResult>;
