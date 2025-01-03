import { RemoteProcedureProviders, RpcRoutingError } from "./types.ts";

/**
 * Abstract class representing an RPC (Remote Procedure Call) router.
 * This router handles the invocation of remote procedures based on incoming requests.
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
   *
   * @param {PROVIDERS} providers - An object containing the remote procedure providers.
   */
  constructor(private readonly providers: PROVIDERS) {}

  /**
   * Invokes the specified provider and procedure with the given arguments.
   * Validates the provider, procedure, and arguments before invocation.
   *
   * @param {string} provider - The name of the provider.
   * @param {string} procedure - The name of the procedure to invoke.
   * @param {any[]} args - The arguments to pass to the procedure.
   * @returns {Promise<any>} A promise that resolves to the result of the RPC call.
   * @throws {RpcRoutingError} If the provider, procedure, or arguments are invalid.
   */
  protected async invoke(
      provider: string,
      procedure: string,
      args: any[],
  ): Promise<any> {
    if (!provider || !procedure || !args) {
      throw new RpcRoutingError(
          `Invalid request: provider=${provider}, procedure=${procedure}, args=${args}`,
      );
    }

    const providerInstance = this.providers[provider];

    if (!providerInstance) {
      throw new RpcRoutingError(`Provider with name ${provider} not found`);
    }

    if (!providerInstance[procedure]) {
      throw new RpcRoutingError(
          `Procedure ${procedure} not found on provider ${provider}`,
      );
    }

    if (typeof providerInstance[procedure] !== "function") {
      throw new RpcRoutingError(
          `Property ${procedure} is not a function on provider ${provider} so it cannot be called`,
      );
    }

    return await providerInstance[procedure](...args);
  }

  /**
   * Abstract method to handle an incoming request.
   * This method must be implemented by subclasses to define how the request is processed and the response is generated.
   *
   * @param {REQ} request - The incoming request object.
   * @returns {Promise<RES>} A promise that resolves to the response object.
   */
  abstract handle(request: REQ): Promise<RES>;
}