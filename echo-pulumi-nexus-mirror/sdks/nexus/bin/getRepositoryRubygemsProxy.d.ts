import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRepositoryRubygemsProxy(args: GetRepositoryRubygemsProxyArgs, opts?: pulumi.InvokeOptions): Promise<GetRepositoryRubygemsProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryRubygemsProxy.
 */
export interface GetRepositoryRubygemsProxyArgs {
    name: string;
}
/**
 * A collection of values returned by getRepositoryRubygemsProxy.
 */
export interface GetRepositoryRubygemsProxyResult {
    readonly cleanups: outputs.GetRepositoryRubygemsProxyCleanup[];
    readonly httpClients: outputs.GetRepositoryRubygemsProxyHttpClient[];
    readonly id: string;
    readonly name: string;
    readonly negativeCaches: outputs.GetRepositoryRubygemsProxyNegativeCach[];
    readonly online: boolean;
    readonly proxies: outputs.GetRepositoryRubygemsProxyProxy[];
    readonly routingRule: string;
    readonly storages: outputs.GetRepositoryRubygemsProxyStorage[];
}
export declare function getRepositoryRubygemsProxyOutput(args: GetRepositoryRubygemsProxyOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRepositoryRubygemsProxyResult>;
/**
 * A collection of arguments for invoking getRepositoryRubygemsProxy.
 */
export interface GetRepositoryRubygemsProxyOutputArgs {
    name: pulumi.Input<string>;
}
