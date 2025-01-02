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
