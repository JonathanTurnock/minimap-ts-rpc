import { HttpRpcClient } from "../lib/http-client.ts";
import { RpcAPI } from "../server/main.ts";

/**
 * Instance of RpcClient configured with the RpcAPI type.
 * Connects to the RPC server at the specified URL.
 */
export const client = new HttpRpcClient<RpcAPI>("http://127.0.0.1:8000/rpc");

const foo = client.get("foo");

/**
 * Calls the getFoo method on the foo provider and logs the result.
 */
foo.getFoo().then((result) => {
  console.log(result);
});

/**
 * Calls the setFoo method on the foo provider with the value "bar" and logs the result.
 */
foo.setFoo("bar").then((result) => {
  console.log(result);
});
