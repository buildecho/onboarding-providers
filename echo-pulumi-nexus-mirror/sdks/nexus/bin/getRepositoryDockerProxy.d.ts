import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryDockerProxy(args: GetRepositoryDockerProxyArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryDockerProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryDockerProxy.
 */
export interface GetRepositoryDockerProxyArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryDockerProxy.
 */
export interface GetRepositoryDockerProxyResult {
    readonly cleanups: outputs.GetRepositoryDockerProxyCleanup[];
    readonly dockerProxies: outputs.GetRepositoryDockerProxyDockerProxy[];
    readonly dockers: outputs.GetRepositoryDockerProxyDocker[];
    readonly httpClients: outputs.GetRepositoryDockerProxyHttpClient[];
    readonly id: string;
    readonly name: string;
    readonly negativeCaches: outputs.GetRepositoryDockerProxyNegativeCach[];
    readonly online: boolean;
    readonly proxies: outputs.GetRepositoryDockerProxyProxy[];
    readonly routingRule: string;
    readonly storages: outputs.GetRepositoryDockerProxyStorage[];
}
export declare function getRepositoryDockerProxyOutput(args: GetRepositoryDockerProxyOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryDockerProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryDockerProxy.
 */
export interface GetRepositoryDockerProxyOutputArgs {
    name: pulumi.Input<string>;
}
