import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryHelmProxy(args: GetRepositoryHelmProxyArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryHelmProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryHelmProxy.
 */
export interface GetRepositoryHelmProxyArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryHelmProxy.
 */
export interface GetRepositoryHelmProxyResult {
    readonly cleanups: outputs.GetRepositoryHelmProxyCleanup[];
    readonly httpClients: outputs.GetRepositoryHelmProxyHttpClient[];
    readonly id: string;
    readonly name: string;
    readonly negativeCaches: outputs.GetRepositoryHelmProxyNegativeCach[];
    readonly online: boolean;
    readonly proxies: outputs.GetRepositoryHelmProxyProxy[];
    readonly routingRule: string;
    readonly storages: outputs.GetRepositoryHelmProxyStorage[];
}
export declare function getRepositoryHelmProxyOutput(args: GetRepositoryHelmProxyOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryHelmProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryHelmProxy.
 */
export interface GetRepositoryHelmProxyOutputArgs {
    name: pulumi.Input<string>;
}
