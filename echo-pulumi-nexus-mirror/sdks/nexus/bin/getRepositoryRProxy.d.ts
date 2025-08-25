import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryRProxy(args: GetRepositoryRProxyArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryRProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryRProxy.
 */
export interface GetRepositoryRProxyArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryRProxy.
 */
export interface GetRepositoryRProxyResult {
    readonly cleanups: outputs.GetRepositoryRProxyCleanup[];
    readonly httpClients: outputs.GetRepositoryRProxyHttpClient[];
    readonly id: string;
    readonly name: string;
    readonly negativeCaches: outputs.GetRepositoryRProxyNegativeCach[];
    readonly online: boolean;
    readonly proxies: outputs.GetRepositoryRProxyProxy[];
    readonly routingRule: string;
    readonly storages: outputs.GetRepositoryRProxyStorage[];
}
export declare function getRepositoryRProxyOutput(args: GetRepositoryRProxyOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryRProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryRProxy.
 */
export interface GetRepositoryRProxyOutputArgs {
    name: pulumi.Input<string>;
}
