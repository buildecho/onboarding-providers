import * as outputs from "../types/output";
export interface BlobstoreAzureBucketConfiguration {
    /**
     * Account name found under Access keys for the storage account
     */
    accountName: string;
    /**
     * The Azure specific authentication details
     */
    authentication: outputs.BlobstoreAzureBucketConfigurationAuthentication;
    /**
     * The name of an existing container to be used for storage
     */
    containerName: string;
}
export interface BlobstoreAzureBucketConfigurationAuthentication {
    /**
     * The account key. Required if `authentication_method` is `ACCOUNTKEY`
     */
    accountKey?: string;
    /**
     * The type of Azure authentication to use. Possible values: `ACCOUNTKEY` and `MANAGEDIDENTITY`
     */
    authenticationMethod: string;
}
export interface BlobstoreAzureSoftQuota {
    /**
     * The limit in Bytes. Minimum value is 1000000
     */
    limit: number;
    /**
     * The type to use such as spaceRemainingQuota, or spaceUsedQuota
     */
    type: string;
}
export interface BlobstoreFileSoftQuota {
    /**
     * The limit in Bytes. Minimum value is 1000000
     */
    limit: number;
    /**
     * The type to use such as spaceRemainingQuota, or spaceUsedQuota
     */
    type: string;
}
export interface BlobstoreGroupSoftQuota {
    /**
     * The limit in Bytes. Minimum value is 1000000
     */
    limit: number;
    /**
     * The type to use such as spaceRemainingQuota, or spaceUsedQuota
     */
    type: string;
}
export interface BlobstoreS3BucketConfiguration {
    /**
     * Additional connection configurations
     */
    advancedBucketConnection?: outputs.BlobstoreS3BucketConfigurationAdvancedBucketConnection;
    /**
     * The S3 bucket configuration
     */
    bucket: outputs.BlobstoreS3BucketConfigurationBucket;
    /**
     * Additional security configurations
     */
    bucketSecurity?: outputs.BlobstoreS3BucketConfigurationBucketSecurity;
    /**
     * Additional bucket encryption configurations
     */
    encryption?: outputs.BlobstoreS3BucketConfigurationEncryption;
}
export interface BlobstoreS3BucketConfigurationAdvancedBucketConnection {
    /**
     * A custom endpoint URL for third party object stores using the S3 API.
     */
    endpoint?: string;
    /**
     * Setting this flag will result in path-style access being used for all requests.
     */
    forcePathStyle?: boolean;
    /**
     * Setting this value will override the default connection pool size of Nexus of the s3 client for this blobstore.
     */
    maxConnectionPoolSize?: number;
    /**
     * An API signature version which may be required for third party object stores using the S3 API.
     */
    signerType?: string;
}
export interface BlobstoreS3BucketConfigurationBucket {
    /**
     * How many days until deleted blobs are finally removed from the S3 bucket (-1 to disable)
     */
    expiration: number;
    /**
     * The name of the S3 bucket
     */
    name: string;
    /**
     * The S3 blob store (i.e S3 object) key prefix
     */
    prefix?: string;
    /**
     * The AWS region to create a new S3 bucket in or an existing S3 bucket's region
     */
    region: string;
}
export interface BlobstoreS3BucketConfigurationBucketSecurity {
    /**
     * An IAM access key ID for granting access to the S3 bucket
     */
    accessKeyId?: string;
    /**
     * An IAM role to assume in order to access the S3 bucket
     */
    role?: string;
    /**
     * The secret access key associated with the specified IAM access key ID
     */
    secretAccessKey?: string;
    /**
     * An AWS STS session token associated with temporary security credentials which grant access to the S3 bucket
     */
    sessionToken?: string;
}
export interface BlobstoreS3BucketConfigurationEncryption {
    /**
     * The encryption key.
     */
    encryptionKey?: string;
    /**
     * The type of S3 server side encryption to use.
     */
    encryptionType?: string;
}
export interface BlobstoreS3SoftQuota {
    /**
     * The limit in Bytes. Minimum value is 1000000
     */
    limit: number;
    /**
     * The type to use such as spaceRemainingQuota, or spaceUsedQuota
     */
    type: string;
}
export interface GetBlobstoreAzureBucketConfiguration {
    accountName: string;
    authentications: outputs.GetBlobstoreAzureBucketConfigurationAuthentication[];
    containerName: string;
}
export interface GetBlobstoreAzureBucketConfigurationAuthentication {
    authenticationMethod: string;
}
export interface GetBlobstoreAzureSoftQuota {
    limit: number;
    type: string;
}
export interface GetBlobstoreFileSoftQuota {
    limit: number;
    type: string;
}
export interface GetBlobstoreGroupSoftQuota {
    limit: number;
    type: string;
}
export interface GetBlobstoreListItem {
    name: string;
    type: string;
}
export interface GetBlobstoreS3BucketConfiguration {
    advancedBucketConnections: outputs.GetBlobstoreS3BucketConfigurationAdvancedBucketConnection[];
    bucketSecurities: outputs.GetBlobstoreS3BucketConfigurationBucketSecurity[];
    buckets: outputs.GetBlobstoreS3BucketConfigurationBucket[];
    encryptions: outputs.GetBlobstoreS3BucketConfigurationEncryption[];
}
export interface GetBlobstoreS3BucketConfigurationAdvancedBucketConnection {
    endpoint: string;
    forcePathStyle: boolean;
    signerType: string;
}
export interface GetBlobstoreS3BucketConfigurationBucket {
    expiration: number;
    name: string;
    prefix: string;
    region: string;
}
export interface GetBlobstoreS3BucketConfigurationBucketSecurity {
    accessKeyId: string;
    role: string;
    secretAccessKey: string;
    sessionToken: string;
}
export interface GetBlobstoreS3BucketConfigurationEncryption {
    encryptionKey: string;
    encryptionType: string;
}
export interface GetBlobstoreS3SoftQuota {
    limit: number;
    type: string;
}
export interface GetRepositoryAptHostedCleanup {
    policyNames: string[];
}
export interface GetRepositoryAptHostedComponent {
    proprietaryComponents: boolean;
}
export interface GetRepositoryAptHostedSigning {
    keypair: string;
    passphrase: string;
}
export interface GetRepositoryAptHostedStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
    writePolicy: string;
}
export interface GetRepositoryAptProxyCleanup {
    policyNames: string[];
}
export interface GetRepositoryAptProxyHttpClient {
    authentications: outputs.GetRepositoryAptProxyHttpClientAuthentication[];
    autoBlock: boolean;
    blocked: boolean;
    connections: outputs.GetRepositoryAptProxyHttpClientConnection[];
}
export interface GetRepositoryAptProxyHttpClientAuthentication {
    ntlmDomain: string;
    ntlmHost: string;
    password: string;
    type: string;
    username: string;
}
export interface GetRepositoryAptProxyHttpClientConnection {
    enableCircularRedirects: boolean;
    enableCookies: boolean;
    retries: number;
    timeout: number;
    useTrustStore: boolean;
    userAgentSuffix: string;
}
export interface GetRepositoryAptProxyNegativeCach {
    enabled: boolean;
    ttl: number;
}
export interface GetRepositoryAptProxyProxy {
    contentMaxAge: number;
    metadataMaxAge: number;
    remoteUrl: string;
}
export interface GetRepositoryAptProxyStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryBowerGroupGroup {
    memberNames: string[];
}
export interface GetRepositoryBowerGroupStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryBowerHostedCleanup {
    policyNames: string[];
}
export interface GetRepositoryBowerHostedComponent {
    proprietaryComponents: boolean;
}
export interface GetRepositoryBowerHostedStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
    writePolicy: string;
}
export interface GetRepositoryBowerProxyCleanup {
    policyNames: string[];
}
export interface GetRepositoryBowerProxyHttpClient {
    authentications: outputs.GetRepositoryBowerProxyHttpClientAuthentication[];
    autoBlock: boolean;
    blocked: boolean;
    connections: outputs.GetRepositoryBowerProxyHttpClientConnection[];
}
export interface GetRepositoryBowerProxyHttpClientAuthentication {
    ntlmDomain: string;
    ntlmHost: string;
    password: string;
    type: string;
    username: string;
}
export interface GetRepositoryBowerProxyHttpClientConnection {
    enableCircularRedirects: boolean;
    enableCookies: boolean;
    retries: number;
    timeout: number;
    useTrustStore: boolean;
    userAgentSuffix: string;
}
export interface GetRepositoryBowerProxyNegativeCach {
    enabled: boolean;
    ttl: number;
}
export interface GetRepositoryBowerProxyProxy {
    contentMaxAge: number;
    metadataMaxAge: number;
    remoteUrl: string;
}
export interface GetRepositoryBowerProxyStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryCargoGroupGroup {
    memberNames: string[];
}
export interface GetRepositoryCargoGroupStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryCargoHostedCleanup {
    policyNames: string[];
}
export interface GetRepositoryCargoHostedComponent {
    proprietaryComponents: boolean;
}
export interface GetRepositoryCargoHostedStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
    writePolicy: string;
}
export interface GetRepositoryCargoProxyCleanup {
    policyNames: string[];
}
export interface GetRepositoryCargoProxyHttpClient {
    authentications: outputs.GetRepositoryCargoProxyHttpClientAuthentication[];
    autoBlock: boolean;
    blocked: boolean;
    connections: outputs.GetRepositoryCargoProxyHttpClientConnection[];
}
export interface GetRepositoryCargoProxyHttpClientAuthentication {
    ntlmDomain: string;
    ntlmHost: string;
    password: string;
    type: string;
    username: string;
}
export interface GetRepositoryCargoProxyHttpClientConnection {
    enableCircularRedirects: boolean;
    enableCookies: boolean;
    retries: number;
    timeout: number;
    useTrustStore: boolean;
    userAgentSuffix: string;
}
export interface GetRepositoryCargoProxyNegativeCach {
    enabled: boolean;
    ttl: number;
}
export interface GetRepositoryCargoProxyProxy {
    contentMaxAge: number;
    metadataMaxAge: number;
    remoteUrl: string;
}
export interface GetRepositoryCargoProxyStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryCocoapodsProxyCleanup {
    policyNames: string[];
}
export interface GetRepositoryCocoapodsProxyHttpClient {
    authentications: outputs.GetRepositoryCocoapodsProxyHttpClientAuthentication[];
    autoBlock: boolean;
    blocked: boolean;
    connections: outputs.GetRepositoryCocoapodsProxyHttpClientConnection[];
}
export interface GetRepositoryCocoapodsProxyHttpClientAuthentication {
    ntlmDomain: string;
    ntlmHost: string;
    password: string;
    type: string;
    username: string;
}
export interface GetRepositoryCocoapodsProxyHttpClientConnection {
    enableCircularRedirects: boolean;
    enableCookies: boolean;
    retries: number;
    timeout: number;
    useTrustStore: boolean;
    userAgentSuffix: string;
}
export interface GetRepositoryCocoapodsProxyNegativeCach {
    enabled: boolean;
    ttl: number;
}
export interface GetRepositoryCocoapodsProxyProxy {
    contentMaxAge: number;
    metadataMaxAge: number;
    remoteUrl: string;
}
export interface GetRepositoryCocoapodsProxyStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryConanProxyCleanup {
    policyNames: string[];
}
export interface GetRepositoryConanProxyHttpClient {
    authentications: outputs.GetRepositoryConanProxyHttpClientAuthentication[];
    autoBlock: boolean;
    blocked: boolean;
    connections: outputs.GetRepositoryConanProxyHttpClientConnection[];
}
export interface GetRepositoryConanProxyHttpClientAuthentication {
    ntlmDomain: string;
    ntlmHost: string;
    password: string;
    type: string;
    username: string;
}
export interface GetRepositoryConanProxyHttpClientConnection {
    enableCircularRedirects: boolean;
    enableCookies: boolean;
    retries: number;
    timeout: number;
    useTrustStore: boolean;
    userAgentSuffix: string;
}
export interface GetRepositoryConanProxyNegativeCach {
    enabled: boolean;
    ttl: number;
}
export interface GetRepositoryConanProxyProxy {
    contentMaxAge: number;
    metadataMaxAge: number;
    remoteUrl: string;
}
export interface GetRepositoryConanProxyStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryCondaProxyCleanup {
    policyNames: string[];
}
export interface GetRepositoryCondaProxyHttpClient {
    authentications: outputs.GetRepositoryCondaProxyHttpClientAuthentication[];
    autoBlock: boolean;
    blocked: boolean;
    connections: outputs.GetRepositoryCondaProxyHttpClientConnection[];
}
export interface GetRepositoryCondaProxyHttpClientAuthentication {
    ntlmDomain: string;
    ntlmHost: string;
    password: string;
    type: string;
    username: string;
}
export interface GetRepositoryCondaProxyHttpClientConnection {
    enableCircularRedirects: boolean;
    enableCookies: boolean;
    retries: number;
    timeout: number;
    useTrustStore: boolean;
    userAgentSuffix: string;
}
export interface GetRepositoryCondaProxyNegativeCach {
    enabled: boolean;
    ttl: number;
}
export interface GetRepositoryCondaProxyProxy {
    contentMaxAge: number;
    metadataMaxAge: number;
    remoteUrl: string;
}
export interface GetRepositoryCondaProxyStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryDockerGroupDocker {
    forceBasicAuth: boolean;
    httpPort: number;
    httpsPort: number;
    subdomain: string;
    v1Enabled: boolean;
}
export interface GetRepositoryDockerGroupGroup {
    memberNames: string[];
    writableMember: string;
}
export interface GetRepositoryDockerGroupStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryDockerHostedCleanup {
    policyNames: string[];
}
export interface GetRepositoryDockerHostedComponent {
    proprietaryComponents: boolean;
}
export interface GetRepositoryDockerHostedDocker {
    forceBasicAuth: boolean;
    httpPort: number;
    httpsPort: number;
    subdomain: string;
    v1Enabled: boolean;
}
export interface GetRepositoryDockerHostedStorage {
    blobStoreName: string;
    latestPolicy: boolean;
    strictContentTypeValidation: boolean;
    writePolicy: string;
}
export interface GetRepositoryDockerProxyCleanup {
    policyNames: string[];
}
export interface GetRepositoryDockerProxyDocker {
    forceBasicAuth: boolean;
    httpPort: number;
    httpsPort: number;
    subdomain: string;
    v1Enabled: boolean;
}
export interface GetRepositoryDockerProxyDockerProxy {
    cacheForeignLayers: boolean;
    foreignLayerUrlWhitelists: string[];
    indexType: string;
    indexUrl: string;
}
export interface GetRepositoryDockerProxyHttpClient {
    authentications: outputs.GetRepositoryDockerProxyHttpClientAuthentication[];
    autoBlock: boolean;
    blocked: boolean;
    connections: outputs.GetRepositoryDockerProxyHttpClientConnection[];
}
export interface GetRepositoryDockerProxyHttpClientAuthentication {
    ntlmDomain: string;
    ntlmHost: string;
    password: string;
    type: string;
    username: string;
}
export interface GetRepositoryDockerProxyHttpClientConnection {
    enableCircularRedirects: boolean;
    enableCookies: boolean;
    retries: number;
    timeout: number;
    useTrustStore: boolean;
    userAgentSuffix: string;
}
export interface GetRepositoryDockerProxyNegativeCach {
    enabled: boolean;
    ttl: number;
}
export interface GetRepositoryDockerProxyProxy {
    contentMaxAge: number;
    metadataMaxAge: number;
    remoteUrl: string;
}
export interface GetRepositoryDockerProxyStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryGitlfsHostedCleanup {
    policyNames: string[];
}
export interface GetRepositoryGitlfsHostedComponent {
    proprietaryComponents: boolean;
}
export interface GetRepositoryGitlfsHostedStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
    writePolicy: string;
}
export interface GetRepositoryGoGroupGroup {
    memberNames: string[];
}
export interface GetRepositoryGoGroupStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryGoProxyCleanup {
    policyNames: string[];
}
export interface GetRepositoryGoProxyHttpClient {
    authentications: outputs.GetRepositoryGoProxyHttpClientAuthentication[];
    autoBlock: boolean;
    blocked: boolean;
    connections: outputs.GetRepositoryGoProxyHttpClientConnection[];
}
export interface GetRepositoryGoProxyHttpClientAuthentication {
    ntlmDomain: string;
    ntlmHost: string;
    password: string;
    preemptive: boolean;
    type: string;
    username: string;
}
export interface GetRepositoryGoProxyHttpClientConnection {
    enableCircularRedirects: boolean;
    enableCookies: boolean;
    retries: number;
    timeout: number;
    useTrustStore: boolean;
    userAgentSuffix: string;
}
export interface GetRepositoryGoProxyNegativeCach {
    enabled: boolean;
    ttl: number;
}
export interface GetRepositoryGoProxyProxy {
    contentMaxAge: number;
    metadataMaxAge: number;
    remoteUrl: string;
}
export interface GetRepositoryGoProxyStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryHelmHostedCleanup {
    policyNames: string[];
}
export interface GetRepositoryHelmHostedComponent {
    proprietaryComponents: boolean;
}
export interface GetRepositoryHelmHostedStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
    writePolicy: string;
}
export interface GetRepositoryHelmProxyCleanup {
    policyNames: string[];
}
export interface GetRepositoryHelmProxyHttpClient {
    authentications: outputs.GetRepositoryHelmProxyHttpClientAuthentication[];
    autoBlock: boolean;
    blocked: boolean;
    connections: outputs.GetRepositoryHelmProxyHttpClientConnection[];
}
export interface GetRepositoryHelmProxyHttpClientAuthentication {
    ntlmDomain: string;
    ntlmHost: string;
    password: string;
    preemptive: boolean;
    type: string;
    username: string;
}
export interface GetRepositoryHelmProxyHttpClientConnection {
    enableCircularRedirects: boolean;
    enableCookies: boolean;
    retries: number;
    timeout: number;
    useTrustStore: boolean;
    userAgentSuffix: string;
}
export interface GetRepositoryHelmProxyNegativeCach {
    enabled: boolean;
    ttl: number;
}
export interface GetRepositoryHelmProxyProxy {
    contentMaxAge: number;
    metadataMaxAge: number;
    remoteUrl: string;
}
export interface GetRepositoryHelmProxyStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryListItem {
    format: string;
    name: string;
    type: string;
    url: string;
}
export interface GetRepositoryMavenGroupGroup {
    memberNames: string[];
}
export interface GetRepositoryMavenGroupStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryMavenHostedCleanup {
    policyNames: string[];
}
export interface GetRepositoryMavenHostedComponent {
    proprietaryComponents: boolean;
}
export interface GetRepositoryMavenHostedMaven {
    contentDisposition: string;
    layoutPolicy: string;
    versionPolicy: string;
}
export interface GetRepositoryMavenHostedStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
    writePolicy: string;
}
export interface GetRepositoryMavenProxyCleanup {
    policyNames: string[];
}
export interface GetRepositoryMavenProxyHttpClient {
    authentications: outputs.GetRepositoryMavenProxyHttpClientAuthentication[];
    autoBlock: boolean;
    blocked: boolean;
    connections: outputs.GetRepositoryMavenProxyHttpClientConnection[];
}
export interface GetRepositoryMavenProxyHttpClientAuthentication {
    ntlmDomain: string;
    ntlmHost: string;
    password: string;
    preemptive: boolean;
    type: string;
    username: string;
}
export interface GetRepositoryMavenProxyHttpClientConnection {
    enableCircularRedirects: boolean;
    enableCookies: boolean;
    retries: number;
    timeout: number;
    useTrustStore: boolean;
    userAgentSuffix: string;
}
export interface GetRepositoryMavenProxyMaven {
    contentDisposition: string;
    layoutPolicy: string;
    versionPolicy: string;
}
export interface GetRepositoryMavenProxyNegativeCach {
    enabled: boolean;
    ttl: number;
}
export interface GetRepositoryMavenProxyProxy {
    contentMaxAge: number;
    metadataMaxAge: number;
    remoteUrl: string;
}
export interface GetRepositoryMavenProxyStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryNpmGroupGroup {
    memberNames: string[];
    writableMember: string;
}
export interface GetRepositoryNpmGroupStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryNpmHostedCleanup {
    policyNames: string[];
}
export interface GetRepositoryNpmHostedComponent {
    proprietaryComponents: boolean;
}
export interface GetRepositoryNpmHostedStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
    writePolicy: string;
}
export interface GetRepositoryNpmProxyCleanup {
    policyNames: string[];
}
export interface GetRepositoryNpmProxyHttpClient {
    authentications: outputs.GetRepositoryNpmProxyHttpClientAuthentication[];
    autoBlock: boolean;
    blocked: boolean;
    connections: outputs.GetRepositoryNpmProxyHttpClientConnection[];
}
export interface GetRepositoryNpmProxyHttpClientAuthentication {
    ntlmDomain: string;
    ntlmHost: string;
    password: string;
    type: string;
    username: string;
}
export interface GetRepositoryNpmProxyHttpClientConnection {
    enableCircularRedirects: boolean;
    enableCookies: boolean;
    retries: number;
    timeout: number;
    useTrustStore: boolean;
    userAgentSuffix: string;
}
export interface GetRepositoryNpmProxyNegativeCach {
    enabled: boolean;
    ttl: number;
}
export interface GetRepositoryNpmProxyProxy {
    contentMaxAge: number;
    metadataMaxAge: number;
    remoteUrl: string;
}
export interface GetRepositoryNpmProxyStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryNugetGroupGroup {
    memberNames: string[];
}
export interface GetRepositoryNugetGroupStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryNugetHostedCleanup {
    policyNames: string[];
}
export interface GetRepositoryNugetHostedComponent {
    proprietaryComponents: boolean;
}
export interface GetRepositoryNugetHostedStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
    writePolicy: string;
}
export interface GetRepositoryNugetProxyCleanup {
    policyNames: string[];
}
export interface GetRepositoryNugetProxyHttpClient {
    authentications: outputs.GetRepositoryNugetProxyHttpClientAuthentication[];
    autoBlock: boolean;
    blocked: boolean;
    connections: outputs.GetRepositoryNugetProxyHttpClientConnection[];
}
export interface GetRepositoryNugetProxyHttpClientAuthentication {
    ntlmDomain: string;
    ntlmHost: string;
    password: string;
    type: string;
    username: string;
}
export interface GetRepositoryNugetProxyHttpClientConnection {
    enableCircularRedirects: boolean;
    enableCookies: boolean;
    retries: number;
    timeout: number;
    useTrustStore: boolean;
    userAgentSuffix: string;
}
export interface GetRepositoryNugetProxyNegativeCach {
    enabled: boolean;
    ttl: number;
}
export interface GetRepositoryNugetProxyProxy {
    contentMaxAge: number;
    metadataMaxAge: number;
    remoteUrl: string;
}
export interface GetRepositoryNugetProxyStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryP2ProxyCleanup {
    policyNames: string[];
}
export interface GetRepositoryP2ProxyHttpClient {
    authentications: outputs.GetRepositoryP2ProxyHttpClientAuthentication[];
    autoBlock: boolean;
    blocked: boolean;
    connections: outputs.GetRepositoryP2ProxyHttpClientConnection[];
}
export interface GetRepositoryP2ProxyHttpClientAuthentication {
    ntlmDomain: string;
    ntlmHost: string;
    password: string;
    type: string;
    username: string;
}
export interface GetRepositoryP2ProxyHttpClientConnection {
    enableCircularRedirects: boolean;
    enableCookies: boolean;
    retries: number;
    timeout: number;
    useTrustStore: boolean;
    userAgentSuffix: string;
}
export interface GetRepositoryP2ProxyNegativeCach {
    enabled: boolean;
    ttl: number;
}
export interface GetRepositoryP2ProxyProxy {
    contentMaxAge: number;
    metadataMaxAge: number;
    remoteUrl: string;
}
export interface GetRepositoryP2ProxyStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryPypiGroupGroup {
    memberNames: string[];
    writableMember: string;
}
export interface GetRepositoryPypiGroupStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryPypiHostedCleanup {
    policyNames: string[];
}
export interface GetRepositoryPypiHostedComponent {
    proprietaryComponents: boolean;
}
export interface GetRepositoryPypiHostedStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
    writePolicy: string;
}
export interface GetRepositoryPypiProxyCleanup {
    policyNames: string[];
}
export interface GetRepositoryPypiProxyHttpClient {
    authentications: outputs.GetRepositoryPypiProxyHttpClientAuthentication[];
    autoBlock: boolean;
    blocked: boolean;
    connections: outputs.GetRepositoryPypiProxyHttpClientConnection[];
}
export interface GetRepositoryPypiProxyHttpClientAuthentication {
    ntlmDomain: string;
    ntlmHost: string;
    password: string;
    type: string;
    username: string;
}
export interface GetRepositoryPypiProxyHttpClientConnection {
    enableCircularRedirects: boolean;
    enableCookies: boolean;
    retries: number;
    timeout: number;
    useTrustStore: boolean;
    userAgentSuffix: string;
}
export interface GetRepositoryPypiProxyNegativeCach {
    enabled: boolean;
    ttl: number;
}
export interface GetRepositoryPypiProxyProxy {
    contentMaxAge: number;
    metadataMaxAge: number;
    remoteUrl: string;
}
export interface GetRepositoryPypiProxyStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryRGroupGroup {
    memberNames: string[];
    writableMember: string;
}
export interface GetRepositoryRGroupStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryRHostedCleanup {
    policyNames: string[];
}
export interface GetRepositoryRHostedComponent {
    proprietaryComponents: boolean;
}
export interface GetRepositoryRHostedStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
    writePolicy: string;
}
export interface GetRepositoryRProxyCleanup {
    policyNames: string[];
}
export interface GetRepositoryRProxyHttpClient {
    authentications: outputs.GetRepositoryRProxyHttpClientAuthentication[];
    autoBlock: boolean;
    blocked: boolean;
    connections: outputs.GetRepositoryRProxyHttpClientConnection[];
}
export interface GetRepositoryRProxyHttpClientAuthentication {
    ntlmDomain: string;
    ntlmHost: string;
    password: string;
    type: string;
    username: string;
}
export interface GetRepositoryRProxyHttpClientConnection {
    enableCircularRedirects: boolean;
    enableCookies: boolean;
    retries: number;
    timeout: number;
    useTrustStore: boolean;
    userAgentSuffix: string;
}
export interface GetRepositoryRProxyNegativeCach {
    enabled: boolean;
    ttl: number;
}
export interface GetRepositoryRProxyProxy {
    contentMaxAge: number;
    metadataMaxAge: number;
    remoteUrl: string;
}
export interface GetRepositoryRProxyStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryRawGroupGroup {
    memberNames: string[];
}
export interface GetRepositoryRawGroupStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryRawHostedCleanup {
    policyNames: string[];
}
export interface GetRepositoryRawHostedComponent {
    proprietaryComponents: boolean;
}
export interface GetRepositoryRawHostedStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
    writePolicy: string;
}
export interface GetRepositoryRawProxyCleanup {
    policyNames: string[];
}
export interface GetRepositoryRawProxyHttpClient {
    authentications: outputs.GetRepositoryRawProxyHttpClientAuthentication[];
    autoBlock: boolean;
    blocked: boolean;
    connections: outputs.GetRepositoryRawProxyHttpClientConnection[];
}
export interface GetRepositoryRawProxyHttpClientAuthentication {
    ntlmDomain: string;
    ntlmHost: string;
    password: string;
    preemptive: boolean;
    type: string;
    username: string;
}
export interface GetRepositoryRawProxyHttpClientConnection {
    enableCircularRedirects: boolean;
    enableCookies: boolean;
    retries: number;
    timeout: number;
    useTrustStore: boolean;
    userAgentSuffix: string;
}
export interface GetRepositoryRawProxyNegativeCach {
    enabled: boolean;
    ttl: number;
}
export interface GetRepositoryRawProxyProxy {
    contentMaxAge: number;
    metadataMaxAge: number;
    remoteUrl: string;
}
export interface GetRepositoryRawProxyStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryRubygemsGroupGroup {
    memberNames: string[];
    writableMember: string;
}
export interface GetRepositoryRubygemsGroupStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryRubygemsHostedCleanup {
    policyNames: string[];
}
export interface GetRepositoryRubygemsHostedComponent {
    proprietaryComponents: boolean;
}
export interface GetRepositoryRubygemsHostedStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
    writePolicy: string;
}
export interface GetRepositoryRubygemsProxyCleanup {
    policyNames: string[];
}
export interface GetRepositoryRubygemsProxyHttpClient {
    authentications: outputs.GetRepositoryRubygemsProxyHttpClientAuthentication[];
    autoBlock: boolean;
    blocked: boolean;
    connections: outputs.GetRepositoryRubygemsProxyHttpClientConnection[];
}
export interface GetRepositoryRubygemsProxyHttpClientAuthentication {
    ntlmDomain: string;
    ntlmHost: string;
    password: string;
    type: string;
    username: string;
}
export interface GetRepositoryRubygemsProxyHttpClientConnection {
    enableCircularRedirects: boolean;
    enableCookies: boolean;
    retries: number;
    timeout: number;
    useTrustStore: boolean;
    userAgentSuffix: string;
}
export interface GetRepositoryRubygemsProxyNegativeCach {
    enabled: boolean;
    ttl: number;
}
export interface GetRepositoryRubygemsProxyProxy {
    contentMaxAge: number;
    metadataMaxAge: number;
    remoteUrl: string;
}
export interface GetRepositoryRubygemsProxyStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryYumGroupGroup {
    memberNames: string[];
}
export interface GetRepositoryYumGroupStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryYumGroupYumSigning {
    keypair: string;
    passphrase: string;
}
export interface GetRepositoryYumHostedCleanup {
    policyNames: string[];
}
export interface GetRepositoryYumHostedComponent {
    proprietaryComponents: boolean;
}
export interface GetRepositoryYumHostedStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
    writePolicy: string;
}
export interface GetRepositoryYumProxyCleanup {
    policyNames: string[];
}
export interface GetRepositoryYumProxyHttpClient {
    authentications: outputs.GetRepositoryYumProxyHttpClientAuthentication[];
    autoBlock: boolean;
    blocked: boolean;
    connections: outputs.GetRepositoryYumProxyHttpClientConnection[];
}
export interface GetRepositoryYumProxyHttpClientAuthentication {
    ntlmDomain: string;
    ntlmHost: string;
    password: string;
    type: string;
    username: string;
}
export interface GetRepositoryYumProxyHttpClientConnection {
    enableCircularRedirects: boolean;
    enableCookies: boolean;
    retries: number;
    timeout: number;
    useTrustStore: boolean;
    userAgentSuffix: string;
}
export interface GetRepositoryYumProxyNegativeCach {
    enabled: boolean;
    ttl: number;
}
export interface GetRepositoryYumProxyProxy {
    contentMaxAge: number;
    metadataMaxAge: number;
    remoteUrl: string;
}
export interface GetRepositoryYumProxyStorage {
    blobStoreName: string;
    strictContentTypeValidation: boolean;
}
export interface GetRepositoryYumProxyYumSigning {
    keypair: string;
    passphrase: string;
}
export interface GetSecurityLdapLdap {
    authPassword: string;
    authRealm: string;
    authSchema: string;
    authUsername: string;
    connectionRetryDelaySeconds: number;
    connectionTimeoutSeconds: number;
    groupBaseDn: string;
    groupIdAttribute: string;
    groupMemberAttribute: string;
    groupMemberFormat: string;
    groupObjectClass: string;
    groupSubtree: string;
    groupType: string;
    host: string;
    id: string;
    ldapGroupsAsRoles: boolean;
    maxIncidentCount: number;
    name: string;
    port: number;
    protocol: string;
    searchBase: string;
    useTrustStore: boolean;
    userBaseDn: string;
    userEmailAddressAttribute: string;
    userIdAttribute: string;
    userLdapFilter: string;
    userMemberOfAttribute: string;
    userObjectClass: string;
    userPasswordAttribute: string;
    userRealNameAttribute: string;
    userSubtree: boolean;
}
export interface GetSecurityRealmsActive {
    id: string;
    name: string;
}
export interface GetSecurityRealmsAvailable {
    id: string;
    name: string;
}
export interface GetSecuritySslTruststoreCertificate {
    expiresOn: number;
    fingerprint: string;
    id: string;
    issuedOn: number;
    issuerCommonName: string;
    issuerOrganization: string;
    issuerOrganizationUnit: string;
    pem: string;
    serialNumber: string;
    subjectCommonName: string;
    subjectOrganization: string;
    subjectOrganizationUnit: string;
}
export interface RepositoryAptHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryAptHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: boolean;
}
export interface RepositoryAptHostedSigning {
    /**
     * PGP signing key pair (armored private key e.g. gpg --export-secret-key --armor)
     * 							If passphrase is unset, the keypair cannot be read from the nexus api.
     * 							When reading the resource, the keypair will be read from the previous state,
     * 							so external changes won't be detected in this case.
     */
    keypair: string;
    /**
     * Passphrase to access PGP signing key.
     * 							This value cannot be read from the nexus api.
     * 							When reading the resource, the value will be read from the previous state,
     * 							so external changes won't be detected.
     */
    passphrase?: string;
}
export interface RepositoryAptHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: boolean;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: string;
}
export interface RepositoryAptProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryAptProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: outputs.RepositoryAptProxyHttpClientAuthentication;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: boolean;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: boolean;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: outputs.RepositoryAptProxyHttpClientConnection;
}
export interface RepositoryAptProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: string;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: string;
    /**
     * The password used by the proxy repository
     */
    password?: string;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: string;
    /**
     * The username used by the proxy repository
     */
    username?: string;
}
export interface RepositoryAptProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: boolean;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: boolean;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: number;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: number;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: boolean;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: string;
}
export interface RepositoryAptProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: boolean;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: number;
}
export interface RepositoryAptProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: number;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: number;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: string;
}
export interface RepositoryAptProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryBowerGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: string[];
}
export interface RepositoryBowerGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryBowerHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryBowerHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: boolean;
}
export interface RepositoryBowerHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: boolean;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: string;
}
export interface RepositoryBowerProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryBowerProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: outputs.RepositoryBowerProxyHttpClientAuthentication;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: boolean;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: boolean;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: outputs.RepositoryBowerProxyHttpClientConnection;
}
export interface RepositoryBowerProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: string;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: string;
    /**
     * The password used by the proxy repository
     */
    password?: string;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: string;
    /**
     * The username used by the proxy repository
     */
    username?: string;
}
export interface RepositoryBowerProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: boolean;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: boolean;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: number;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: number;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: boolean;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: string;
}
export interface RepositoryBowerProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: boolean;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: number;
}
export interface RepositoryBowerProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: number;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: number;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: string;
}
export interface RepositoryBowerProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryCargoGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: string[];
}
export interface RepositoryCargoGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryCargoHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryCargoHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: boolean;
}
export interface RepositoryCargoHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: boolean;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: string;
}
export interface RepositoryCargoProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryCargoProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: outputs.RepositoryCargoProxyHttpClientAuthentication;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: boolean;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: boolean;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: outputs.RepositoryCargoProxyHttpClientConnection;
}
export interface RepositoryCargoProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: string;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: string;
    /**
     * The password used by the proxy repository
     */
    password?: string;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: string;
    /**
     * The username used by the proxy repository
     */
    username?: string;
}
export interface RepositoryCargoProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: boolean;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: boolean;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: number;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: number;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: boolean;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: string;
}
export interface RepositoryCargoProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: boolean;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: number;
}
export interface RepositoryCargoProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: number;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: number;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: string;
}
export interface RepositoryCargoProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryCocoapodsProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryCocoapodsProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: outputs.RepositoryCocoapodsProxyHttpClientAuthentication;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: boolean;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: boolean;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: outputs.RepositoryCocoapodsProxyHttpClientConnection;
}
export interface RepositoryCocoapodsProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: string;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: string;
    /**
     * The password used by the proxy repository
     */
    password?: string;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: string;
    /**
     * The username used by the proxy repository
     */
    username?: string;
}
export interface RepositoryCocoapodsProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: boolean;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: boolean;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: number;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: number;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: boolean;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: string;
}
export interface RepositoryCocoapodsProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: boolean;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: number;
}
export interface RepositoryCocoapodsProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: number;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: number;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: string;
}
export interface RepositoryCocoapodsProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryConanProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryConanProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: outputs.RepositoryConanProxyHttpClientAuthentication;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: boolean;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: boolean;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: outputs.RepositoryConanProxyHttpClientConnection;
}
export interface RepositoryConanProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: string;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: string;
    /**
     * The password used by the proxy repository
     */
    password?: string;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: string;
    /**
     * The username used by the proxy repository
     */
    username?: string;
}
export interface RepositoryConanProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: boolean;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: boolean;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: number;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: number;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: boolean;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: string;
}
export interface RepositoryConanProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: boolean;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: number;
}
export interface RepositoryConanProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: number;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: number;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: string;
}
export interface RepositoryConanProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryCondaProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryCondaProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: outputs.RepositoryCondaProxyHttpClientAuthentication;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: boolean;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: boolean;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: outputs.RepositoryCondaProxyHttpClientConnection;
}
export interface RepositoryCondaProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: string;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: string;
    /**
     * The password used by the proxy repository
     */
    password?: string;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: string;
    /**
     * The username used by the proxy repository
     */
    username?: string;
}
export interface RepositoryCondaProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: boolean;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: boolean;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: number;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: number;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: boolean;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: string;
}
export interface RepositoryCondaProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: boolean;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: number;
}
export interface RepositoryCondaProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: number;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: number;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: string;
}
export interface RepositoryCondaProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryDockerGroupDocker {
    /**
     * Whether to force authentication (Docker Bearer Token Realm required if false)
     */
    forceBasicAuth: boolean;
    /**
     * Create an HTTP connector at specified port
     */
    httpPort?: number;
    /**
     * Create an HTTPS connector at specified port
     */
    httpsPort?: number;
    /**
     * Pro-only: Whether to allow clients to use subdomain routing connector
     */
    subdomain?: string;
    /**
     * Whether to allow clients to use the V1 API to interact with this repository
     */
    v1Enabled: boolean;
}
export interface RepositoryDockerGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: string[];
    /**
     * Pro-only: This field is for the Group Deployment feature available in NXRM Pro.
     */
    writableMember?: string;
}
export interface RepositoryDockerGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryDockerHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryDockerHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: boolean;
}
export interface RepositoryDockerHostedDocker {
    /**
     * Whether to force authentication (Docker Bearer Token Realm required if false)
     */
    forceBasicAuth: boolean;
    /**
     * Create an HTTP connector at specified port
     */
    httpPort?: number;
    /**
     * Create an HTTPS connector at specified port
     */
    httpsPort?: number;
    /**
     * Pro-only: Whether to allow clients to use subdomain routing connector
     */
    subdomain?: string;
    /**
     * Whether to allow clients to use the V1 API to interact with this repository
     */
    v1Enabled: boolean;
}
export interface RepositoryDockerHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to allow redeploying the 'latest' tag but defer to the Deployment Policy for all other tags. Only usable with write_policy "ALLOW_ONCE"
     */
    latestPolicy?: boolean;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: boolean;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: string;
}
export interface RepositoryDockerProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryDockerProxyDocker {
    /**
     * Whether to force authentication (Docker Bearer Token Realm required if false)
     */
    forceBasicAuth: boolean;
    /**
     * Create an HTTP connector at specified port
     */
    httpPort?: number;
    /**
     * Create an HTTPS connector at specified port
     */
    httpsPort?: number;
    /**
     * Pro-only: Whether to allow clients to use subdomain routing connector
     */
    subdomain?: string;
    /**
     * Whether to allow clients to use the V1 API to interact with this repository
     */
    v1Enabled: boolean;
}
export interface RepositoryDockerProxyDockerProxy {
    /**
     * Allow Nexus Repository Manager to download and cache foreign layers
     */
    cacheForeignLayers?: boolean;
    /**
     * A set of regular expressions used to identify URLs that are allowed for foreign layer requests
     */
    foreignLayerUrlWhitelists?: string[];
    /**
     * Type of Docker Index. Possible values: `HUB`, `REGISTRY` or `CUSTOM`
     */
    indexType: string;
    /**
     * Url of Docker Index to use
     */
    indexUrl?: string;
}
export interface RepositoryDockerProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: outputs.RepositoryDockerProxyHttpClientAuthentication;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: boolean;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: boolean;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: outputs.RepositoryDockerProxyHttpClientConnection;
}
export interface RepositoryDockerProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: string;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: string;
    /**
     * The password used by the proxy repository
     */
    password?: string;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: string;
    /**
     * The username used by the proxy repository
     */
    username?: string;
}
export interface RepositoryDockerProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: boolean;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: boolean;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: number;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: number;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: boolean;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: string;
}
export interface RepositoryDockerProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: boolean;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: number;
}
export interface RepositoryDockerProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: number;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: number;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: string;
}
export interface RepositoryDockerProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryGitlfsHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryGitlfsHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: boolean;
}
export interface RepositoryGitlfsHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: boolean;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: string;
}
export interface RepositoryGoGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: string[];
}
export interface RepositoryGoGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryGoProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryGoProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: outputs.RepositoryGoProxyHttpClientAuthentication;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: boolean;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: boolean;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: outputs.RepositoryGoProxyHttpClientConnection;
}
export interface RepositoryGoProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: string;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: string;
    /**
     * The password used by the proxy repository
     */
    password?: string;
    /**
     * Whether to use pre-emptive authentication. Use with caution. Defaults to false.
     */
    preemptive?: boolean;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: string;
    /**
     * The username used by the proxy repository
     */
    username?: string;
}
export interface RepositoryGoProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: boolean;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: boolean;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: number;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: number;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: boolean;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: string;
}
export interface RepositoryGoProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: boolean;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: number;
}
export interface RepositoryGoProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: number;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: number;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: string;
}
export interface RepositoryGoProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryHelmHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryHelmHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: boolean;
}
export interface RepositoryHelmHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: boolean;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: string;
}
export interface RepositoryHelmProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryHelmProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: outputs.RepositoryHelmProxyHttpClientAuthentication;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: boolean;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: boolean;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: outputs.RepositoryHelmProxyHttpClientConnection;
}
export interface RepositoryHelmProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: string;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: string;
    /**
     * The password used by the proxy repository
     */
    password?: string;
    /**
     * Whether to use pre-emptive authentication. Use with caution. Defaults to false.
     */
    preemptive?: boolean;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: string;
    /**
     * The username used by the proxy repository
     */
    username?: string;
}
export interface RepositoryHelmProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: boolean;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: boolean;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: number;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: number;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: boolean;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: string;
}
export interface RepositoryHelmProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: boolean;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: number;
}
export interface RepositoryHelmProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: number;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: number;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: string;
}
export interface RepositoryHelmProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryMavenGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: string[];
}
export interface RepositoryMavenGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryMavenHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryMavenHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: boolean;
}
export interface RepositoryMavenHostedMaven {
    /**
     * Add Content-Disposition header as 'Attachment' to disable some content from being inline in a browse. Possible Value: `INLINE` or `ATTACHMENT`
     */
    contentDisposition?: string;
    /**
     * Validate that all paths are maven artifact or metadata paths. Possible Value: `STRICT` or `PERMISSIVE`
     */
    layoutPolicy: string;
    /**
     * What type of artifacts does this repository store? Possible Value: `RELEASE`, `SNAPSHOT` or `MIXED`
     */
    versionPolicy: string;
}
export interface RepositoryMavenHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: boolean;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: string;
}
export interface RepositoryMavenProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryMavenProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: outputs.RepositoryMavenProxyHttpClientAuthentication;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: boolean;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: boolean;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: outputs.RepositoryMavenProxyHttpClientConnection;
}
export interface RepositoryMavenProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: string;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: string;
    /**
     * The password used by the proxy repository
     */
    password?: string;
    /**
     * Whether to use pre-emptive authentication. Use with caution. Defaults to false.
     */
    preemptive?: boolean;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: string;
    /**
     * The username used by the proxy repository
     */
    username?: string;
}
export interface RepositoryMavenProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: boolean;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: boolean;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: number;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: number;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: boolean;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: string;
}
export interface RepositoryMavenProxyMaven {
    /**
     * Add Content-Disposition header as 'Attachment' to disable some content from being inline in a browse. Possible Value: `INLINE` or `ATTACHMENT`
     */
    contentDisposition?: string;
    /**
     * Validate that all paths are maven artifact or metadata paths. Possible Value: `STRICT` or `PERMISSIVE`
     */
    layoutPolicy: string;
    /**
     * What type of artifacts does this repository store? Possible Value: `RELEASE`, `SNAPSHOT` or `MIXED`
     */
    versionPolicy: string;
}
export interface RepositoryMavenProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: boolean;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: number;
}
export interface RepositoryMavenProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: number;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: number;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: string;
}
export interface RepositoryMavenProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryNpmGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: string[];
    /**
     * Pro-only: This field is for the Group Deployment feature available in NXRM Pro.
     */
    writableMember?: string;
}
export interface RepositoryNpmGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryNpmHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryNpmHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: boolean;
}
export interface RepositoryNpmHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: boolean;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: string;
}
export interface RepositoryNpmProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryNpmProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: outputs.RepositoryNpmProxyHttpClientAuthentication;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: boolean;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: boolean;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: outputs.RepositoryNpmProxyHttpClientConnection;
}
export interface RepositoryNpmProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: string;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: string;
    /**
     * The password used by the proxy repository
     */
    password?: string;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: string;
    /**
     * The username used by the proxy repository
     */
    username?: string;
}
export interface RepositoryNpmProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: boolean;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: boolean;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: number;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: number;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: boolean;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: string;
}
export interface RepositoryNpmProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: boolean;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: number;
}
export interface RepositoryNpmProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: number;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: number;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: string;
}
export interface RepositoryNpmProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryNugetGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: string[];
}
export interface RepositoryNugetGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryNugetHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryNugetHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: boolean;
}
export interface RepositoryNugetHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: boolean;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: string;
}
export interface RepositoryNugetProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryNugetProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: outputs.RepositoryNugetProxyHttpClientAuthentication;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: boolean;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: boolean;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: outputs.RepositoryNugetProxyHttpClientConnection;
}
export interface RepositoryNugetProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: string;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: string;
    /**
     * The password used by the proxy repository
     */
    password?: string;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: string;
    /**
     * The username used by the proxy repository
     */
    username?: string;
}
export interface RepositoryNugetProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: boolean;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: boolean;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: number;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: number;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: boolean;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: string;
}
export interface RepositoryNugetProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: boolean;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: number;
}
export interface RepositoryNugetProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: number;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: number;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: string;
}
export interface RepositoryNugetProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryP2ProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryP2ProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: outputs.RepositoryP2ProxyHttpClientAuthentication;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: boolean;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: boolean;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: outputs.RepositoryP2ProxyHttpClientConnection;
}
export interface RepositoryP2ProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: string;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: string;
    /**
     * The password used by the proxy repository
     */
    password?: string;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: string;
    /**
     * The username used by the proxy repository
     */
    username?: string;
}
export interface RepositoryP2ProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: boolean;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: boolean;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: number;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: number;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: boolean;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: string;
}
export interface RepositoryP2ProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: boolean;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: number;
}
export interface RepositoryP2ProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: number;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: number;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: string;
}
export interface RepositoryP2ProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryPypiGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: string[];
}
export interface RepositoryPypiGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryPypiHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryPypiHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: boolean;
}
export interface RepositoryPypiHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: boolean;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: string;
}
export interface RepositoryPypiProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryPypiProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: outputs.RepositoryPypiProxyHttpClientAuthentication;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: boolean;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: boolean;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: outputs.RepositoryPypiProxyHttpClientConnection;
}
export interface RepositoryPypiProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: string;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: string;
    /**
     * The password used by the proxy repository
     */
    password?: string;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: string;
    /**
     * The username used by the proxy repository
     */
    username?: string;
}
export interface RepositoryPypiProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: boolean;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: boolean;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: number;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: number;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: boolean;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: string;
}
export interface RepositoryPypiProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: boolean;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: number;
}
export interface RepositoryPypiProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: number;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: number;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: string;
}
export interface RepositoryPypiProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryRGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: string[];
}
export interface RepositoryRGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryRHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryRHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: boolean;
}
export interface RepositoryRHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: boolean;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: string;
}
export interface RepositoryRProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryRProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: outputs.RepositoryRProxyHttpClientAuthentication;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: boolean;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: boolean;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: outputs.RepositoryRProxyHttpClientConnection;
}
export interface RepositoryRProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: string;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: string;
    /**
     * The password used by the proxy repository
     */
    password?: string;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: string;
    /**
     * The username used by the proxy repository
     */
    username?: string;
}
export interface RepositoryRProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: boolean;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: boolean;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: number;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: number;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: boolean;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: string;
}
export interface RepositoryRProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: boolean;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: number;
}
export interface RepositoryRProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: number;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: number;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: string;
}
export interface RepositoryRProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryRawGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: string[];
}
export interface RepositoryRawGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryRawHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryRawHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: boolean;
}
export interface RepositoryRawHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: boolean;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: string;
}
export interface RepositoryRawProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryRawProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: outputs.RepositoryRawProxyHttpClientAuthentication;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: boolean;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: boolean;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: outputs.RepositoryRawProxyHttpClientConnection;
}
export interface RepositoryRawProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: string;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: string;
    /**
     * The password used by the proxy repository
     */
    password?: string;
    /**
     * Whether to use pre-emptive authentication. Use with caution. Defaults to false.
     */
    preemptive?: boolean;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: string;
    /**
     * The username used by the proxy repository
     */
    username?: string;
}
export interface RepositoryRawProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: boolean;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: boolean;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: number;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: number;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: boolean;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: string;
}
export interface RepositoryRawProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: boolean;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: number;
}
export interface RepositoryRawProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: number;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: number;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: string;
}
export interface RepositoryRawProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryRubygemsGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: string[];
}
export interface RepositoryRubygemsGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryRubygemsHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryRubygemsHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: boolean;
}
export interface RepositoryRubygemsHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: boolean;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: string;
}
export interface RepositoryRubygemsProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryRubygemsProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: outputs.RepositoryRubygemsProxyHttpClientAuthentication;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: boolean;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: boolean;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: outputs.RepositoryRubygemsProxyHttpClientConnection;
}
export interface RepositoryRubygemsProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: string;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: string;
    /**
     * The password used by the proxy repository
     */
    password?: string;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: string;
    /**
     * The username used by the proxy repository
     */
    username?: string;
}
export interface RepositoryRubygemsProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: boolean;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: boolean;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: number;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: number;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: boolean;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: string;
}
export interface RepositoryRubygemsProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: boolean;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: number;
}
export interface RepositoryRubygemsProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: number;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: number;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: string;
}
export interface RepositoryRubygemsProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryYumGroupGroup {
    /**
     * Member repositories names
     */
    memberNames: string[];
}
export interface RepositoryYumGroupStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryYumGroupYumSigning {
    /**
     * PGP signing key pair (armored private key e.g. gpg --export-secret-key --armor)
     */
    keypair: string;
    /**
     * Passphrase to access PGP signing key
     */
    passphrase?: string;
}
export interface RepositoryYumHostedCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryYumHostedComponent {
    /**
     * Components in this repository count as proprietary for namespace conflict attacks (requires Sonatype Nexus Firewall)
     */
    proprietaryComponents: boolean;
}
export interface RepositoryYumHostedStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation: boolean;
    /**
     * Controls if deployments of and updates to assets are allowed
     */
    writePolicy?: string;
}
export interface RepositoryYumProxyCleanup {
    /**
     * List of policy names
     */
    policyNames?: string[];
}
export interface RepositoryYumProxyHttpClient {
    /**
     * Authentication configuration of the HTTP client
     */
    authentication?: outputs.RepositoryYumProxyHttpClientAuthentication;
    /**
     * Whether to auto-block outbound connections if remote peer is detected as unreachable/unresponsive
     */
    autoBlock: boolean;
    /**
     * Whether to block outbound connections on the repository
     */
    blocked: boolean;
    /**
     * Connection configuration of the HTTP client
     */
    connection?: outputs.RepositoryYumProxyHttpClientConnection;
}
export interface RepositoryYumProxyHttpClientAuthentication {
    /**
     * The ntlm domain to connect
     */
    ntlmDomain?: string;
    /**
     * The ntlm host to connect
     */
    ntlmHost?: string;
    /**
     * The password used by the proxy repository
     */
    password?: string;
    /**
     * Authentication type. Possible values: `ntlm` or `username`
     */
    type: string;
    /**
     * The username used by the proxy repository
     */
    username?: string;
}
export interface RepositoryYumProxyHttpClientConnection {
    /**
     * Whether to enable redirects to the same location (may be required by some servers)
     */
    enableCircularRedirects?: boolean;
    /**
     * Whether to allow cookies to be stored and used
     */
    enableCookies?: boolean;
    /**
     * Total retries if the initial connection attempt suffers a timeout
     */
    retries?: number;
    /**
     * Seconds to wait for activity before stopping and retrying the connection
     */
    timeout?: number;
    /**
     * Use certificates stored in the Nexus Repository Manager truststore to connect to external systems
     */
    useTrustStore?: boolean;
    /**
     * Custom fragment to append to User-Agent header in HTTP requests
     */
    userAgentSuffix?: string;
}
export interface RepositoryYumProxyNegativeCache {
    /**
     * Whether to cache responses for content not present in the proxied repository
     */
    enabled: boolean;
    /**
     * How long to cache the fact that a file was not found in the repository (in minutes)
     */
    ttl: number;
}
export interface RepositoryYumProxyProxy {
    /**
     * How long (in minutes) to cache artifacts before rechecking the remote repository
     */
    contentMaxAge?: number;
    /**
     * How long (in minutes) to cache metadata before rechecking the remote repository.
     */
    metadataMaxAge?: number;
    /**
     * Location of the remote repository being proxied
     */
    remoteUrl: string;
}
export interface RepositoryYumProxyStorage {
    /**
     * Blob store used to store repository contents
     */
    blobStoreName: string;
    /**
     * Whether to validate uploaded content's MIME type appropriate for the repository format
     */
    strictContentTypeValidation?: boolean;
}
export interface RepositoryYumProxyYumSigning {
    /**
     * PGP signing key pair (armored private key e.g. gpg --export-secret-key --armor)
     */
    keypair: string;
    /**
     * Passphrase to access PGP signing key
     */
    passphrase?: string;
}
