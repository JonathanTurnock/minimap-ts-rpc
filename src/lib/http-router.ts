import {RemoteProcedureProviders} from "./types.ts";
import {RpcRouter} from "./router.ts";

/**
 * Class representing an HTTP-based RPC (Remote Procedure Call) router.
 * @template PROVIDERS - The type of the remote procedure providers.
 * @extends RpcRouter<PROVIDERS, Request, Response>
 */
export class HttpRpcRouter<PROVIDERS extends RemoteProcedureProviders> extends RpcRouter<PROVIDERS, Request, Response> {

    /**
     * Handles an RPC request by invoking the specified provider and method with the given arguments.
     * @param {Request} request - The HTTP request containing the RPC call details.
     * @returns {Promise<Response>} A promise that resolves to the HTTP response with the result of the RPC call.
     */
    async handle(request: Request): Promise<Response> {
        const { provider, method, args } = await request.json();

        return new Response(JSON.stringify(this.invoke(provider, method, args)), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
}