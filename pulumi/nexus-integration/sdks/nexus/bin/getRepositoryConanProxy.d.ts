import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryConanProxy(args: GetRepositoryConanProxyArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryConanProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryConanProxy.
 */
export interface GetRepositoryConanProxyArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryConanProxy.
 */
export interface GetRepositoryConanProxyResult {
    readonly cleanups: outputs.GetRepositoryConanProxyCleanup[];
    readonly httpClients: outputs.GetRepositoryConanProxyHttpClient[];
    readonly id: string;
    readonly name: string;
    readonly negativeCaches: outputs.GetRepositoryConanProxyNegativeCach[];
    readonly online: boolean;
    readonly proxies: outputs.GetRepositoryConanProxyProxy[];
    readonly routingRule: string;
    readonly storages: outputs.GetRepositoryConanProxyStorage[];
}
export declare function getRepositoryConanProxyOutput(args: GetRepositoryConanProxyOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryConanProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryConanProxy.
 */
export interface GetRepositoryConanProxyOutputArgs {
    name: pulumi.Input<string>;
}
