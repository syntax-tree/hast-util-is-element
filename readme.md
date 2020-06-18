# hast-util-is-element

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**hast**][hast] utility to check if a [*node*][node] is a (certain)
[*element*][element].

## Install

[npm][]:

```sh
npm install hast-util-is-element
```

## Use

```js
var is = require('hast-util-is-element')

is({type: 'text', value: 'foo'}) // => false

is({type: 'element', tagName: 'a'}, 'a') // => true

is({type: 'element', tagName: 'a'}, ['a', 'area']) // => true
```

## API

### `isElement(node[, tagName|tagNames])`

Check if the given value is a (certain) [*element*][element].

*   When given a `tagName` or `tagNames`, checks that `node` is an
    [*element*][element] whose `tagName` field matches `tagName` or is included
    in `tagNames`
*   Otherwise checks that `node` is an [*element*][element]

###### Parameters

*   `node` (`*`) — Value to check, probably [`Node`][node]
*   `tagName` (`string`, optional) — Value that `node`s `tagName` field should
    match
*   `tagNames` (`Array.<string>`, optional) — Values that should include `node`s
    `tagName` field should match

###### Returns

`boolean` — whether `node` passes the test.

###### Throws

`Error` — When the second parameter is given but invalid.

## Security

`hast-util-is-element` does not change the syntax tree so there are no openings
for [cross-site scripting (XSS)][xss] attacks.

## Related

*   [`hast-util-has-property`](https://github.com/syntax-tree/hast-util-has-property)
    — check if a node has a property
*   [`hast-util-is-body-ok-link`](https://github.com/rehypejs/rehype-minify/tree/HEAD/packages/hast-util-is-body-ok-link)
    — check if a node is “Body OK” link element
*   [`hast-util-is-conditional-comment`](https://github.com/rehypejs/rehype-minify/tree/HEAD/packages/hast-util-is-conditional-comment)
    — check if a node is a conditional comment
*   [`hast-util-is-css-link`](https://github.com/rehypejs/rehype-minify/tree/HEAD/packages/hast-util-is-css-link)
    — check if a node is a CSS link element
*   [`hast-util-is-css-style`](https://github.com/rehypejs/rehype-minify/tree/HEAD/packages/hast-util-is-css-style)
    — check if a node is a CSS style element
*   [`hast-util-embedded`](https://github.com/syntax-tree/hast-util-embedded)
    — check if a node is an embedded element
*   [`hast-util-heading`](https://github.com/syntax-tree/hast-util-heading)
    — check if a node is a heading element
*   [`hast-util-interactive`](https://github.com/syntax-tree/hast-util-interactive)
    — check if a node is interactive
*   [`hast-util-is-javascript`](https://github.com/rehypejs/rehype-minify/tree/HEAD/packages/hast-util-is-javascript)
    — check if a node is a JavaScript script element
*   [`hast-util-labelable`](https://github.com/syntax-tree/hast-util-labelable)
    — check whether a node is labelable
*   [`hast-util-phrasing`](https://github.com/syntax-tree/hast-util-phrasing)
    — check if a node is phrasing content
*   [`hast-util-script-supporting`](https://github.com/syntax-tree/hast-util-script-supporting)
    — check if a node is a script-supporting element
*   [`hast-util-sectioning`](https://github.com/syntax-tree/hast-util-sectioning)
    — check if a node is a sectioning element
*   [`hast-util-transparent`](https://github.com/syntax-tree/hast-util-transparent)
    — check if a node is a transparent element
*   [`hast-util-whitespace`](https://github.com/syntax-tree/hast-util-whitespace)
    — check if a node is inter-element whitespace

## Contribute

See [`contributing.md` in `syntax-tree/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definition -->

[build-badge]: https://img.shields.io/travis/syntax-tree/hast-util-is-element.svg

[build]: https://travis-ci.org/syntax-tree/hast-util-is-element

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/hast-util-is-element.svg

[coverage]: https://codecov.io/github/syntax-tree/hast-util-is-element

[downloads-badge]: https://img.shields.io/npm/dm/hast-util-is-element.svg

[downloads]: https://www.npmjs.com/package/hast-util-is-element

[size-badge]: https://img.shields.io/bundlephobia/minzip/hast-util-is-element.svg

[size]: https://bundlephobia.com/result?p=hast-util-is-element

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/syntax-tree

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[contributing]: https://github.com/syntax-tree/.github/blob/HEAD/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/HEAD/support.md

[coc]: https://github.com/syntax-tree/.github/blob/HEAD/code-of-conduct.md

[hast]: https://github.com/syntax-tree/hast

[node]: https://github.com/syntax-tree/unist#node

[element]: https://github.com/syntax-tree/hast#element

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting
