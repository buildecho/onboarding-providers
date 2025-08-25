import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryMavenProxy(args: GetRepositoryMavenProxyArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryMavenProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryMavenProxy.
 */
export interface GetRepositoryMavenProxyArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryMavenProxy.
 */
export interface GetRepositoryMavenProxyResult {
    readonly cleanups: outputs.GetRepositoryMavenProxyCleanup[];
    readonly httpClients: outputs.GetRepositoryMavenProxyHttpClient[];
    readonly id: string;
    readonly mavens: outputs.GetRepositoryMavenProxyMaven[];
    readonly name: string;
    readonly negativeCaches: outputs.GetRepositoryMavenProxyNegativeCach[];
    readonly online: boolean;
    readonly proxies: outputs.GetRepositoryMavenProxyProxy[];
    readonly routingRule: string;
    readonly storages: outputs.GetRepositoryMavenProxyStorage[];
}
export declare function getRepositoryMavenProxyOutput(args: GetRepositoryMavenProxyOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryMavenProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryMavenProxy.
 */
export interface GetRepositoryMavenProxyOutputArgs {
    name: pulumi.Input<string>;
}
