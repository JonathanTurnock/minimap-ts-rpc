import { AsPromises, RemoteProcedureProviders } from "./types.ts";

/**
 * Abstract class representing an RPC (Remote Procedure Call) client.
 * This class provides a mechanism to retrieve proxy objects for remote procedure providers
 * and defines an abstract method to handle RPC requests.
 *
 * @template PROVIDERS - The type of the remote procedure providers.
 */
export abstract class RpcClient<PROVIDERS extends RemoteProcedureProviders> {
  /**
   * Retrieves a proxy object for the specified provider.
   * The proxy object allows calling remote procedures as if they were local functions.
   *
   * @param {NAMESPACE} provider - The name of the provider.
   * @returns {AsPromises<PROVIDERS[NAMESPACE]>} A proxy object for the specified provider.
   */
  get<NAMESPACE extends keyof PROVIDERS>(
    provider: NAMESPACE,
  ): AsPromises<PROVIDERS[NAMESPACE]> {
    return new Proxy(
      {},
      {
        get: (_target, procedure) => {
          return (...args: any[]) => {
            return this.handle(provider as string, procedure as string, args);
          };
        },
      },
    ) as AsPromises<PROVIDERS[NAMESPACE]>;
  }

  /**
   * Abstract method to handle an RPC request.
   * This method must be implemented by subclasses to define how the request is sent to the server.
   *
   * @param {string} provider - The name of the provider.
   * @param {string} procedure - The name of the procedure to invoke.
   * @param {any[]} args - The arguments to pass to the procedure.
   * @returns {Promise<any>} A promise that resolves to the response from the server.
   */
  abstract handle(
    provider: string,
    procedure: string,
    args: any[],
  ): Promise<any>;
}
