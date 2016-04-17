// Dependencies:
var isElement = require('./index.js');

// Given a non-element:
var result = isElement({
    'type': 'text',
    'value': 'foo'
});

// Yields:
console.log('js', String(result));

// Given a matching element:
result = isElement({
    'type': 'element',
    'tagName': 'a'
}, 'a');

// Yields:
console.log('js', String(result));

// Given multiple tagNames:
result = isElement({
    'type': 'element',
    'tagName': 'a'
}, ['a', 'area']);

// Yields:
console.log('js', String(result));
