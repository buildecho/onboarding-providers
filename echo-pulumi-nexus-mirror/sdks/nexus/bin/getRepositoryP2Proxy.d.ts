import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryP2Proxy(args: GetRepositoryP2ProxyArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryP2ProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryP2Proxy.
 */
export interface GetRepositoryP2ProxyArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryP2Proxy.
 */
export interface GetRepositoryP2ProxyResult {
    readonly cleanups: outputs.GetRepositoryP2ProxyCleanup[];
    readonly httpClients: outputs.GetRepositoryP2ProxyHttpClient[];
    readonly id: string;
    readonly name: string;
    readonly negativeCaches: outputs.GetRepositoryP2ProxyNegativeCach[];
    readonly online: boolean;
    readonly proxies: outputs.GetRepositoryP2ProxyProxy[];
    readonly routingRule: string;
    readonly storages: outputs.GetRepositoryP2ProxyStorage[];
}
export declare function getRepositoryP2ProxyOutput(args: GetRepositoryP2ProxyOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryP2ProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryP2Proxy.
 */
export interface GetRepositoryP2ProxyOutputArgs {
    name: pulumi.Input<string>;
}
