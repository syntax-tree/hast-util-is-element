// Check if if `node` is an `element` and whether it passes the given test.
// eslint-disable-next-line max-params
export function isElement(node, test, index, parent, context) {
  var check = convertElement(test)

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

export function convertElement(test) {
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
    return callFactory(test)
  }

  throw new Error('Expected function, string, or array as test')
}

function anyFactory(tests) {
  var index = -1
  var checks = []

  while (++index < tests.length) {
    checks[index] = convertElement(tests[index])
  }

  return any

  function any(...parameters) {
    var index = -1

    while (++index < checks.length) {
      if (checks[index].call(this, ...parameters)) {
        return true
      }
    }

    return false
  }
}

// Utility to convert a string a tag name check.
function tagNameFactory(test) {
  return tagName

  function tagName(node) {
    return element(node) && node.tagName === test
  }
}

// Utility to convert a function check.
function callFactory(test) {
  return call

  function call(node, ...parameters) {
    return element(node) && Boolean(test.call(this, node, ...parameters))
  }
}

// Utility to return true if this is an element.
function element(node) {
  return (
    node &&
    typeof node === 'object' &&
    node.type === 'element' &&
    typeof node.tagName === 'string'
  )
}
