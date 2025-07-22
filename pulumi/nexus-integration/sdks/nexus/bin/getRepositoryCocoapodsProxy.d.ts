import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryCocoapodsProxy(args: GetRepositoryCocoapodsProxyArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryCocoapodsProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryCocoapodsProxy.
 */
export interface GetRepositoryCocoapodsProxyArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryCocoapodsProxy.
 */
export interface GetRepositoryCocoapodsProxyResult {
    readonly cleanups: outputs.GetRepositoryCocoapodsProxyCleanup[];
    readonly httpClients: outputs.GetRepositoryCocoapodsProxyHttpClient[];
    readonly id: string;
    readonly name: string;
    readonly negativeCaches: outputs.GetRepositoryCocoapodsProxyNegativeCach[];
    readonly online: boolean;
    readonly proxies: outputs.GetRepositoryCocoapodsProxyProxy[];
    readonly routingRule: string;
    readonly storages: outputs.GetRepositoryCocoapodsProxyStorage[];
}
export declare function getRepositoryCocoapodsProxyOutput(args: GetRepositoryCocoapodsProxyOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryCocoapodsProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryCocoapodsProxy.
 */
export interface GetRepositoryCocoapodsProxyOutputArgs {
    name: pulumi.Input<string>;
}
