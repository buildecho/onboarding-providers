import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryYumProxy(args: GetRepositoryYumProxyArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryYumProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryYumProxy.
 */
export interface GetRepositoryYumProxyArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryYumProxy.
 */
export interface GetRepositoryYumProxyResult {
    readonly cleanups: outputs.GetRepositoryYumProxyCleanup[];
    readonly httpClients: outputs.GetRepositoryYumProxyHttpClient[];
    readonly id: string;
    readonly name: string;
    readonly negativeCaches: outputs.GetRepositoryYumProxyNegativeCach[];
    readonly online: boolean;
    readonly proxies: outputs.GetRepositoryYumProxyProxy[];
    readonly routingRule: string;
    readonly storages: outputs.GetRepositoryYumProxyStorage[];
    readonly yumSignings: outputs.GetRepositoryYumProxyYumSigning[];
}
export declare function getRepositoryYumProxyOutput(args: GetRepositoryYumProxyOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryYumProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryYumProxy.
 */
export interface GetRepositoryYumProxyOutputArgs {
    name: pulumi.Input<string>;
}
