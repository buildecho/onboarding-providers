import * as pulumi from "@pulumi/pulumi";
export declare function getSecurityAnonymous(opts?: pulumi.InvokeOptions): Promise<GetSecurityAnonymousResult>;
/**
 * A collection of values returned by getSecurityAnonymous.
 */
export interface GetSecurityAnonymousResult {
    readonly enabled: boolean;
    readonly id: string;
    readonly realmName: string;
    readonly userId: string;
}
export declare function getSecurityAnonymousOutput(opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetSecurityAnonymousResult>;
