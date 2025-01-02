import {AsPromises, RemoteProcedureProviders} from "./types.ts";

/**
 * Abstract class representing an RPC (Remote Procedure Call) client.
 */
export abstract class RpcClient<PROVIDERS extends RemoteProcedureProviders> {
    /**
     * Retrieves a proxy object for the specified provider.
     * The proxy object allows calling remote procedures as if they were local functions.
     */
    get<NAMESPACE extends keyof PROVIDERS>(
        provider: NAMESPACE,
    ): AsPromises<PROVIDERS[NAMESPACE]> {
        return new Proxy(
            {},
            {
                get: (_target, method) => {
                    return (...args: any[]) => {
                        return this.handle({ provider, method, args });
                    };
                },
            },
        ) as AsPromises<PROVIDERS[NAMESPACE]>;
    }

    /**
     * Abstract method to handle an RPC request.
     * This method must be implemented by subclasses to define how the request is sent to the server.
     */
    abstract handle(request: any): Promise<any>;
}