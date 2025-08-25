/**
 * Path to a client PEM certificate to load for mTLS. Reading environment variable NEXUS_CLIENT_CERT_PATH. Default:``
 */
export declare const clientCertPath: string | undefined;
/**
 * Path to a client PEM key to load for mTLS. Reading environment variable NEXUS_CLIENT_KEY_PATH. Default:``
 */
export declare const clientKeyPath: string | undefined;
/**
 * Boolean to specify wether insecure SSL connections are allowed or not. Reading environment variable
 * NEXUS_INSECURE_SKIP_VERIFY. Default:`true`
 */
export declare const insecure: boolean | undefined;
/**
 * Password of user to connect to API. Reading environment variable NEXUS_PASSWORD. Default:`admin123`
 */
export declare const password: string | undefined;
/**
 * Path to a root CA certificate to load for mTLS. Reading environment variable NEXUS_ROOT_CA_PATH. Default:``
 */
export declare const rootCaPath: string | undefined;
/**
 * Timeout in seconds to connect to API. Reading environment variable NEXUS_TIMEOUT. Default:`30`
 */
export declare const timeout: number | undefined;
/**
 * URL of Nexus to reach API. Reading environment variable NEXUS_URL. Default:`http://127.0.0.1:8080`
 */
export declare const url: string | undefined;
/**
 * Username used to connect to API. Reading environment variable NEXUS_USERNAME. Default:`admin`
 */
export declare const username: string | undefined;
