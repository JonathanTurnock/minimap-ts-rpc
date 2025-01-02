import {HttpRpcRouter} from "../lib/http-router.ts";
import { fooProvider } from "./foo.ts";

/**
 * Type representing the RPC API, which includes the foo provider.
 */
export type RpcAPI = {
  foo: typeof fooProvider;
};

/**
 * Instance of RpcRouter configured with the RpcAPI type.
 */
export const router = new HttpRpcRouter<RpcAPI>({
  foo: fooProvider,
});

/**
 * Starts the Deno server and handles incoming requests.
 * Routes POST requests to /rpc to the RpcRouter instance.
 * Returns a 404 response for all other requests.
 */
Deno.serve((req) => {
  const url = new URL(req.url);

  if (req.method === "POST" && url.pathname === "/rpc") {
    return router.handle(req);
  }

  return new Response("Not Found", { status: 404 });
});
