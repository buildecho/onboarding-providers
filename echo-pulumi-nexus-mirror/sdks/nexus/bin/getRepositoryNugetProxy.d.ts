import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryNugetProxy(args: GetRepositoryNugetProxyArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryNugetProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryNugetProxy.
 */
export interface GetRepositoryNugetProxyArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryNugetProxy.
 */
export interface GetRepositoryNugetProxyResult {
    readonly cleanups: outputs.GetRepositoryNugetProxyCleanup[];
    readonly httpClients: outputs.GetRepositoryNugetProxyHttpClient[];
    readonly id: string;
    readonly name: string;
    readonly negativeCaches: outputs.GetRepositoryNugetProxyNegativeCach[];
    readonly nugetVersion: string;
    readonly online: boolean;
    readonly proxies: outputs.GetRepositoryNugetProxyProxy[];
    readonly queryCacheItemMaxAge: number;
    readonly routingRule: string;
    readonly storages: outputs.GetRepositoryNugetProxyStorage[];
}
export declare function getRepositoryNugetProxyOutput(args: GetRepositoryNugetProxyOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryNugetProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryNugetProxy.
 */
export interface GetRepositoryNugetProxyOutputArgs {
    name: pulumi.Input<string>;
}
