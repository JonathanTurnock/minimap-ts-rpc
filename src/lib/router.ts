import { RemoteProcedureProviders, RpcRoutingError } from "./types.ts";

/**
 * Abstract class representing an RPC (Remote Procedure Call) router.
 *
 * @template PROVIDERS - The type of the remote procedure providers.
 * @template REQ - The type of the request object.
 * @template RES - The type of the response object.
 */
export abstract class RpcRouter<
  PROVIDERS extends RemoteProcedureProviders,
  REQ,
  RES,
> {
  /**
   * Creates an instance of RpcRouter.
   * @param {PROVIDERS} providers - The providers of remote procedures.
   */
  constructor(private readonly providers: PROVIDERS) {}

  /**
   * Invokes a remote procedure on the specified provider.
   * @param {string} provider - The name of the provider.
   * @param {string} method - The name of the method to invoke.
   * @param {any[]} args - The arguments to pass to the method.
   * @returns {Promise<any>} A promise that resolves to the result of the remote procedure.
   * @throws {RpcRoutingError | Error} If the request is not for a valid provider or method it will throw an RpcRoutingError,
   *    this is so that the caller can handle the error and return a meaningful response to the client such as 400 Bad Request.
   *
   *    If the invocation of the function throws an error it will be propagated to the caller as an Error,
   *    this is so that the caller can handle the error and return a meaningful response to the client such as 500 Internal Server Error.
   */
  protected async invoke(
    provider: string,
    method: string,
    args: any[],
  ): Promise<any> {
    if (!provider || !method || !args) {
      throw new RpcRoutingError(
        `Invalid request: provider=${provider}, method=${method}, args=${args}`,
      );
    }

    const providerInstance = this.providers[provider];

    if (!providerInstance) {
      throw new RpcRoutingError(`Provider with name ${provider} not found`);
    }

    if (!providerInstance[method]) {
      throw new RpcRoutingError(
        `Method ${method} not found on provider ${provider}`,
      );
    }

    if (typeof providerInstance[method] !== "function") {
      throw new RpcRoutingError(
        `Method ${method} is not a function on provider ${provider} so it cannot be called`,
      );
    }

    return await providerInstance[method](...args);
  }

  /**
   * Abstract method to handle an RPC request.
   * This method must be implemented by subclasses to define how the request is handled.
   * @param {REQ} request - The RPC request to handle.
   * @returns {Promise<RES>} A promise that resolves to the response.
   */
  abstract handle(request: REQ): Promise<RES>;
}
