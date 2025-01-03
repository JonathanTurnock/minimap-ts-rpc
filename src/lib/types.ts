/**
 * Type representing a remote procedure which is a function that takes any number of arguments and returns any type.
 *
 * All Arguments and return types must be serializable to JSON otherwise the RPC system will miss them.
 */
export type RemoteProcedure = (...args: any[]) => any;

/**
 * Type representing a provider of remote procedures, which is a record where keys are strings and values are RemoteProcedure functions.
 */
export type RemoteProcedureProvider = Record<string, RemoteProcedure>;

/**
 * Type representing multiple providers of remote procedures, which is a record where keys are strings and values are RemoteProcedureProvider objects.
 */
export type RemoteProcedureProviders = Record<string, RemoteProcedureProvider>;

/**
 * Utility type that transforms all functions in a given type T to return Promises.
 *
 * This is required for the RPC system to work, as all remote procedures once called from the client will become Promises even if their original return type is not a Promise.
 */
export type AsPromises<T> = {
  [P in keyof T]: T[P] extends (...args: infer A) => infer R
      ? (...args: A) => R extends Promise<any> ? R : Promise<R>
      : never;
};

/**
 * Error class representing a routing error in the RPC system. This error is thrown when a remote procedure is not found.
 *
 * This should be handled differently from general Error objects, as it represents a specific error condition in the RPC system.
 *
 * @extends Error
 */
export class RpcRoutingError extends Error {
  constructor(message: string) {
    super(message);
  }
}
