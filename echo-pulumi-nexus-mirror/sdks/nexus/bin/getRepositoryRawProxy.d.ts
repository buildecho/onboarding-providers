import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryRawProxy(args: GetRepositoryRawProxyArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryRawProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryRawProxy.
 */
export interface GetRepositoryRawProxyArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryRawProxy.
 */
export interface GetRepositoryRawProxyResult {
    readonly cleanups: outputs.GetRepositoryRawProxyCleanup[];
    readonly httpClients: outputs.GetRepositoryRawProxyHttpClient[];
    readonly id: string;
    readonly name: string;
    readonly negativeCaches: outputs.GetRepositoryRawProxyNegativeCach[];
    readonly online: boolean;
    readonly proxies: outputs.GetRepositoryRawProxyProxy[];
    readonly routingRule: string;
    readonly storages: outputs.GetRepositoryRawProxyStorage[];
}
export declare function getRepositoryRawProxyOutput(args: GetRepositoryRawProxyOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryRawProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryRawProxy.
 */
export interface GetRepositoryRawProxyOutputArgs {
    name: pulumi.Input<string>;
}
