import { AsPromises, RemoteProcedureProviders } from "./types.ts";

/**
 * Abstract class representing an RPC (Remote Procedure Call) client.
 *
 * This class provides a way to call remote procedures as if they were local functions.
 *
 * The client must be provided with a list of providers, each provider is an object that contains a list of procedures.
 */
export abstract class RpcClient<PROVIDERS extends RemoteProcedureProviders> {
  /**
   * Retrieves a proxy object for the specified provider.
   * The proxy object allows calling remote procedures as if they were local functions handling the serialization and deserialization of the arguments and results.
   *
   * @param {string} provider - The name of the provider to retrieve as provided in the RpcRouter constructor.
   */
  get<NAMESPACE extends keyof PROVIDERS>(
    provider: NAMESPACE,
  ): AsPromises<PROVIDERS[NAMESPACE]> {
    return new Proxy(
      {},
      {
        get: (_target, method) => {
          return (...args: any[]) => {
            return this.handle(provider as string, method as string, args);
          };
        },
      },
    ) as AsPromises<PROVIDERS[NAMESPACE]>;
  }

  /**
   * Abstract method to handle an RPC request.
   *
   * This method must be implemented by subclasses to define how the request is sent to the server.
   *
   * @param {string} provider - The name of the provider as provided in the RpcRouter constructor.
   * @param {string} procedure - The name of the procedure to call on the provider.
   * @param {any[]} args - The arguments to pass to the procedure, these must be serializable.
   * @returns {Promise<any>} A promise that resolves with the result of the remote procedure call as plain js objects.
   */
  abstract handle(provider: string, procedure: string, args: any[]): Promise<any>;
}
