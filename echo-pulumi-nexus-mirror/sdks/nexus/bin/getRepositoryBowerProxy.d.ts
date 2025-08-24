import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryBowerProxy(args: GetRepositoryBowerProxyArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryBowerProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryBowerProxy.
 */
export interface GetRepositoryBowerProxyArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryBowerProxy.
 */
export interface GetRepositoryBowerProxyResult {
    readonly cleanups: outputs.GetRepositoryBowerProxyCleanup[];
    readonly httpClients: outputs.GetRepositoryBowerProxyHttpClient[];
    readonly id: string;
    readonly name: string;
    readonly negativeCaches: outputs.GetRepositoryBowerProxyNegativeCach[];
    readonly online: boolean;
    readonly proxies: outputs.GetRepositoryBowerProxyProxy[];
    readonly rewritePackageUrls: boolean;
    readonly routingRule: string;
    readonly storages: outputs.GetRepositoryBowerProxyStorage[];
}
export declare function getRepositoryBowerProxyOutput(args: GetRepositoryBowerProxyOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryBowerProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryBowerProxy.
 */
export interface GetRepositoryBowerProxyOutputArgs {
    name: pulumi.Input<string>;
}
