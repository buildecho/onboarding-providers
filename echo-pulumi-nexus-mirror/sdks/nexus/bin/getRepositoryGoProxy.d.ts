import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryGoProxy(args: GetRepositoryGoProxyArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryGoProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryGoProxy.
 */
export interface GetRepositoryGoProxyArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryGoProxy.
 */
export interface GetRepositoryGoProxyResult {
    readonly cleanups: outputs.GetRepositoryGoProxyCleanup[];
    readonly httpClients: outputs.GetRepositoryGoProxyHttpClient[];
    readonly id: string;
    readonly name: string;
    readonly negativeCaches: outputs.GetRepositoryGoProxyNegativeCach[];
    readonly online: boolean;
    readonly proxies: outputs.GetRepositoryGoProxyProxy[];
    readonly routingRule: string;
    readonly storages: outputs.GetRepositoryGoProxyStorage[];
}
export declare function getRepositoryGoProxyOutput(args: GetRepositoryGoProxyOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryGoProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryGoProxy.
 */
export interface GetRepositoryGoProxyOutputArgs {
    name: pulumi.Input<string>;
}
