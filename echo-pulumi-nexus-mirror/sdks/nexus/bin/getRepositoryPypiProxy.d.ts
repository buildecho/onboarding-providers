import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryPypiProxy(args: GetRepositoryPypiProxyArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryPypiProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryPypiProxy.
 */
export interface GetRepositoryPypiProxyArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryPypiProxy.
 */
export interface GetRepositoryPypiProxyResult {
    readonly cleanups: outputs.GetRepositoryPypiProxyCleanup[];
    readonly httpClients: outputs.GetRepositoryPypiProxyHttpClient[];
    readonly id: string;
    readonly name: string;
    readonly negativeCaches: outputs.GetRepositoryPypiProxyNegativeCach[];
    readonly online: boolean;
    readonly proxies: outputs.GetRepositoryPypiProxyProxy[];
    readonly routingRule: string;
    readonly storages: outputs.GetRepositoryPypiProxyStorage[];
}
export declare function getRepositoryPypiProxyOutput(args: GetRepositoryPypiProxyOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryPypiProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryPypiProxy.
 */
export interface GetRepositoryPypiProxyOutputArgs {
    name: pulumi.Input<string>;
}
