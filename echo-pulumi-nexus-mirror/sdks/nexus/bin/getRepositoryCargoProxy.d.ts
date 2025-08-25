import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryCargoProxy(args: GetRepositoryCargoProxyArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryCargoProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryCargoProxy.
 */
export interface GetRepositoryCargoProxyArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryCargoProxy.
 */
export interface GetRepositoryCargoProxyResult {
    readonly cargoVersion: string;
    readonly cleanups: outputs.GetRepositoryCargoProxyCleanup[];
    readonly httpClients: outputs.GetRepositoryCargoProxyHttpClient[];
    readonly id: string;
    readonly name: string;
    readonly negativeCaches: outputs.GetRepositoryCargoProxyNegativeCach[];
    readonly online: boolean;
    readonly proxies: outputs.GetRepositoryCargoProxyProxy[];
    readonly queryCacheItemMaxAge: number;
    readonly routingRule: string;
    readonly storages: outputs.GetRepositoryCargoProxyStorage[];
}
export declare function getRepositoryCargoProxyOutput(args: GetRepositoryCargoProxyOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryCargoProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryCargoProxy.
 */
export interface GetRepositoryCargoProxyOutputArgs {
    name: pulumi.Input<string>;
}
