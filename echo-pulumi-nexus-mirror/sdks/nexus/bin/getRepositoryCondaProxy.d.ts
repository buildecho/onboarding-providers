import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryCondaProxy(args: GetRepositoryCondaProxyArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryCondaProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryCondaProxy.
 */
export interface GetRepositoryCondaProxyArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryCondaProxy.
 */
export interface GetRepositoryCondaProxyResult {
    readonly cleanups: outputs.GetRepositoryCondaProxyCleanup[];
    readonly httpClients: outputs.GetRepositoryCondaProxyHttpClient[];
    readonly id: string;
    readonly name: string;
    readonly negativeCaches: outputs.GetRepositoryCondaProxyNegativeCach[];
    readonly online: boolean;
    readonly proxies: outputs.GetRepositoryCondaProxyProxy[];
    readonly routingRule: string;
    readonly storages: outputs.GetRepositoryCondaProxyStorage[];
}
export declare function getRepositoryCondaProxyOutput(args: GetRepositoryCondaProxyOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryCondaProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryCondaProxy.
 */
export interface GetRepositoryCondaProxyOutputArgs {
    name: pulumi.Input<string>;
}
