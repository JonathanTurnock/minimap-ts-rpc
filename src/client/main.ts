import { HttpRpcClient } from "../lib/http-client.ts";
import { RpcAPI } from "../server/main.ts";

/**
 * Instance of RpcClient configured with the RpcAPI type.
 * Connects to the RPC server at the specified URL.
 */
export const client = new HttpRpcClient<RpcAPI>("http://127.0.0.1:8000/rpc");

/**
 * Proxy object for the foo provider on the RPC server.
 * Provides type-safe access to the procedures of the foo provider.
 */
const foo = client.get("foo");

/**
 * Call the getFoo procedure on the foo provider and log the result.
 * This has the exact same signature as the getFoo procedure on the server and all the same Intellisense support.
 */
console.log("Calling getFoo procedure on foo provider...");
foo.getFoo().then((result) => {
  console.log(`Result of getFoo: ${result}`);
});

/**
 * Call the setFoo procedure on the foo provider and log the result.
 * This has the exact same signature as the setFoo procedure on the server and all the same Intellisense support.
 */
console.log("Calling setFoo procedure on foo provider...");
foo.setFoo("bar").then((result) => {
  console.log(`Result of setFoo: ${result}`);
});
