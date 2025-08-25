import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryAptProxy(args: GetRepositoryAptProxyArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryAptProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryAptProxy.
 */
export interface GetRepositoryAptProxyArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryAptProxy.
 */
export interface GetRepositoryAptProxyResult {
    readonly cleanups: outputs.GetRepositoryAptProxyCleanup[];
    readonly distribution: string;
    readonly flat: boolean;
    readonly httpClients: outputs.GetRepositoryAptProxyHttpClient[];
    readonly id: string;
    readonly name: string;
    readonly negativeCaches: outputs.GetRepositoryAptProxyNegativeCach[];
    readonly online: boolean;
    readonly proxies: outputs.GetRepositoryAptProxyProxy[];
    readonly routingRule: string;
    readonly storages: outputs.GetRepositoryAptProxyStorage[];
}
export declare function getRepositoryAptProxyOutput(args: GetRepositoryAptProxyOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryAptProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryAptProxy.
 */
export interface GetRepositoryAptProxyOutputArgs {
    name: pulumi.Input<string>;
}
