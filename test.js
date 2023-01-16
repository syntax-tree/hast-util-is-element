/**
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('hast').Element} Element
 */

import assert from 'node:assert/strict'
import test from 'node:test'
import {isElement} from './index.js'
import * as mod from './index.js'

test('isElement', async (t) => {
  assert.deepEqual(
    Object.keys(mod).sort(),
    ['convertElement', 'isElement'],
    'should expose the public api'
  )

  assert.equal(isElement(), false, 'should return `false` without node')
  assert.equal(isElement(null), false, 'should return `false` with `null`')

  assert.throws(
    () => {
      // @ts-expect-error runtime.
      isElement(null, true)
    },
    /Expected function, string, or array as test/,
    'should throw when the second parameter is invalid'
  )

  await t.test('isElement(node)', () => {
    assert.equal(
      isElement({type: 'text'}),
      false,
      'should return `false` when without `element`'
    )

    assert.equal(
      isElement({type: 'element'}),
      false,
      'should return `false` when with invalid `element`'
    )

    assert.equal(
      isElement({type: 'element', tagName: 'div'}),
      true,
      'should return `true` when with valid `element`'
    )
  })

  await t.test('isElement(node, tagName)', () => {
    assert.equal(
      isElement({type: 'text'}, 'div'),
      false,
      'should return `false` when without `element`'
    )

    assert.equal(
      isElement({type: 'element'}, 'div'),
      false,
      'should return `false` when with invalid `element`'
    )

    assert.equal(
      isElement({type: 'element', tagName: 'strong'}, 'div'),
      false,
      'should return `false` when without matching `element`'
    )

    assert.equal(
      isElement({type: 'element', tagName: 'div'}, 'div'),
      true,
      'should return `true` when with matching `element`'
    )
  })

  await t.test('isElement(node, tagNames)', () => {
    assert.equal(
      isElement({type: 'text'}, ['div']),
      false,
      'should return `false` when without `element`'
    )

    assert.equal(
      isElement({type: 'element'}, ['div']),
      false,
      'should return `false` when with invalid `element`'
    )

    assert.equal(
      isElement({type: 'element', tagName: 'strong'}, ['div']),
      false,
      'should return `false` when without matching `element`'
    )

    assert.equal(
      isElement({type: 'element', tagName: 'div'}, ['div', 'strong', 'em']),
      true,
      'should return `true` when with matching `element` (#1)'
    )

    assert.equal(
      isElement({type: 'element', tagName: 'em'}, ['div', 'strong', 'em']),
      true,
      'should return `true` when with matching `element` (#2)'
    )
  })

  await t.test('isElement(node, test)', () => {
    assert.equal(
      isElement({type: 'text'}, () => {
        throw new Error('!')
      }),
      false,
      'should not call `test` if the given node is not an element'
    )

    assert.equal(
      isElement(
        {type: 'element', tagName: 'a', children: []},
        (node) => node.children.length === 0
      ),
      true,
      'should call `test` if the given node is a valid element (1)'
    )

    assert.equal(
      isElement(
        {type: 'element', tagName: 'a', children: [{type: 'text'}]},
        (node) => node.children.length === 0
      ),
      false,
      'should call `test` if the given node is a valid element (2)'
    )

    const ctx = {}
    const root = {
      type: 'root',
      children: [{type: 'element', tagName: 'a', children: []}]
    }

    assert.equal(
      isElement(
        root.children[0],
        /**
         * @this {ctx}
         * @param {Element} node
         * @param {number|undefined|null} index
         * @param {Parent|undefined|null} parent
         */
        function (node, index, parent) {
          assert.equal(node, root.children[0], 'should pass `node` to test')
          assert.equal(index, 0, 'should pass `index` to test')
          assert.equal(parent, root, 'should pass `parent` to test')
          assert.equal(this, ctx, 'should pass `context` to test')
        },
        0,
        root,
        ctx
      ),
      false,
      'should call `test` if the given node is a valid element (2)'
    )

    assert.throws(
      () => {
        isElement(root.children[0], () => {}, 0)
      },
      /Expected both parent and index/,
      'should throw if `index` is passed but not `parent`'
    )

    assert.throws(
      () => {
        isElement(root.children[0], () => {}, undefined, root)
      },
      /Expected both parent and index/,
      'should throw if `parent` is passed but not `index`'
    )

    assert.throws(
      () => {
        // @ts-expect-error runtime.
        isElement(root.children[0], () => {}, false)
      },
      /Expected positive finite index for child node/,
      'should throw if `index` is not a number'
    )

    assert.throws(
      () => {
        isElement(root.children[0], () => {}, -1)
      },
      /Expected positive finite index for child node/,
      'should throw if `index` is negative'
    )

    assert.throws(
      () => {
        isElement(root.children[0], () => {}, Number.POSITIVE_INFINITY)
      },
      /Expected positive finite index for child node/,
      'should throw if `index` is infinity'
    )

    assert.throws(
      () => {
        // @ts-expect-error runtime.
        isElement(root.children[0], () => {}, 0, true)
      },
      /Expected parent node/,
      'should throw if `parent` is not a node'
    )

    assert.throws(
      () => {
        // @ts-expect-error runtime.
        isElement(root.children[0], () => {}, 0, {type: 'root'})
      },
      /Expected parent node/,
      'should throw if `parent` is not a parent'
    )
  })
})
