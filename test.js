/**
 * @typedef {import('unist').Parent} Parent
 * @typedef {import('hast').Element} Element
 */

import test from 'tape'
import {isElement} from './index.js'

test('isElement', (t) => {
  t.equal(isElement(), false, 'should return `false` without node')
  t.equal(isElement(null), false, 'should return `false` with `null`')

  t.throws(
    () => {
      // @ts-expect-error runtime.
      isElement(null, true)
    },
    /Expected function, string, or array as test/,
    'should throw when the second parameter is invalid'
  )

  t.test('isElement(node)', (st) => {
    st.equal(
      isElement({type: 'text'}),
      false,
      'should return `false` when without `element`'
    )

    st.equal(
      isElement({type: 'element'}),
      false,
      'should return `false` when with invalid `element`'
    )

    st.equal(
      isElement({type: 'element', tagName: 'div'}),
      true,
      'should return `true` when with valid `element`'
    )

    st.end()
  })

  t.test('isElement(node, tagName)', (st) => {
    st.equal(
      isElement({type: 'text'}, 'div'),
      false,
      'should return `false` when without `element`'
    )

    st.equal(
      isElement({type: 'element'}, 'div'),
      false,
      'should return `false` when with invalid `element`'
    )

    st.equal(
      isElement({type: 'element', tagName: 'strong'}, 'div'),
      false,
      'should return `false` when without matching `element`'
    )

    st.equal(
      isElement({type: 'element', tagName: 'div'}, 'div'),
      true,
      'should return `true` when with matching `element`'
    )

    st.end()
  })

  t.test('isElement(node, tagNames)', (st) => {
    st.equal(
      isElement({type: 'text'}, ['div']),
      false,
      'should return `false` when without `element`'
    )

    st.equal(
      isElement({type: 'element'}, ['div']),
      false,
      'should return `false` when with invalid `element`'
    )

    st.equal(
      isElement({type: 'element', tagName: 'strong'}, ['div']),
      false,
      'should return `false` when without matching `element`'
    )

    st.equal(
      isElement({type: 'element', tagName: 'div'}, ['div', 'strong', 'em']),
      true,
      'should return `true` when with matching `element` (#1)'
    )

    st.equal(
      isElement({type: 'element', tagName: 'em'}, ['div', 'strong', 'em']),
      true,
      'should return `true` when with matching `element` (#2)'
    )

    st.end()
  })

  t.test('isElement(node, test)', (st) => {
    st.equal(
      isElement({type: 'text'}, () => {
        throw new Error('!')
      }),
      false,
      'should not call `test` if the given node is not an element'
    )

    st.equal(
      isElement({type: 'element', tagName: 'a', children: []}, (node) => {
        return node.children.length === 0
      }),
      true,
      'should call `test` if the given node is a valid element (1)'
    )

    st.equal(
      isElement(
        {type: 'element', tagName: 'a', children: [{type: 'text'}]},
        (node) => {
          return node.children.length === 0
        }
      ),
      false,
      'should call `test` if the given node is a valid element (2)'
    )

    const ctx = {}
    const root = {
      type: 'root',
      children: [{type: 'element', tagName: 'a', children: []}]
    }

    st.equal(
      isElement(
        root.children[0],
        /**
         * @this {ctx}
         * @param {Element} a
         * @param {number} b
         * @param {Parent} c
         */
        function (node, index, parent) {
          st.equal(node, root.children[0], 'should pass `node` to test')
          st.equal(index, 0, 'should pass `index` to test')
          st.equal(parent, root, 'should pass `parent` to test')
          st.equal(this, ctx, 'should pass `context` to test')
        },
        0,
        root,
        ctx
      ),
      false,
      'should call `test` if the given node is a valid element (2)'
    )

    st.throws(
      () => {
        isElement(root.children[0], () => {}, 0)
      },
      /Expected both parent and index/,
      'should throw if `index` is passed but not `parent`'
    )

    st.throws(
      () => {
        isElement(root.children[0], () => {}, undefined, root)
      },
      /Expected both parent and index/,
      'should throw if `parent` is passed but not `index`'
    )

    st.throws(
      () => {
        // @ts-expect-error runtime.
        isElement(root.children[0], () => {}, false)
      },
      /Expected positive finite index for child node/,
      'should throw if `index` is not a number'
    )

    st.throws(
      () => {
        isElement(root.children[0], () => {}, -1)
      },
      /Expected positive finite index for child node/,
      'should throw if `index` is negative'
    )

    st.throws(
      () => {
        isElement(root.children[0], () => {}, Number.POSITIVE_INFINITY)
      },
      /Expected positive finite index for child node/,
      'should throw if `index` is infinity'
    )

    st.throws(
      () => {
        // @ts-expect-error runtime.
        isElement(root.children[0], () => {}, 0, true)
      },
      /Expected parent node/,
      'should throw if `parent` is not a node'
    )

    st.throws(
      () => {
        // @ts-expect-error runtime.
        isElement(root.children[0], () => {}, 0, {type: 'root'})
      },
      /Expected parent node/,
      'should throw if `parent` is not a parent'
    )

    st.end()
  })

  t.end()
})
