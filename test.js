'use strict';

var test = require('tape');
var isElement = require('./index.js');

test('isElement', function (t) {
  t.equal(isElement(), false, 'should return `false` without node');
  t.equal(isElement(null), false, 'should return `false` with `null`');

  t.throws(
    function () {
      isElement(null, true);
    },
    'Expected `string` or `Array.<string>` for `tagNames`, not `true`',
    'should throw when the second parameter is invalid'
  );

  t.test('isElement(node)', function (st) {
    st.equal(
      isElement({type: 'text'}),
      false,
      'should return `false` when without `element`'
    );

    st.equal(
      isElement({type: 'element'}),
      false,
      'should return `false` when with invalid `element`'
    );

    st.equal(
      isElement({type: 'element', tagName: 'div'}),
      true,
      'should return `true` when with valid `element`'
    );

    st.end();
  });

  t.test('isElement(node, tagName)', function (st) {
    st.equal(
      isElement({type: 'text'}, 'div'),
      false,
      'should return `false` when without `element`'
    );

    st.equal(
      isElement({type: 'element'}, 'div'),
      false,
      'should return `false` when with invalid `element`'
    );

    st.equal(
      isElement({type: 'element', tagName: 'strong'}, 'div'),
      false,
      'should return `false` when without matching `element`'
    );

    st.equal(
      isElement({type: 'element', tagName: 'div'}, 'div'),
      true,
      'should return `true` when with matching `element`'
    );

    st.end();
  });

  t.test('isElement(node, tagNames)', function (st) {
    st.equal(
      isElement({type: 'text'}, ['div']),
      false,
      'should return `false` when without `element`'
    );

    st.equal(
      isElement({type: 'element'}, ['div']),
      false,
      'should return `false` when with invalid `element`'
    );

    st.equal(
      isElement({type: 'element', tagName: 'strong'}, ['div']),
      false,
      'should return `false` when without matching `element`'
    );

    st.equal(
      isElement({type: 'element', tagName: 'div'}, ['div', 'strong', 'em']),
      true,
      'should return `true` when with matching `element` (#1)'
    );

    st.equal(
      isElement({type: 'element', tagName: 'em'}, ['div', 'strong', 'em']),
      true,
      'should return `true` when with matching `element` (#2)'
    );

    st.end();
  });

  t.end();
});
