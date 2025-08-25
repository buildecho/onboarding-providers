import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryNpmProxy(args: GetRepositoryNpmProxyArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryNpmProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryNpmProxy.
 */
export interface GetRepositoryNpmProxyArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryNpmProxy.
 */
export interface GetRepositoryNpmProxyResult {
    readonly cleanups: outputs.GetRepositoryNpmProxyCleanup[];
    readonly httpClients: outputs.GetRepositoryNpmProxyHttpClient[];
    readonly id: string;
    readonly name: string;
    readonly negativeCaches: outputs.GetRepositoryNpmProxyNegativeCach[];
    readonly online: boolean;
    readonly proxies: outputs.GetRepositoryNpmProxyProxy[];
    /**
     * @deprecated Deprecated
     */
    readonly removeNonCataloged: boolean;
    readonly removeQuarantined: boolean;
    readonly routingRule: string;
    readonly storages: outputs.GetRepositoryNpmProxyStorage[];
}
export declare function getRepositoryNpmProxyOutput(args: GetRepositoryNpmProxyOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryNpmProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryNpmProxy.
 */
export interface GetRepositoryNpmProxyOutputArgs {
    name: pulumi.Input<string>;
}
