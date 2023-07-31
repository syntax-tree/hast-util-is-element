import type {Element, Parents, Root, RootContent} from 'hast'
import {expectAssignable, expectNotType, expectType} from 'tsd'
import {convertElement, isElement} from './index.js'

// # Setup

const hastElement = (function (): Root | RootContent {
  return {type: 'element', tagName: 'a', properties: {}, children: []}
})()

const unknownValue = (function (): unknown {
  return {type: 'something'}
})()

const someTagName = (function (): string {
  return 'c'
})()

// # `isElement`

// No node.
expectType<false>(isElement())

// No test.
expectType<boolean>(isElement(hastElement))

if (isElement(unknownValue)) {
  expectType<Element>(unknownValue)
}

/* Nullish test. */
expectType<boolean>(isElement(hastElement, null))
expectType<boolean>(isElement(hastElement, undefined))

// String test.
if (isElement(hastElement, 'a')) {
  expectType<Element & {tagName: 'a'}>(hastElement)
}

if (isElement(hastElement, 'b')) {
  expectType<Element & {tagName: 'b'}>(hastElement)
}

if (isElement(hastElement, someTagName)) {
  expectType<Element>(hastElement)
}

// Function test (with explicit assertion).
expectType<boolean>(isElement(hastElement, isHeading2))

if (isElement(hastElement, isHeading2)) {
  expectType<Element & {tagName: 'h2'}>(hastElement)
}

if (isElement(hastElement, isParagraph)) {
  expectType<Element & {tagName: 'p'}>(hastElement)
}

if (isElement(hastElement, isParagraph)) {
  expectNotType<Element & {tagName: 'h2'}>(hastElement)
}

if (isElement(hastElement, isHeading2)) {
  expectAssignable<Element>(hastElement)
  expectType<'h2'>(hastElement.tagName)
}

// Function test (implicit assertion).
expectType<boolean>(isElement(hastElement, isHeading2Loose))

if (isElement(hastElement, isHeading2Loose)) {
  expectNotType<Element & {tagName: 'h2'}>(hastElement)
}

if (isElement(hastElement, isParagraphLoose)) {
  expectNotType<Element & {tagName: 'p'}>(hastElement)
}

if (isElement(hastElement, isHead)) {
  expectType<Element>(hastElement)
}

// Array tests.
// Can’t narrow down.
expectType<boolean>(isElement(hastElement, ['h2', isHeading2, isHeading2Loose]))

// Can’t narrow down.
if (isElement(hastElement, ['h2', isHeading2, isHeading2Loose])) {
  expectNotType<Element & {tagName: 'h2'}>(hastElement)
}

// # `convertElement`

// No node.
const checkNone = convertElement()
expectType<boolean>(checkNone())

// No test.
expectType<boolean>(checkNone(hastElement))

if (checkNone(unknownValue)) {
  expectType<Element>(unknownValue)
}

/* Nullish test. */
const checkNull = convertElement(null)
const checkUndefined = convertElement(null)
expectType<boolean>(checkNull(hastElement))
expectType<boolean>(checkUndefined(hastElement))

// String test.
const checkHeading2 = convertElement('h2')
const checkParagraph = convertElement('p')

if (checkHeading2(hastElement)) {
  expectType<Element & {tagName: 'h2'}>(hastElement)
}

if (checkParagraph(hastElement)) {
  expectType<Element & {tagName: 'p'}>(hastElement)
}

// Function test (with explicit assertion).
const checkParagraphFn = convertElement(isParagraph)
const checkHeading2Fn = convertElement(isHeading2)

expectType<boolean>(checkHeading2Fn(hastElement))

if (checkHeading2Fn(hastElement)) {
  expectType<Element & {tagName: 'h2'}>(hastElement)
}

if (checkParagraphFn(hastElement)) {
  expectType<Element & {tagName: 'p'}>(hastElement)
}

if (checkParagraphFn(hastElement)) {
  expectNotType<Element & {tagName: 'h2'}>(hastElement)
}

if (checkHeading2Fn(hastElement)) {
  expectAssignable<Element>(hastElement)
  expectType<'h2'>(hastElement.tagName)
}

// Function test (implicit assertion).
const checkHeading2LooseFn = convertElement(isHeading2Loose)
const checkParagraphLooseFn = convertElement(isParagraphLoose)
const checkHeadFn = convertElement(isHead)

expectType<boolean>(checkHeading2LooseFn(hastElement))

if (checkHeading2LooseFn(hastElement)) {
  expectNotType<Element & {tagName: 'h2'}>(hastElement)
}

if (checkParagraphLooseFn(hastElement)) {
  expectNotType<Element & {tagName: 'p'}>(hastElement)
}

if (checkHeadFn(hastElement)) {
  expectNotType<Element & {tagName: 'h2'}>(hastElement)
}

// Array tests.
// Can’t narrow down.
const isHeadingArray = convertElement(['h2', isHeading2, isHeading2Loose])

expectType<boolean>(isHeadingArray(hastElement))

// Can’t narrow down.
if (isHeadingArray(hastElement)) {
  expectNotType<Element & {tagName: 'h2'}>(hastElement)
}

function isHeading2(element: Element): element is Element & {tagName: 'h2'} {
  return element.tagName === 'h2'
}

function isHeading2Loose(element: Element) {
  return element.tagName === 'h2'
}

function isParagraph(element: Element): element is Element & {tagName: 'p'} {
  return element.tagName === 'p'
}

function isParagraphLoose(element: Element) {
  return element.tagName === 'p'
}

function isHead(
  element: Element,
  index: number | undefined,
  parent: Parents | undefined
) {
  return parent ? index === 0 : false
}
