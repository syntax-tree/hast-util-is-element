# hast-util-is-element [![Build Status][build-badge]][build-page] [![Coverage Status][coverage-badge]][coverage-page]

Check if a [node][] is a (certain) [**HAST**][hast] [element][].

## Installation

[npm][]:

```bash
npm install hast-util-is-element
```

## Usage

```javascript
var is = require('hast-util-is-element');

isElement({type: 'text', value: 'foo'}); //=> false

is({type: 'element', tagName: 'a'}, 'a'); //=> true

is({type: 'element', tagName: 'a'}, ['a', 'area']); //=> true
```

## API

### `isElement(node[, tagName|tagNames])`

Check if a [node][] is a (certain) [**HAST**][hast] [element][].

When not given a second parameter, asserts if `node` is an element,
otherwise asserts `node` is an element whose `tagName` matches / is
included in the second parameter.

###### Parameters

*   `node` (`*`) — Value to check;
*   `tagName` (`string`, optional) — Value `node`s `tagName` must match;
*   `tagNames` (`string`, optional) — Value including `node`s `tagName`.

######Returns

`boolean` — whether `node` passes the test.

###### Throws

`Error` — When the second parameter is given but invalid.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definition -->

[build-badge]: https://img.shields.io/travis/wooorm/hast-util-is-element.svg

[build-page]: https://travis-ci.org/wooorm/hast-util-is-element

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/hast-util-is-element.svg

[coverage-page]: https://codecov.io/github/wooorm/hast-util-is-element?branch=master

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[hast]: https://github.com/wooorm/hast

[node]: https://github.com/wooorm/hast#node

[element]: https://github.com/wooorm/hast#element
