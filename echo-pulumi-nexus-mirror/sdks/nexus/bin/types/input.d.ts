import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
export interface BlobstoreAzureBucketConfiguration {
    /**
     * Account name found under Access keys for the storage account
     */
    accountName: pulumi.Input<string>;
    /**
     * The Azure specific authentication details
     */
    authentication: pulumi.Input<inputs.BlobstoreAzureBucketConfigurationAuthentication>;
    /**
     * The name of an existing container to be used for storage
     */
    containerName: pulumi.Input<string>;
}
export interface BlobstoreAzureBucketConfigurationAuthentication {
    /**
     * The account key. Required if `authentication_method` is `ACCOUNTKEY`
     */
    accountKey?: pulumi.Input<string>;
    /**
     * The type of Azure authentication to use. Possible values: `ACCOUNTKEY` and `MANAGEDIDENTITY`
     */
    authenticationMethod: pulumi.Input<string>;
}
export interface BlobstoreAzureSoftQuota {
    /**
     * The limit in Bytes. Minimum value is 1000000
     */
    limit: pulumi.Input<number>;
    /**
     * The type to use such as spaceRemainingQuota, or spaceUsedQuota
     */
    type: pulumi.Input<string>;
}
export interface BlobstoreFileSoftQuota {
    /**
     * The limit in Bytes. Minimum value is 1000000
     */
    limit: pulumi.Input<number>;
    /**
     * The type to use such as spaceRemainingQuota, or spaceUsedQuota
     */
    type: pulumi.Input<string>;
}
export interface BlobstoreGroupSoftQuota {
    /**
     * The limit in Bytes. Minimum value is 1000000
     */
    limit: pulumi.Input<number>;
    /**
     * The type to use such as spaceRemainingQuota, or spaceUsedQuota
     */
    type: pulumi.Input<string>;
}
export interface BlobstoreS3BucketConfiguration {
    /**
     * Additional connection configurations
     */
    advancedBucketConnection?: pulumi.Input<inputs.BlobstoreS3BucketConfigurationAdvancedBucketConnection>;
    /**
     * The S3 bucket configuration
     */
    bucket: pulumi.Input<inputs.BlobstoreS3BucketConfigurationBucket>;
    /**
     * Additional security configurations
     */
    bucketSecurity?: pulumi.Input<inputs.BlobstoreS3BucketConfigurationBucketSecurity>;
    /**
     * Additional bucket encryption configurations
     */
    encryption?: pulumi.Input<inputs.BlobstoreS3BucketConfigurationEncryption>;
}
export interface BlobstoreS3BucketConfigurationAdvancedBucketConnection {
    /**
     * A custom endpoint URL for third party object stores using the S3 API.
     */
    endpoint?: pulumi.Input<string>;
    /**
     * Setting this flag will result in path-style access being used for all requests.
     */
    forcePathStyle?: pulumi.Input<boolean>;
    /**
     * Setting this value will override the default connection pool size of Nexus of the s3 client for this blobstore.
     */
    maxConnectionPoolSize?: pulumi.Input<number>;
    /**
     * An API signature version which may be required for third party object stores using the S3 API.
     */
    signerType?: pulumi.Input<string>;
}
export interface BlobstoreS3BucketConfigurationBucket {
    /**
     * How many days until deleted blobs are finally removed from the S3 bucket (-1 to disable)
     */
    expiration: pulumi.Input<number>;
    /**
     * The name of the S3 bucket
     */
    name: pulumi.Input<string>;
    /**
     * The S3 blob store (i.e S3 object) key prefix
     */
    prefix?: pulumi.Input<string>;
    /**
     * The AWS region to create a new S3 bucket in or an existing S3 bucket's region
     */
    region: pulumi.Input<string>;
}
export interface BlobstoreS3BucketConfigurationBucketSecurity {
    /**
     * An IAM access key ID for granting access to the S3 bucket
     */
    accessKeyId?: pulumi.Input<string>;
    /**
     * An IAM role to assume in order to access the S3 bucket
     */
    role?: pulumi.Input<string>;
    /**
     * The secret access key associated with the specified IAM access key ID
     */
    secretAccessKey?: pulumi.Input<string>;
    /**
     * An AWS STS session token associated with temporary security credentials which grant access to the S3 bucket
     */
    sessionToken?: pulumi.Input<string>;
}
export interface BlobstoreS3BucketConfigurationEncryption {
    /**
     * The encryption key.
     */
    encryptionKey?: pulumi.Input<string>;
    /**
     * The type of S3 server side encryption to use.
     */
    encryptionType?: pulumi.Input<string>;
}
export interface BlobstoreS3SoftQuota {
    /**
     * The limit in Bytes. Minimum value is 1000000
     */
    limit: pulumi.Input<number>;
    /**
     * The type to use such as spaceRemainingQuota, or spaceUsedQuota
     */
    type: pulumi.Input<string>;
}
export interface RepositoryAptHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryAptHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: pulumi.Input<boolean>;
}
export interface RepositoryAptHostedSigning {
    /**
     * PGP signing key pair (armored private key e.g. gpg --export-secret-key --armor)
     * 							If passphrase is unset, the keypair cannot be read from the nexus api.
     * 							When reading the resource, the keypair will be read from the previous state,
     * 							so external changes won't be detected in this case.
     */
    keypair: pulumi.Input<string>;
    /**
     * Passphrase to access PGP signing key.
     * 							This value cannot be read from the nexus api.
     * 							When reading the resource, the value will be read from the previous state,
     * 							so external changes won't be detected.
     */
    passphrase?: pulumi.Input<string>;
}
export interface RepositoryAptHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: pulumi.Input<boolean>;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: pulumi.Input<string>;
}
export interface RepositoryAptProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryAptProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: pulumi.Input<inputs.RepositoryAptProxyHttpClientAuthentication>;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: pulumi.Input<boolean>;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: pulumi.Input<boolean>;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: pulumi.Input<inputs.RepositoryAptProxyHttpClientConnection>;
}
export interface RepositoryAptProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: pulumi.Input<string>;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: pulumi.Input<string>;
    /**
     * The password used by the proxy repository
     */
    password?: pulumi.Input<string>;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: pulumi.Input<string>;
    /**
     * The username used by the proxy repository
     */
    username?: pulumi.Input<string>;
}
export interface RepositoryAptProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: pulumi.Input<boolean>;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: pulumi.Input<boolean>;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: pulumi.Input<number>;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: pulumi.Input<number>;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: pulumi.Input<string>;
}
export interface RepositoryAptProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: pulumi.Input<boolean>;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: pulumi.Input<number>;
}
export interface RepositoryAptProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: pulumi.Input<number>;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: pulumi.Input<number>;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: pulumi.Input<string>;
}
export interface RepositoryAptProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryBowerGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryBowerGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryBowerHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryBowerHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: pulumi.Input<boolean>;
}
export interface RepositoryBowerHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: pulumi.Input<boolean>;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: pulumi.Input<string>;
}
export interface RepositoryBowerProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryBowerProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: pulumi.Input<inputs.RepositoryBowerProxyHttpClientAuthentication>;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: pulumi.Input<boolean>;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: pulumi.Input<boolean>;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: pulumi.Input<inputs.RepositoryBowerProxyHttpClientConnection>;
}
export interface RepositoryBowerProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: pulumi.Input<string>;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: pulumi.Input<string>;
    /**
     * The password used by the proxy repository
     */
    password?: pulumi.Input<string>;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: pulumi.Input<string>;
    /**
     * The username used by the proxy repository
     */
    username?: pulumi.Input<string>;
}
export interface RepositoryBowerProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: pulumi.Input<boolean>;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: pulumi.Input<boolean>;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: pulumi.Input<number>;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: pulumi.Input<number>;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: pulumi.Input<string>;
}
export interface RepositoryBowerProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: pulumi.Input<boolean>;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: pulumi.Input<number>;
}
export interface RepositoryBowerProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: pulumi.Input<number>;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: pulumi.Input<number>;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: pulumi.Input<string>;
}
export interface RepositoryBowerProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryCargoGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryCargoGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryCargoHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryCargoHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: pulumi.Input<boolean>;
}
export interface RepositoryCargoHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: pulumi.Input<boolean>;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: pulumi.Input<string>;
}
export interface RepositoryCargoProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryCargoProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: pulumi.Input<inputs.RepositoryCargoProxyHttpClientAuthentication>;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: pulumi.Input<boolean>;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: pulumi.Input<boolean>;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: pulumi.Input<inputs.RepositoryCargoProxyHttpClientConnection>;
}
export interface RepositoryCargoProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: pulumi.Input<string>;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: pulumi.Input<string>;
    /**
     * The password used by the proxy repository
     */
    password?: pulumi.Input<string>;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: pulumi.Input<string>;
    /**
     * The username used by the proxy repository
     */
    username?: pulumi.Input<string>;
}
export interface RepositoryCargoProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: pulumi.Input<boolean>;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: pulumi.Input<boolean>;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: pulumi.Input<number>;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: pulumi.Input<number>;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: pulumi.Input<string>;
}
export interface RepositoryCargoProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: pulumi.Input<boolean>;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: pulumi.Input<number>;
}
export interface RepositoryCargoProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: pulumi.Input<number>;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: pulumi.Input<number>;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: pulumi.Input<string>;
}
export interface RepositoryCargoProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryCocoapodsProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryCocoapodsProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: pulumi.Input<inputs.RepositoryCocoapodsProxyHttpClientAuthentication>;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: pulumi.Input<boolean>;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: pulumi.Input<boolean>;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: pulumi.Input<inputs.RepositoryCocoapodsProxyHttpClientConnection>;
}
export interface RepositoryCocoapodsProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: pulumi.Input<string>;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: pulumi.Input<string>;
    /**
     * The password used by the proxy repository
     */
    password?: pulumi.Input<string>;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: pulumi.Input<string>;
    /**
     * The username used by the proxy repository
     */
    username?: pulumi.Input<string>;
}
export interface RepositoryCocoapodsProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: pulumi.Input<boolean>;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: pulumi.Input<boolean>;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: pulumi.Input<number>;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: pulumi.Input<number>;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: pulumi.Input<string>;
}
export interface RepositoryCocoapodsProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: pulumi.Input<boolean>;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: pulumi.Input<number>;
}
export interface RepositoryCocoapodsProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: pulumi.Input<number>;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: pulumi.Input<number>;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: pulumi.Input<string>;
}
export interface RepositoryCocoapodsProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryConanProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryConanProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: pulumi.Input<inputs.RepositoryConanProxyHttpClientAuthentication>;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: pulumi.Input<boolean>;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: pulumi.Input<boolean>;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: pulumi.Input<inputs.RepositoryConanProxyHttpClientConnection>;
}
export interface RepositoryConanProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: pulumi.Input<string>;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: pulumi.Input<string>;
    /**
     * The password used by the proxy repository
     */
    password?: pulumi.Input<string>;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: pulumi.Input<string>;
    /**
     * The username used by the proxy repository
     */
    username?: pulumi.Input<string>;
}
export interface RepositoryConanProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: pulumi.Input<boolean>;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: pulumi.Input<boolean>;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: pulumi.Input<number>;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: pulumi.Input<number>;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: pulumi.Input<string>;
}
export interface RepositoryConanProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: pulumi.Input<boolean>;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: pulumi.Input<number>;
}
export interface RepositoryConanProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: pulumi.Input<number>;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: pulumi.Input<number>;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: pulumi.Input<string>;
}
export interface RepositoryConanProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryCondaProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryCondaProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: pulumi.Input<inputs.RepositoryCondaProxyHttpClientAuthentication>;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: pulumi.Input<boolean>;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: pulumi.Input<boolean>;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: pulumi.Input<inputs.RepositoryCondaProxyHttpClientConnection>;
}
export interface RepositoryCondaProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: pulumi.Input<string>;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: pulumi.Input<string>;
    /**
     * The password used by the proxy repository
     */
    password?: pulumi.Input<string>;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: pulumi.Input<string>;
    /**
     * The username used by the proxy repository
     */
    username?: pulumi.Input<string>;
}
export interface RepositoryCondaProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: pulumi.Input<boolean>;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: pulumi.Input<boolean>;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: pulumi.Input<number>;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: pulumi.Input<number>;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: pulumi.Input<string>;
}
export interface RepositoryCondaProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: pulumi.Input<boolean>;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: pulumi.Input<number>;
}
export interface RepositoryCondaProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: pulumi.Input<number>;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: pulumi.Input<number>;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: pulumi.Input<string>;
}
export interface RepositoryCondaProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryDockerGroupDocker {
    /**
     * Whether to force authentication (Docker Bearer Token Realm required if false)
     */
    forceBasicAuth: pulumi.Input<boolean>;
    /**
     * Create an HTTP connector at specified port
     */
    httpPort?: pulumi.Input<number>;
    /**
     * Create an HTTPS connector at specified port
     */
    httpsPort?: pulumi.Input<number>;
    /**
     * Pro-only: Whether to allow clients to use subdomain routing connector
     */
    subdomain?: pulumi.Input<string>;
    /**
     * Whether to allow clients to use the V1 API to interact with this repository
     */
    v1Enabled: pulumi.Input<boolean>;
}
export interface RepositoryDockerGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Pro-only: This field is for the Group Deployment feature available in NXRM Pro.
     */
    writableMember?: pulumi.Input<string>;
}
export interface RepositoryDockerGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryDockerHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryDockerHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: pulumi.Input<boolean>;
}
export interface RepositoryDockerHostedDocker {
    /**
     * Whether to force authentication (Docker Bearer Token Realm required if false)
     */
    forceBasicAuth: pulumi.Input<boolean>;
    /**
     * Create an HTTP connector at specified port
     */
    httpPort?: pulumi.Input<number>;
    /**
     * Create an HTTPS connector at specified port
     */
    httpsPort?: pulumi.Input<number>;
    /**
     * Pro-only: Whether to allow clients to use subdomain routing connector
     */
    subdomain?: pulumi.Input<string>;
    /**
     * Whether to allow clients to use the V1 API to interact with this repository
     */
    v1Enabled: pulumi.Input<boolean>;
}
export interface RepositoryDockerHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to allow redeploying the 'latest' tag but defer to the Deployment Policy for all other tags. Only usable with write_policy "ALLOW_ONCE"
     */
    latestPolicy?: pulumi.Input<boolean>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: pulumi.Input<boolean>;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: pulumi.Input<string>;
}
export interface RepositoryDockerProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryDockerProxyDocker {
    /**
     * Whether to force authentication (Docker Bearer Token Realm required if false)
     */
    forceBasicAuth: pulumi.Input<boolean>;
    /**
     * Create an HTTP connector at specified port
     */
    httpPort?: pulumi.Input<number>;
    /**
     * Create an HTTPS connector at specified port
     */
    httpsPort?: pulumi.Input<number>;
    /**
     * Pro-only: Whether to allow clients to use subdomain routing connector
     */
    subdomain?: pulumi.Input<string>;
    /**
     * Whether to allow clients to use the V1 API to interact with this repository
     */
    v1Enabled: pulumi.Input<boolean>;
}
export interface RepositoryDockerProxyDockerProxy {
    /**
     * Allow Nexus Repository Manager to download and cache foreign layers
     */
    cacheForeignLayers?: pulumi.Input<boolean>;
    /**
     * A set of regular expressions used to identify URLs that are allowed for foreign layer requests
     */
    foreignLayerUrlWhitelists?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Type of Docker Index. Possible values: `HUB`, `REGISTRY` or `CUSTOM`
     */
    indexType: pulumi.Input<string>;
    /**
     * Url of Docker Index to use
     */
    indexUrl?: pulumi.Input<string>;
}
export interface RepositoryDockerProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: pulumi.Input<inputs.RepositoryDockerProxyHttpClientAuthentication>;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: pulumi.Input<boolean>;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: pulumi.Input<boolean>;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: pulumi.Input<inputs.RepositoryDockerProxyHttpClientConnection>;
}
export interface RepositoryDockerProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: pulumi.Input<string>;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: pulumi.Input<string>;
    /**
     * The password used by the proxy repository
     */
    password?: pulumi.Input<string>;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: pulumi.Input<string>;
    /**
     * The username used by the proxy repository
     */
    username?: pulumi.Input<string>;
}
export interface RepositoryDockerProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: pulumi.Input<boolean>;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: pulumi.Input<boolean>;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: pulumi.Input<number>;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: pulumi.Input<number>;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: pulumi.Input<string>;
}
export interface RepositoryDockerProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: pulumi.Input<boolean>;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: pulumi.Input<number>;
}
export interface RepositoryDockerProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: pulumi.Input<number>;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: pulumi.Input<number>;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: pulumi.Input<string>;
}
export interface RepositoryDockerProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryGitlfsHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryGitlfsHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: pulumi.Input<boolean>;
}
export interface RepositoryGitlfsHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: pulumi.Input<boolean>;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: pulumi.Input<string>;
}
export interface RepositoryGoGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryGoGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryGoProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryGoProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: pulumi.Input<inputs.RepositoryGoProxyHttpClientAuthentication>;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: pulumi.Input<boolean>;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: pulumi.Input<boolean>;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: pulumi.Input<inputs.RepositoryGoProxyHttpClientConnection>;
}
export interface RepositoryGoProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: pulumi.Input<string>;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: pulumi.Input<string>;
    /**
     * The password used by the proxy repository
     */
    password?: pulumi.Input<string>;
    /**
     * Whether to use pre-emptive authentication. Use with caution. Defaults to false.
     */
    preemptive?: pulumi.Input<boolean>;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: pulumi.Input<string>;
    /**
     * The username used by the proxy repository
     */
    username?: pulumi.Input<string>;
}
export interface RepositoryGoProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: pulumi.Input<boolean>;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: pulumi.Input<boolean>;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: pulumi.Input<number>;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: pulumi.Input<number>;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: pulumi.Input<string>;
}
export interface RepositoryGoProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: pulumi.Input<boolean>;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: pulumi.Input<number>;
}
export interface RepositoryGoProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: pulumi.Input<number>;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: pulumi.Input<number>;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: pulumi.Input<string>;
}
export interface RepositoryGoProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryHelmHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryHelmHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: pulumi.Input<boolean>;
}
export interface RepositoryHelmHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: pulumi.Input<boolean>;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: pulumi.Input<string>;
}
export interface RepositoryHelmProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryHelmProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: pulumi.Input<inputs.RepositoryHelmProxyHttpClientAuthentication>;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: pulumi.Input<boolean>;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: pulumi.Input<boolean>;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: pulumi.Input<inputs.RepositoryHelmProxyHttpClientConnection>;
}
export interface RepositoryHelmProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: pulumi.Input<string>;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: pulumi.Input<string>;
    /**
     * The password used by the proxy repository
     */
    password?: pulumi.Input<string>;
    /**
     * Whether to use pre-emptive authentication. Use with caution. Defaults to false.
     */
    preemptive?: pulumi.Input<boolean>;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: pulumi.Input<string>;
    /**
     * The username used by the proxy repository
     */
    username?: pulumi.Input<string>;
}
export interface RepositoryHelmProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: pulumi.Input<boolean>;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: pulumi.Input<boolean>;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: pulumi.Input<number>;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: pulumi.Input<number>;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: pulumi.Input<string>;
}
export interface RepositoryHelmProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: pulumi.Input<boolean>;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: pulumi.Input<number>;
}
export interface RepositoryHelmProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: pulumi.Input<number>;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: pulumi.Input<number>;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: pulumi.Input<string>;
}
export interface RepositoryHelmProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryMavenGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryMavenGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryMavenHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryMavenHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: pulumi.Input<boolean>;
}
export interface RepositoryMavenHostedMaven {
    /**
     * Add Content-Disposition header as 'Attachment' to disable some content from being inline in a browse. Possible Value: `INLINE` or `ATTACHMENT`
     */
    contentDisposition?: pulumi.Input<string>;
    /**
     * Validate that all paths are maven artifact or metadata paths. Possible Value: `STRICT` or `PERMISSIVE`
     */
    layoutPolicy: pulumi.Input<string>;
    /**
     * What type of artifacts does this repository store? Possible Value: `RELEASE`, `SNAPSHOT` or `MIXED`
     */
    versionPolicy: pulumi.Input<string>;
}
export interface RepositoryMavenHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: pulumi.Input<boolean>;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: pulumi.Input<string>;
}
export interface RepositoryMavenProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryMavenProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: pulumi.Input<inputs.RepositoryMavenProxyHttpClientAuthentication>;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: pulumi.Input<boolean>;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: pulumi.Input<boolean>;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: pulumi.Input<inputs.RepositoryMavenProxyHttpClientConnection>;
}
export interface RepositoryMavenProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: pulumi.Input<string>;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: pulumi.Input<string>;
    /**
     * The password used by the proxy repository
     */
    password?: pulumi.Input<string>;
    /**
     * Whether to use pre-emptive authentication. Use with caution. Defaults to false.
     */
    preemptive?: pulumi.Input<boolean>;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: pulumi.Input<string>;
    /**
     * The username used by the proxy repository
     */
    username?: pulumi.Input<string>;
}
export interface RepositoryMavenProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: pulumi.Input<boolean>;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: pulumi.Input<boolean>;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: pulumi.Input<number>;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: pulumi.Input<number>;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: pulumi.Input<string>;
}
export interface RepositoryMavenProxyMaven {
    /**
     * Add Content-Disposition header as 'Attachment' to disable some content from being inline in a browse. Possible Value: `INLINE` or `ATTACHMENT`
     */
    contentDisposition?: pulumi.Input<string>;
    /**
     * Validate that all paths are maven artifact or metadata paths. Possible Value: `STRICT` or `PERMISSIVE`
     */
    layoutPolicy: pulumi.Input<string>;
    /**
     * What type of artifacts does this repository store? Possible Value: `RELEASE`, `SNAPSHOT` or `MIXED`
     */
    versionPolicy: pulumi.Input<string>;
}
export interface RepositoryMavenProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: pulumi.Input<boolean>;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: pulumi.Input<number>;
}
export interface RepositoryMavenProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: pulumi.Input<number>;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: pulumi.Input<number>;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: pulumi.Input<string>;
}
export interface RepositoryMavenProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryNpmGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Pro-only: This field is for the Group Deployment feature available in NXRM Pro.
     */
    writableMember?: pulumi.Input<string>;
}
export interface RepositoryNpmGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryNpmHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryNpmHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: pulumi.Input<boolean>;
}
export interface RepositoryNpmHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: pulumi.Input<boolean>;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: pulumi.Input<string>;
}
export interface RepositoryNpmProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryNpmProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: pulumi.Input<inputs.RepositoryNpmProxyHttpClientAuthentication>;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: pulumi.Input<boolean>;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: pulumi.Input<boolean>;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: pulumi.Input<inputs.RepositoryNpmProxyHttpClientConnection>;
}
export interface RepositoryNpmProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: pulumi.Input<string>;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: pulumi.Input<string>;
    /**
     * The password used by the proxy repository
     */
    password?: pulumi.Input<string>;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: pulumi.Input<string>;
    /**
     * The username used by the proxy repository
     */
    username?: pulumi.Input<string>;
}
export interface RepositoryNpmProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: pulumi.Input<boolean>;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: pulumi.Input<boolean>;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: pulumi.Input<number>;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: pulumi.Input<number>;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: pulumi.Input<string>;
}
export interface RepositoryNpmProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: pulumi.Input<boolean>;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: pulumi.Input<number>;
}
export interface RepositoryNpmProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: pulumi.Input<number>;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: pulumi.Input<number>;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: pulumi.Input<string>;
}
export interface RepositoryNpmProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryNugetGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryNugetGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryNugetHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryNugetHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: pulumi.Input<boolean>;
}
export interface RepositoryNugetHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: pulumi.Input<boolean>;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: pulumi.Input<string>;
}
export interface RepositoryNugetProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryNugetProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: pulumi.Input<inputs.RepositoryNugetProxyHttpClientAuthentication>;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: pulumi.Input<boolean>;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: pulumi.Input<boolean>;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: pulumi.Input<inputs.RepositoryNugetProxyHttpClientConnection>;
}
export interface RepositoryNugetProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: pulumi.Input<string>;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: pulumi.Input<string>;
    /**
     * The password used by the proxy repository
     */
    password?: pulumi.Input<string>;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: pulumi.Input<string>;
    /**
     * The username used by the proxy repository
     */
    username?: pulumi.Input<string>;
}
export interface RepositoryNugetProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: pulumi.Input<boolean>;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: pulumi.Input<boolean>;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: pulumi.Input<number>;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: pulumi.Input<number>;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: pulumi.Input<string>;
}
export interface RepositoryNugetProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: pulumi.Input<boolean>;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: pulumi.Input<number>;
}
export interface RepositoryNugetProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: pulumi.Input<number>;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: pulumi.Input<number>;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: pulumi.Input<string>;
}
export interface RepositoryNugetProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryP2ProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryP2ProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: pulumi.Input<inputs.RepositoryP2ProxyHttpClientAuthentication>;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: pulumi.Input<boolean>;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: pulumi.Input<boolean>;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: pulumi.Input<inputs.RepositoryP2ProxyHttpClientConnection>;
}
export interface RepositoryP2ProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: pulumi.Input<string>;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: pulumi.Input<string>;
    /**
     * The password used by the proxy repository
     */
    password?: pulumi.Input<string>;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: pulumi.Input<string>;
    /**
     * The username used by the proxy repository
     */
    username?: pulumi.Input<string>;
}
export interface RepositoryP2ProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: pulumi.Input<boolean>;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: pulumi.Input<boolean>;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: pulumi.Input<number>;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: pulumi.Input<number>;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: pulumi.Input<string>;
}
export interface RepositoryP2ProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: pulumi.Input<boolean>;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: pulumi.Input<number>;
}
export interface RepositoryP2ProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: pulumi.Input<number>;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: pulumi.Input<number>;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: pulumi.Input<string>;
}
export interface RepositoryP2ProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryPypiGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryPypiGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryPypiHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryPypiHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: pulumi.Input<boolean>;
}
export interface RepositoryPypiHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: pulumi.Input<boolean>;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: pulumi.Input<string>;
}
export interface RepositoryPypiProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryPypiProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: pulumi.Input<inputs.RepositoryPypiProxyHttpClientAuthentication>;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: pulumi.Input<boolean>;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: pulumi.Input<boolean>;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: pulumi.Input<inputs.RepositoryPypiProxyHttpClientConnection>;
}
export interface RepositoryPypiProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: pulumi.Input<string>;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: pulumi.Input<string>;
    /**
     * The password used by the proxy repository
     */
    password?: pulumi.Input<string>;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: pulumi.Input<string>;
    /**
     * The username used by the proxy repository
     */
    username?: pulumi.Input<string>;
}
export interface RepositoryPypiProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: pulumi.Input<boolean>;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: pulumi.Input<boolean>;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: pulumi.Input<number>;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: pulumi.Input<number>;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: pulumi.Input<string>;
}
export interface RepositoryPypiProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: pulumi.Input<boolean>;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: pulumi.Input<number>;
}
export interface RepositoryPypiProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: pulumi.Input<number>;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: pulumi.Input<number>;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: pulumi.Input<string>;
}
export interface RepositoryPypiProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryRGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryRGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryRHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryRHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: pulumi.Input<boolean>;
}
export interface RepositoryRHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: pulumi.Input<boolean>;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: pulumi.Input<string>;
}
export interface RepositoryRProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryRProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: pulumi.Input<inputs.RepositoryRProxyHttpClientAuthentication>;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: pulumi.Input<boolean>;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: pulumi.Input<boolean>;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: pulumi.Input<inputs.RepositoryRProxyHttpClientConnection>;
}
export interface RepositoryRProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: pulumi.Input<string>;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: pulumi.Input<string>;
    /**
     * The password used by the proxy repository
     */
    password?: pulumi.Input<string>;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: pulumi.Input<string>;
    /**
     * The username used by the proxy repository
     */
    username?: pulumi.Input<string>;
}
export interface RepositoryRProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: pulumi.Input<boolean>;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: pulumi.Input<boolean>;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: pulumi.Input<number>;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: pulumi.Input<number>;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: pulumi.Input<string>;
}
export interface RepositoryRProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: pulumi.Input<boolean>;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: pulumi.Input<number>;
}
export interface RepositoryRProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: pulumi.Input<number>;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: pulumi.Input<number>;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: pulumi.Input<string>;
}
export interface RepositoryRProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryRawGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryRawGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryRawHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryRawHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: pulumi.Input<boolean>;
}
export interface RepositoryRawHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: pulumi.Input<boolean>;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: pulumi.Input<string>;
}
export interface RepositoryRawProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryRawProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: pulumi.Input<inputs.RepositoryRawProxyHttpClientAuthentication>;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: pulumi.Input<boolean>;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: pulumi.Input<boolean>;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: pulumi.Input<inputs.RepositoryRawProxyHttpClientConnection>;
}
export interface RepositoryRawProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: pulumi.Input<string>;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: pulumi.Input<string>;
    /**
     * The password used by the proxy repository
     */
    password?: pulumi.Input<string>;
    /**
     * Whether to use pre-emptive authentication. Use with caution. Defaults to false.
     */
    preemptive?: pulumi.Input<boolean>;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: pulumi.Input<string>;
    /**
     * The username used by the proxy repository
     */
    username?: pulumi.Input<string>;
}
export interface RepositoryRawProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: pulumi.Input<boolean>;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: pulumi.Input<boolean>;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: pulumi.Input<number>;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: pulumi.Input<number>;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: pulumi.Input<string>;
}
export interface RepositoryRawProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: pulumi.Input<boolean>;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: pulumi.Input<number>;
}
export interface RepositoryRawProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: pulumi.Input<number>;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: pulumi.Input<number>;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: pulumi.Input<string>;
}
export interface RepositoryRawProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryRubygemsGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryRubygemsGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryRubygemsHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryRubygemsHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: pulumi.Input<boolean>;
}
export interface RepositoryRubygemsHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: pulumi.Input<boolean>;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: pulumi.Input<string>;
}
export interface RepositoryRubygemsProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryRubygemsProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: pulumi.Input<inputs.RepositoryRubygemsProxyHttpClientAuthentication>;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: pulumi.Input<boolean>;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: pulumi.Input<boolean>;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: pulumi.Input<inputs.RepositoryRubygemsProxyHttpClientConnection>;
}
export interface RepositoryRubygemsProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: pulumi.Input<string>;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: pulumi.Input<string>;
    /**
     * The password used by the proxy repository
     */
    password?: pulumi.Input<string>;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: pulumi.Input<string>;
    /**
     * The username used by the proxy repository
     */
    username?: pulumi.Input<string>;
}
export interface RepositoryRubygemsProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: pulumi.Input<boolean>;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: pulumi.Input<boolean>;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: pulumi.Input<number>;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: pulumi.Input<number>;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: pulumi.Input<string>;
}
export interface RepositoryRubygemsProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: pulumi.Input<boolean>;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: pulumi.Input<number>;
}
export interface RepositoryRubygemsProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: pulumi.Input<number>;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: pulumi.Input<number>;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: pulumi.Input<string>;
}
export interface RepositoryRubygemsProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryYumGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryYumGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryYumGroupYumSigning {
    /**
     * PGP signing key pair (armored private key e.g. gpg --export-secret-key --armor)
     */
    keypair: pulumi.Input<string>;
    /**
     * Passphrase to access PGP signing key
     */
    passphrase?: pulumi.Input<string>;
}
export interface RepositoryYumHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryYumHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: pulumi.Input<boolean>;
}
export interface RepositoryYumHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: pulumi.Input<boolean>;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: pulumi.Input<string>;
}
export interface RepositoryYumProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: pulumi.Input<pulumi.Input<string>[]>;
}
export interface RepositoryYumProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: pulumi.Input<inputs.RepositoryYumProxyHttpClientAuthentication>;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: pulumi.Input<boolean>;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: pulumi.Input<boolean>;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: pulumi.Input<inputs.RepositoryYumProxyHttpClientConnection>;
}
export interface RepositoryYumProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: pulumi.Input<string>;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: pulumi.Input<string>;
    /**
     * The password used by the proxy repository
     */
    password?: pulumi.Input<string>;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: pulumi.Input<string>;
    /**
     * The username used by the proxy repository
     */
    username?: pulumi.Input<string>;
}
export interface RepositoryYumProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: pulumi.Input<boolean>;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: pulumi.Input<boolean>;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: pulumi.Input<number>;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: pulumi.Input<number>;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: pulumi.Input<boolean>;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: pulumi.Input<string>;
}
export interface RepositoryYumProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: pulumi.Input<boolean>;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: pulumi.Input<number>;
}
export interface RepositoryYumProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: pulumi.Input<number>;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: pulumi.Input<number>;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: pulumi.Input<string>;
}
export interface RepositoryYumProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: pulumi.Input<string>;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: pulumi.Input<boolean>;
}
export interface RepositoryYumProxyYumSigning {
    /**
     * PGP signing key pair (armored private key e.g. gpg --export-secret-key --armor)
     */
    keypair: pulumi.Input<string>;
    /**
     * Passphrase to access PGP signing key
     */
    passphrase?: pulumi.Input<string>;
}
