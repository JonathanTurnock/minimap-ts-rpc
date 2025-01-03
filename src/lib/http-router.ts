import { RemoteProcedureProviders, RpcRoutingError } from "./types.ts";
import { RpcRouter } from "./router.ts";

/**
 * Class representing an HTTP-based RPC (Remote Procedure Call) router.
 * @template PROVIDERS - The type of the remote procedure providers.
 * @extends RpcRouter<PROVIDERS, Request, Response>
 */
export class HttpRpcRouter<PROVIDERS extends RemoteProcedureProviders>
  extends RpcRouter<PROVIDERS, Request, Response> {
  /**
   * Handles an RPC request by invoking the specified provider and method with the given arguments.
   * @param {Request} request - The HTTP request containing the RPC call details.
   * @returns {Promise<Response>} A promise that resolves to the HTTP response with the result of the RPC call.
   */
  async handle(request: Request): Promise<Response> {
    try {
      const { provider, method, args } = await request.json();

      const result = await this.invoke(provider, method, args);

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      if (e instanceof RpcRoutingError) {
        return new Response(JSON.stringify({ name: e.name, error: e.message }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (e instanceof Error) {
        return new Response(
          JSON.stringify({
            name: e.name,
            error: e.message,
            stack: e.stack,
            cause: e.cause,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      return new Response(
        JSON.stringify({
          error: `Unknown Internal Server error of type: ${typeof e}`,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }
}
