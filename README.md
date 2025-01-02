# Lightweight RPC Framework with Full Type Safety

This project provides an example of how to do RPC without depending on full
frameworks like TRPC, but keeping offering full type safety and minimal
overhead.

It allows you to define remote procedure calls (RPC) with TypeScript, ensuring
type safety across the client and server.

## Features

- **Full Type Safety**: Ensures that the types of your RPC methods are
  consistent between the client and server.
- **Minimal Overhead**: Lightweight and easy to integrate into existing
  projects.
- **Simple API**: Easy to define and use remote procedures.

## Getting Started

### Prerequisites

This example uses Deno as an example, but the RPC example can be used with any
JavaScript/TypeScript runtime and web framework.

### Defining Remote Procedures

Create a file, see `src/server/foo.ts` to define your remote procedures:

```typescript
/**
 * A string variable representing the value of foo.
 */
let foo = "Foo";

/**
 * Gets the current value of foo.
 * @returns {string} The current value of foo.
 */
function getFoo(): string {
  return foo;
}

/**
 * Sets a new value for foo.
 * @param {string} _foo - The new value to set for foo.
 * @returns {string} The updated value of foo.
 */
function setFoo(_foo: string): string {
  console.log(`Invoked Set Foo with ${_foo}`);
  foo = _foo;
  return foo;
}

/**
 * An object that provides methods to get and set the value of foo.
 */
export const fooProvider = { getFoo, setFoo };
```

### Setting Up the Server

Create a file `src/server/main.ts` to set up the RPC server:

```typescript
import { HttpRpcRouter } from "../lib/http-router.ts";
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
```

### Setting Up the Client

Create a file `src/client/main.ts` to set up the RPC client:

```typescript
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
```

### Running the Server

Start the Deno server by running the following command:

```shell
deno run --allow-net src/server/main.ts
```

### Making RPC Calls

You can make RPC calls using the client as shown in `src/client/main.ts`. For
example, to get and set the value of `foo`:

```typescript
foo.getFoo().then((result) => {
  console.log(result);
});

foo.setFoo("bar").then((result) => {
  console.log(result);
});
```

### Using Curl

You can also make RPC calls using `curl`:

```shell
curl --location 'http://127.0.0.1:8000/rpc' \
--header 'Content-Type: application/json' \
--data '{
    "provider": "foo",
    "method": "getFoo",
    "args": []
}'
```

## Extending the Client and Router for other Transports

The example uses HTTP as the transport layer, but you can extend the client and router to use other transports as necessary:

To create new transports, you need to extend the `RpcClient` and `RpcRouter` classes to handle the desired transport mechanism. For example, if you want to use WebSockets instead of HTTP, you would create `WebSocketRpcClient` and `WebSocketRpcRouter` classes. These classes should implement the `handle` method to send and receive RPC requests and responses using WebSockets. By following this approach, you can easily adapt the framework to use different transport layers while maintaining full type safety and minimal overhead. This extensibility allows the framework to be used in various environments and applications, such as local networks or inter-process communication (IPC).

### Router Example
```typescript
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
```

### Client Example
```typescript
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
```

## Conclusion

This is just a simple demonstration as reference for a lightweight RPC which
provides a simple and efficient way to define and use remote procedures with
full type safety.

> You really should not be using this for the standard Web as any RPC style
> framework breaks most of the principles of the Web and makes caching,
> security, and debugging much harder.

However, for other applications that would use RPC in predictable environments
like local networks or IPC this is an extensible and simple way to do RPC with
full type safety.
