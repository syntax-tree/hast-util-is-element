/**
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('hast').Element} Element
 */

/**
 * @typedef {string} TagName
 *   Check for a certain tag name.
 *
 * @typedef {null | undefined | TagName | TestFunctionAnything | Array<TagName | TestFunctionAnything>} Test
 *   Check for an arbitrary element, unaware of TypeScript.
 *
 * @callback TestFunctionAnything
 *   Check if an element passes a test, unaware of TypeScript.
 * @param {Element} element
 *   An element.
 * @param {number | null | undefined} [index]
 *   Optionally, its position in its parent.
 * @param {Parent | null | undefined} [parent]
 *   Optionally, its parent.
 * @returns {boolean | void}
 *   Whether this element passes the test.
 */

/**
 * @template {Element} T
 *   Element type.
 * @typedef {T['tagName'] | TestFunctionPredicate<T> | Array<T['tagName'] | TestFunctionPredicate<T>>} PredicateTest
 *   Basic check for an element that can be inferred by TypeScript.
 */

/**
 * Check if an element passes a certain node test.
 *
 * @template {Element} T
 *   Element type.
 * @callback TestFunctionPredicate
 *   Complex test function for an element that can be inferred by TypeScript.
 * @param {Element} element
 *   An element.
 * @param {number | null | undefined} [index]
 *   Optionally, its position in its parent.
 * @param {Parent | null | undefined} [parent]
 *   Optionally, its parent.
 * @returns {element is T}
 *   Whether this element passes the test.
 */

/**
 * Check if a node is an element and passes a certain node test
 *
 * @callback AssertAnything
 *   Check that an arbitrary value is an element, unaware of TypeScript.
 * @param {unknown} [node]
 *   Anything (typically a node).
 * @param {number | null | undefined} [index]
 *   Optionally, its position in its parent.
 * @param {Parent | null | undefined} [parent]
 *   Optionally, its parent.
 * @returns {boolean}
 *   Whether this is an element and passes a test.
 */

/**
 * Check if a node is an element and passes a certain node test
 *
 * @template {Element} T
 *   Element type.
 * @callback AssertPredicate
 *   Check that an arbitrary value is a specific element, aware of TypeScript.
 * @param {unknown} [node]
 *   Anything (typically a node).
 * @param {number | null | undefined} [index]
 *   Optionally, its position in its parent.
 * @param {Parent | null | undefined} [parent]
 *   Optionally, its parent.
 * @returns {node is T}
 *   Whether this is an element and passes a test.
 */

/**
 * Check if `node` is an `Element` and whether it passes the given test.
 *
 * @param node
 *   Anything (typically a node).
 * @param test
 *   A check.
 * @param index
 *   Optionally, its position in its parent.
 * @param parent
 *   Optionally, its parent.
 * @returns
 *   Whether `node` is an element and passes a test.
 */
export const isElement =
  /**
   * @type {(
   *   (() => false) &
   *   (<T extends Element = Element>(node: unknown, test?: PredicateTest<T>, index?: number, parent?: Parent, context?: unknown) => node is T) &
   *   ((node: unknown, test: Test, index?: number, parent?: Parent, context?: unknown) => boolean)
   * )}
   */
  (
    /**
     * @param {unknown} [node]
     * @param {Test | undefined} [test]
     * @param {number | null | undefined} [index]
     * @param {Parent | null | undefined} [parent]
     * @param {unknown} [context]
     * @returns {boolean}
     */
    // eslint-disable-next-line max-params
    function (node, test, index, parent, context) {
      const check = convertElement(test)

      if (
        index !== undefined &&
        index !== null &&
        (typeof index !== 'number' ||
          index < 0 ||
          index === Number.POSITIVE_INFINITY)
      ) {
        throw new Error('Expected positive finite index for child node')
      }

      if (
        parent !== undefined &&
        parent !== null &&
        (!parent.type || !parent.children)
      ) {
        throw new Error('Expected parent node')
      }

      // @ts-expect-error Looks like a node.
      if (!node || !node.type || typeof node.type !== 'string') {
        return false
      }

      if (
        (parent === undefined || parent === null) !==
        (index === undefined || index === null)
      ) {
        throw new Error('Expected both parent and index')
      }

      return check.call(context, node, index, parent)
    }
  )

/**
 * Generate an assertion from a check.
 *
 * @param test
 *   *  When nullish, checks if `node` is a `Node`.
 *   *  When `string`, works like passing `function (node) {return node.type === test}`.
 *   *  When `function` checks if function passed the node is true.
 *   *  When `object`, checks that all keys in test are in node, and that they have (strictly) equal values.
 *   *  When `array`, checks any one of the subtests pass.
 * @returns
 *   A test.
 */
export const convertElement =
  /**
   * @type {(
   *   (<T extends Element>(test: T['tagName'] | TestFunctionPredicate<T>) => AssertPredicate<T>) &
   *   ((test?: Test) => AssertAnything)
   * )}
   */
  (
    /**
     * @param {Test | null | undefined} [test]
     * @returns {AssertAnything}
     */
    function (test) {
      if (test === undefined || test === null) {
        return element
      }

      if (typeof test === 'string') {
        return tagNameFactory(test)
      }

      if (typeof test === 'object') {
        return anyFactory(test)
      }

      if (typeof test === 'function') {
        return castFactory(test)
      }

      throw new Error('Expected function, string, or array as test')
    }
  )

/**
 * Handle multiple tests.
 *
 * @param {Array<TagName | TestFunctionAnything>} tests
 * @returns {AssertAnything}
 */
function anyFactory(tests) {
  /** @type {Array<AssertAnything>} */
  const checks = []
  let index = -1

  while (++index < tests.length) {
    checks[index] = convertElement(tests[index])
  }

  return castFactory(any)

  /**
   * @this {unknown}
   * @param {Array<unknown>} parameters
   * @returns {boolean}
   */
  function any(...parameters) {
    let index = -1

    while (++index < checks.length) {
      if (checks[index].call(this, ...parameters)) {
        return true
      }
    }

    return false
  }
}

/**
 * Turn a string into a test for an element with a certain tag name.
 *
 * @param {TagName} check
 * @returns {AssertAnything}
 */
function tagNameFactory(check) {
  return tagName

  /**
   * @param {unknown} node
   * @returns {boolean}
   */
  function tagName(node) {
    return element(node) && node.tagName === check
  }
}

/**
 * Turn a custom test into a test for an element that passes that test.
 *
 * @param {TestFunctionAnything} check
 * @returns {AssertAnything}
 */
function castFactory(check) {
  return assertion

  /**
   * @this {unknown}
   * @param {unknown} node
   * @param {Array<unknown>} parameters
   * @returns {boolean}
   */
  function assertion(node, ...parameters) {
    // @ts-expect-error: fine.
    return element(node) && Boolean(check.call(this, node, ...parameters))
  }
}

/**
 * Make sure something is an element.
 *
 * @param {unknown} node
 * @returns {node is Element}
 */
function element(node) {
  return Boolean(
    node &&
      typeof node === 'object' &&
      // @ts-expect-error Looks like a node.
      node.type === 'element' &&
      // @ts-expect-error Looks like an element.
      typeof node.tagName === 'string'
  )
}
