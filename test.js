/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('unist').Parent} Parent
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {isElement} from './index.js'

test('isElement', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('./index.js')).sort(), [
      'convertElement',
      'isElement'
    ])
  })

  await t.test('should return `false` without node', async function () {
    assert.equal(isElement(), false)
  })

  await t.test('should return `false` with `null`', async function () {
    assert.equal(isElement(null), false)
  })

  await t.test(
    'should throw when the second parameter is invalid',
    async function () {
      assert.throws(function () {
        // @ts-expect-error: check that the runtime handles an incorrect `test`.
        isElement(null, true)
      }, /Expected function, string, or array as test/)
    }
  )
})

test('isElement(node)', async function (t) {
  await t.test(
    'should return `false` when without `element`',
    async function () {
      assert.equal(isElement({type: 'text'}), false)
    }
  )

  await t.test(
    'should return `false` when with invalid `element`',
    async function () {
      assert.equal(isElement({type: 'element'}), false)
    }
  )

  await t.test(
    'should return `true` when with valid `element`',
    async function () {
      assert.equal(isElement({type: 'element', tagName: 'div'}), true)
    }
  )
})

test('isElement(node, tagName)', async function (t) {
  await t.test(
    'should return `false` when without `element`',
    async function () {
      assert.equal(isElement({type: 'text'}, 'div'), false)
    }
  )

  await t.test(
    'should return `false` when with invalid `element`',
    async function () {
      assert.equal(isElement({type: 'element'}, 'div'), false)
    }
  )

  await t.test(
    'should return `false` when without matching `element`',
    async function () {
      assert.equal(
        isElement({type: 'element', tagName: 'strong'}, 'div'),
        false
      )
    }
  )

  await t.test(
    'should return `true` when with matching `element`',
    async function () {
      assert.equal(isElement({type: 'element', tagName: 'div'}, 'div'), true)
    }
  )
})

test('isElement(node, tagNames)', async function (t) {
  await t.test(
    'should return `false` when without `element`',
    async function () {
      assert.equal(isElement({type: 'text'}, ['div']), false)
    }
  )

  await t.test(
    'should return `false` when with invalid `element`',
    async function () {
      assert.equal(isElement({type: 'element'}, ['div']), false)
    }
  )

  await t.test(
    'should return `false` when without matching `element`',
    async function () {
      assert.equal(
        isElement({type: 'element', tagName: 'strong'}, ['div']),
        false
      )
    }
  )

  await t.test(
    'should return `true` when with matching `element` (#1)',
    async function () {
      assert.equal(
        isElement({type: 'element', tagName: 'div'}, ['div', 'strong', 'em']),
        true
      )
    }
  )

  await t.test(
    'should return `true` when with matching `element` (#2)',
    async function () {
      assert.equal(
        isElement({type: 'element', tagName: 'em'}, ['div', 'strong', 'em']),
        true
      )
    }
  )
})

test('isElement(node, test)', async function (t) {
  const ctx = {}
  const root = {
    type: 'root',
    children: [{type: 'element', tagName: 'a', children: []}]
  }

  await t.test(
    'should not call `test` if the given node is not an element',
    async function () {
      assert.equal(
        isElement({type: 'text'}, function () {
          throw new Error('!')
        }),
        false
      )
    }
  )

  await t.test(
    'should call `test` if the given node is a valid element (1)',
    async function () {
      assert.equal(
        isElement(
          {type: 'element', tagName: 'a', children: []},
          function (node) {
            return node.children.length === 0
          }
        ),
        true
      )
    }
  )

  await t.test(
    'should call `test` if the given node is a valid element (2)',
    async function () {
      assert.equal(
        isElement(
          {type: 'element', tagName: 'a', children: [{type: 'text'}]},
          function (node) {
            return node.children.length === 0
          }
        ),
        false
      )
    }
  )

  await t.test(
    'should call `test` if the given node is a valid element (2)',
    async function () {
      assert.equal(
        isElement(
          root.children[0],
          /**
           * @this {ctx}
           * @param {Element} node
           * @param {number | undefined | null} index
           * @param {Parent | undefined | null} parent
           */
          function (node, index, parent) {
            assert.equal(node, root.children[0])
            assert.equal(index, 0)
            assert.equal(parent, root)
            assert.equal(this, ctx)
          },
          0,
          root,
          ctx
        ),
        false
      )
    }
  )

  await t.test(
    'should throw if `index` is passed but not `parent`',
    async function () {
      assert.throws(function () {
        isElement(root.children[0], function () {}, 0)
      }, /Expected both parent and index/)
    }
  )

  await t.test(
    'should throw if `parent` is passed but not `index`',
    async function () {
      assert.throws(function () {
        isElement(root.children[0], function () {}, undefined, root)
      }, /Expected both parent and index/)
    }
  )

  await t.test('should throw if `index` is not a number', async function () {
    assert.throws(function () {
      // @ts-expect-error: check that the runtime handles an incorrect `index`.
      isElement(root.children[0], function () {}, false)
    }, /Expected positive finite index for child node/)
  })

  await t.test('should throw if `index` is negative', async function () {
    assert.throws(function () {
      isElement(root.children[0], function () {}, -1)
    }, /Expected positive finite index for child node/)
  })

  await t.test('should throw if `index` is infinity', async function () {
    assert.throws(function () {
      isElement(root.children[0], function () {}, Number.POSITIVE_INFINITY)
    }, /Expected positive finite index for child node/)
  })

  await t.test('should throw if `parent` is not a node', async function () {
    assert.throws(function () {
      // @ts-expect-error: check that the runtime handles an incorrect `parent`.
      isElement(root.children[0], function () {}, 0, true)
    }, /Expected parent node/)
  })

  await t.test('should throw if `parent` is not a parent', async function () {
    assert.throws(function () {
      // @ts-expect-error: check that the runtime handles a non-parent.
      isElement(root.children[0], function () {}, 0, {type: 'text'})
    }, /Expected parent node/)
  })
})
