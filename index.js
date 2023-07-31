/**
 * @typedef {import('./lib/index.js').AssertAnything} AssertAnything
 * @typedef {import('./lib/index.js').Test} Test
 * @typedef {import('./lib/index.js').TestFunctionAnything} TestFunctionAnything
 */

/**
 * @template {import('hast').Element} T
 * @typedef {import('./lib/index.js').AssertPredicate<T>} AssertPredicate
 */

/**
 * @template {import('hast').Element} T
 * @typedef {import('./lib/index.js').PredicateTest<T>} PredicateTest
 */

/**
 * @template {import('hast').Element} T
 * @typedef {import('./lib/index.js').TestFunctionPredicate<T>} TestFunctionPredicate
 */

export {convertElement, isElement} from './lib/index.js'
