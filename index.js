'use strict'

var convert = require('./convert')

module.exports = isElement

isElement.convert = convert

// Check if if `node` is an `element` and whether it passes the given test.
function isElement(node, test, index, parent, context) {
  var check = convert(test)

  if (
    index != null &&
    (typeof index !== 'number' ||
      index < 0 ||
      index === Number.POSITIVE_INFINITY)
  ) {
    throw new Error('Expected positive finite index for child node')
  }

  if (parent != null && (!parent.type || !parent.children)) {
    throw new Error('Expected parent node')
  }

  if (!node || !node.type || typeof node.type !== 'string') {
    return false
  }

  if ((parent == null) !== (index == null)) {
    throw new Error('Expected both parent and index')
  }

  return check.call(context, node, index, parent)
}
