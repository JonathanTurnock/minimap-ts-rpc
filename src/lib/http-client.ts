import {RpcClient} from "./client.ts";
import {RemoteProcedureProviders} from "./types.ts";

/**
 * Class representing an HTTP-based RPC (Remote Procedure Call) client.
 */
export class HttpRpcClient<PROVIDERS extends RemoteProcedureProviders>
    extends RpcClient<PROVIDERS> {
    constructor(private readonly url: URL | string) {
        super();
    }

    /**
     * Handles an RPC request by sending it to the server via HTTP POST.
     * @param {any} request - The RPC request to handle.
     * @returns {Promise<any>} A promise that resolves to the response from the server.
     */
    async handle(request: any): Promise<any> {
        const result = await fetch(this.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        });

        return result.json();
    }
}