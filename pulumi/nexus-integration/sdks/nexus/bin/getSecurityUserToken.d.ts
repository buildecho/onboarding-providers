import * as pulumi from "@pulumi/pulumi";
export declare function getSecurityUserToken(opts?: pulumi.InvokeOptions): Promise<GetSecurityUserTokenResult>;
/**
 * A collection of values returned by getSecurityUserToken.
 */
export interface GetSecurityUserTokenResult {
    readonly enabled: boolean;
    readonly expirationDays: number;
    readonly expirationEnabled: boolean;
    readonly id: string;
    readonly protectContent: boolean;
}
export declare function getSecurityUserTokenOutput(opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetSecurityUserTokenResult>;
