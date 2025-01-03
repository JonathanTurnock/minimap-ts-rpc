import { RpcClient } from "./client.ts";
import { RemoteProcedureProviders } from "./types.ts";

/**
 * Class representing  an HTTP-based RPC (Remote Procedure Call) client.
 * @template PROVIDERS - The type of the remote procedure providers.
 * @extends RpcClient<PROVIDERS>
 */
export class HttpRpcClient<PROVIDERS extends RemoteProcedureProviders>
  extends RpcClient<PROVIDERS> {
  /**
   * Creates an instance of HttpRpcClient.
   * @param {URL | string} url - The URL of the RPC server.
   */
  constructor(private readonly url: URL | string) {
    super();
  }

  /**
   * Handles an RPC request by sending it to the server via HTTP POST.
   * @param {string} provider - The name of the provider.
   * @param {string} method - The name of the method to invoke.
   * @param {any[]} args - The arguments to pass to the method.
   * @returns {Promise<any>} A promise that resolves to the response from the server.
   */
  async handle(provider: string, method: string, args: any[]): Promise<any> {
    const result = await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, method, args }),
    });

    return result.json();
  }
}
