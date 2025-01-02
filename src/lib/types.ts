/**
 * Type representing a remote procedure which is a function that takes any number of arguments and returns any type.
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
 */
export type AsPromises<T> = {
    [P in keyof T]: T[P] extends (...args: infer A) => infer R
        ? (...args: A) => Promise<R>
        : never;
};