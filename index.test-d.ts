import {unified} from 'unified'
import {Node} from 'unist'
import {expectType, expectNotType, expectError} from 'tsd'
import {Element} from 'hast'
import {isElement, convertElement} from './index.js'

/* Setup. */
interface Section extends Element {
  tagName: 'section'
}

interface Article extends Element {
  tagName: 'article'
}

const section: Element = {
  type: 'element',
  tagName: 'section',
  properties: {},
  children: [{type: 'text', value: 'x'}]
}

const article: Element = {
  type: 'element',
  tagName: 'article',
  properties: {},
  children: [{type: 'text', value: 'x'}]
}

const isSection = (element: Element): element is Section =>
  element.tagName === 'section'

expectType<false>(isElement())

/* Missing parameters. */
expectError(isElement<Section>())

/* Types cannot be narrowed without predicate. */
expectType<boolean>(isElement(section))

/* Incorrect generic. */
expectError(isElement<string>(section, 'section'))
expectError(isElement<boolean>(section, 'section'))
expectError(isElement<Record<string, unknown>>(section, 'section'))

/* Should be assignable to boolean. */
expectType<boolean>(isElement<Section>(section, 'section'))

/* Test isElement optional */
expectType<boolean>(isElement(section))
expectType<boolean>(isElement(section, null))
expectType<boolean>(isElement(section, undefined))
/* But not with a type predicate */
expectError(isElement<Node>(section)) // But not with a type predicate
expectError(isElement<Node>(section, null))
expectError(isElement<Node>(section, undefined))

/* Should support string tests. */
expectType<boolean>(isElement<Section>(section, 'section'))
expectType<boolean>(isElement<Section>(article, 'section'))
expectError(isElement<Section>(section, 'article'))

if (isElement<Section>(section, 'section')) {
  expectType<Section>(section)
  expectNotType<Article>(section)
}

expectType<boolean>(isElement<Article>(article, 'article'))
expectType<boolean>(isElement<Article>(section, 'article'))
expectError(isElement<Article>(article, 'section'))

if (isElement<Article>(article, 'article')) {
  expectType<Article>(article)
  expectNotType<Section>(article)
}

/* Should support function tests. */
expectType<boolean>(isElement(section, isSection))
expectType<boolean>(isElement(article, isSection))

if (isElement(section, isSection)) {
  expectType<Section>(section)
  expectNotType<Article>(section)
}

expectType<boolean>(isElement(article, isSection))
expectType<boolean>(isElement(section, isSection))
expectError(isElement<Article>(article, isSection))

if (isElement(section, isSection)) {
  expectType<Section>(section)
}

/* Should support array tests. */
expectType<boolean>(
  isElement<Article | Section>(section, ['article', isSection])
)

if (isElement<Article | Section>(section, ['article', isSection])) {
  switch (section.tagName) {
    case 'section': {
      expectType<Section>(section)
      break
    }

    case 'article': {
      expectType<Article>(section)
      break
    }

    default: {
      break
    }
  }
}

/* Should support being used in a unified transform. */
unified().use(() => (tree) => {
  if (isElement<Section>(tree, 'section')) {
    expectType<Section>(tree)
    // Do something
  }

  return tree
})

/* Should support `convert`. */
convertElement<Section>('section')
expectError(convertElement<Section>('article'))
convertElement<Section>(isSection)
expectError(convertElement<Article>(isSection))
convertElement()
convertElement(null)
convertElement(undefined)
expectError(convertElement<Article>())

declare const node: unknown

/* Type assertion */
if (isElement(node)) {
  expectType<Element>(node)
}

if (isElement(node, (node): node is Section => node.tagName === 'section')) {
  expectType<Section>(node)
}

/**
 * Should prefer `isElement(node) && node.children.length > 0`,
 * see below comments for details.
 */
if (isElement(node, (node) => node.children.length > 0)) {
  expectType<unknown>(node)
} else {
  expectType<unknown>(node)
}

/**
 * This is suggested to be used because `isElement(node)` is a correct assertion,
 * but with a second param `test` which is not an assertion,
 * the whole `isElement(node, test)` expression can not be an assertion anymore.
 */
if (isElement(node) && node.children.length > 0) {
  expectType<Element>(node)
} else {
  expectType<unknown>(node)
}
