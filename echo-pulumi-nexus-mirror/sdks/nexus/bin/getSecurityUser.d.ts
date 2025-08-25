import * as pulumi from "@pulumi/pulumi";
export declare function getSecurityUser(args: GetSecurityUserArgs, opts?: pulumi.InvokeOptions): Promise<GetSecurityUserResult>;
/**
 * A collection of arguments for invoking getSecurityUser.
 */
export interface GetSecurityUserArgs {
    userid: string;
}
/**
 * A collection of values returned by getSecurityUser.
 */
export interface GetSecurityUserResult {
    readonly email: string;
    readonly firstname: string;
    readonly id: string;
    readonly lastname: string;
    readonly roles: string[];
    readonly status: string;
    readonly userid: string;
}
export declare function getSecurityUserOutput(args: GetSecurityUserOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetSecurityUserResult>;
/**
 * A collection of arguments for invoking getSecurityUser.
 */
export interface GetSecurityUserOutputArgs {
    userid: pulumi.Input<string>;
}
