import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getSecurityRealms(opts?: pulumi.InvokeOptions): Promise<GetSecurityRealmsResult>;
/**
 * A collection of values returned by getSecurityRealms.
 */
export interface GetSecurityRealmsResult {
    readonly actives: outputs.GetSecurityRealmsActive[];
    readonly availables: outputs.GetSecurityRealmsAvailable[];
    readonly id: string;
}
export declare function getSecurityRealmsOutput(opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetSecurityRealmsResult>;
