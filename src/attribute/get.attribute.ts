import {kebabCase} from '@oscarpalmer/atoms/string/case';
import {getAttributeValue} from '../internal/get-value';
import type {AriaBooleanAttribute} from '../models';

// #region Types

type ParsedAttributes<Keys extends string = string> = {
	[Key in Keys]: Key extends AriaBooleanAttribute
		? boolean | undefined
		: Key extends `data-${string}`
			? unknown
			: string | undefined;
};

type UnparsedAttributes<Keys extends string = string> = {
	[Key in Keys]: Key extends AriaBooleanAttribute ? boolean | undefined : string | undefined;
};

// #endregion

// #region Functions

/**
 * Get the value of a specific data attribute from an element
 *
 * @param element Element to get attribute from
 * @param name Attribute name
 * @param parse Parse value?
 * @returns Attribute value _(or `undefined`)_
 */
export function getAttribute(
	element: Element,
	name: `data-${string}`,
	parse: false,
): string | undefined;

/**
 * Get the value of a specific data attribute from an element
 *
 * @param element Element to get attribute from
 * @param name Attribute name
 * @returns Attribute value _(or `undefined`)_
 */
export function getAttribute(element: Element, name: `data-${string}`): unknown;

/**
 * Get the value of a specific aria attribute from an element
 *
 * @param element Element to get attribute from
 * @param name Attribute name
 * @returns Attribute value _(or `undefined`)_
 */
export function getAttribute<Name extends `aria-${string}`>(
	element: Element,
	name: Name,
): Name extends AriaBooleanAttribute ? boolean | undefined : string | undefined;

/**
 * Get the value of a specific attribute from an element
 *
 * @param element Element to get attribute from
 * @param name Attribute name
 * @returns Attribute value _(or `undefined`)_
 */
export function getAttribute(element: Element, name: string): string | undefined;

export function getAttribute(element: Element, name: string, parse?: boolean): unknown {
	if (element instanceof Element && typeof name === 'string') {
		return getAttributeValue(element, kebabCase(name), parse !== false);
	}
}

/**
 * Get specific attributes from an element
 *
 * @param element Element to get attributes from
 * @param names Attribute names
 * @param parse Parse data values?
 * @returns Object of named attributes
 */
export function getAttributes<Key extends string>(
	element: Element,
	names: Key[],
	parse: false,
): UnparsedAttributes<Key>;

/**
 * Get specific attributes from an element
 *
 * @param element Element to get attributes from
 * @param names Attribute names
 * @returns Object of named attributes
 */
export function getAttributes<Key extends string>(
	element: Element,
	names: Key[],
): ParsedAttributes<Key>;

/**
 * Get all attributes from an element
 *
 * @param element Element to get attributes from
 * @param parse Parse data values?
 * @returns Object of all attributes
 */
export function getAttributes(element: Element, parse: false): UnparsedAttributes;

/**
 * Get all attributes from an element
 *
 * @param element Element to get attributes from
 * @returns Object of all attributes
 */
export function getAttributes(element: Element): ParsedAttributes;

export function getAttributes<Key extends string>(
	element: Element,
	first?: boolean | Key[],
	second?: boolean,
): unknown {
	if (!(element instanceof Element)) {
		return {};
	}

	let names: string[] | undefined;

	if (Array.isArray(first)) {
		names = first;
	} else if (first == null || typeof first === 'boolean') {
		names = [...element.attributes].map(attribute => attribute.name);
	}

	if (names == null || names.length === 0) {
		return {};
	}

	const parse = first !== false && second !== false;

	const {length} = names;

	const attributes: Record<string, unknown> = {};

	for (let index = 0; index < length; index += 1) {
		const name = names[index];

		if (typeof name === 'string') {
			attributes[name] = getAttributeValue(element, kebabCase(name), parse);
		}
	}

	return attributes;
}

// #endregion
