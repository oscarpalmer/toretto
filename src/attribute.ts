import {isPlainObject} from '@oscarpalmer/atoms/is';
import type {PlainObject} from '@oscarpalmer/atoms/models';
import {getString} from '@oscarpalmer/atoms/string';
import {getAttributeValue} from './internal/get-value';
import {isHTMLOrSVGElement} from './is';
import type {Attribute, HTMLOrSVGElement, Property} from './models';

/**
 * Get the value of a specific attribute from an element
 * @param element Element to get attribute from
 * @param name Attribute name
 * @param parse Parse value? _(defaults to `true`)_
 * @returns Attribute value _(or `undefined`)_
 */
export function getAttribute(
	element: HTMLOrSVGElement,
	name: `data-${string}`,
	parse?: boolean,
): unknown;

/**
 * Get the value of a specific attribute from an element
 * @param element Element to get attribute from
 * @param name Attribute name
 * @returns Attribute value _(or `undefined`)_
 */
export function getAttribute(element: HTMLOrSVGElement, name: string): unknown;

export function getAttribute(
	element: HTMLOrSVGElement,
	name: string,
	parseValues?: boolean,
): unknown {
	if (isHTMLOrSVGElement(element) && typeof name === 'string') {
		return getAttributeValue(element, name, parseValues !== false);
	}
}

/**
 * Get specific attributes from an element
 * @param element Element to get attributes from
 * @param names Attribute names
 * @param parseData Parse data values? _(defaults to `true`)_
 * @returns Object of named attributes
 */
export function getAttributes<Key extends string>(
	element: HTMLOrSVGElement,
	names: Key[],
	parseData?: boolean,
): Record<Key, unknown> {
	const attributes: Record<string, unknown> = {};

	if (!isHTMLOrSVGElement(element) || !Array.isArray(names)) {
		return attributes;
	}

	const shouldParse = parseData !== false;

	const {length} = names;

	for (let index = 0; index < length; index += 1) {
		const name = names[index];

		if (typeof name === 'string') {
			attributes[name] = getAttributeValue(element, name, shouldParse);
		}
	}

	return attributes;
}

function isAttribute(value: unknown): value is Attr | Attribute {
	return (
		value instanceof Attr ||
		(isPlainObject(value) &&
			typeof (value as PlainObject).name === 'string' &&
			typeof (value as PlainObject).value === 'string')
	);
}

/**
 * Is the attribute considered bad and potentially harmful?
 * @param attribute Attribute to check
 * @returns `true` if attribute is considered bad
 */
export function isBadAttribute(attribute: Attr | Attribute): boolean;

/**
 * Is the attribute considered bad and potentially harmful?
 * @param name Attribute name
 * @param value Attribute value
 * @returns `true` if attribute is considered bad
 */
export function isBadAttribute(name: string, value: string): boolean;

export function isBadAttribute(
	first: string | Attr | Attribute,
	second?: string,
): boolean {
	return validateAttribute(
		attribute =>
			attribute == null ||
			onPrefix.test(attribute.name) ||
			(sourcePrefix.test(attribute.name) &&
				valuePrefix.test(String(attribute.value))),
		first,
		second,
	);
}

/**
 * Is the attribute a boolean attribute?
 * @param name Attribute to check
 * @returns `true` if attribute is a boolean attribute
 */
export function isBooleanAttribute(attribute: Attr | Attribute): boolean;

/**
 * Is the attribute a boolean attribute?
 * @param name Attribute name
 * @returns `true` if attribute is a boolean attribute
 */
export function isBooleanAttribute(name: string): boolean;

export function isBooleanAttribute(value: string | Attr | Attribute): boolean {
	return validateAttribute(
		attribute =>
			attribute != null &&
			booleanAttributes.includes(attribute.name.toLowerCase()),
		value,
		'',
	);
}

/**
 * Is the attribute empty and not a boolean attribute?
 * @param attribute Attribute to check
 * @returns `true` if attribute is empty and not a boolean attribute
 */
export function isEmptyNonBooleanAttribute(
	attribute: Attr | Attribute,
): boolean;

/**
 * Is the attribute empty and not a boolean attribute?
 * @param name Attribute name
 * @param value Attribute value
 * @returns `true` if attribute is empty and not a boolean attribute
 */
export function isEmptyNonBooleanAttribute(
	name: string,
	value: string,
): boolean;

export function isEmptyNonBooleanAttribute(
	first: string | Attr | Attribute,
	second?: string,
): boolean {
	return validateAttribute(
		attribute =>
			attribute != null &&
			!booleanAttributes.includes(attribute.name) &&
			String(attribute.value).trim().length === 0,
		first,
		second,
	);
}

/**
 * Is the attribute an invalid boolean attribute?
 *
 * _(I.e., its value is not empty or the same as its name)_
 * @param attribute Attribute to check
 * @returns `true` if attribute is an invalid boolean attribute
 */
export function isInvalidBooleanAttribute(attribute: Attr | Attribute): boolean;

/**
 * Is the attribute an invalid boolean attribute?
 *
 * _(I.e., its value is not empty or the same as its name)_
 * @param name Attribute name
 * @param value Attribute value
 * @returns `true` if attribute is an invalid boolean attribute
 */
export function isInvalidBooleanAttribute(name: string, value: string): boolean;

export function isInvalidBooleanAttribute(
		first: string | Attr | Attribute,
		second?: string,
	): boolean {
		return validateAttribute(
			attribute => {
				if (attribute == null) {
					return true;
				}

				if (!booleanAttributes.includes(attribute.name)) {
					return false;
				}

				const normalized = String(attribute.value).toLowerCase().trim();

				return !(normalized.length === 0 || normalized === attribute.name);
			},
			first,
			second,
		);
	}

function isProperty(value: unknown): value is Property {
	return (
		isPlainObject(value) && typeof (value as PlainObject).name === 'string'
	);
}

/**
 * Set an attribute on an element
 *
 * _(Or remove it, if value is `null` or `undefined`)_
 * @param element Element for attribute
 * @param attribute Attribute to set
 */
export function setAttribute(
		element: HTMLOrSVGElement,
		attribute: Attr | Attribute,
	): void;

/**
 * Set an attribute on an element
 *
 * _(Or remove it, if value is `null` or `undefined`)_
 * @param element Element for attribute
 * @param name Attribute name
 * @param value Attribute value
 */
export function setAttribute(
	element: HTMLOrSVGElement,
	name: string,
	value?: unknown,
): void;

export function setAttribute(
	element: HTMLOrSVGElement,
	first: unknown,
	second?: unknown,
): void {
	updateValue(element, first, second, updateAttribute);
}

/**
 * Set one or more attributes on an element
 *
 * _(Or remove them, if their value is `null` or `undefined`)_
 * @param element Element for attributes
 * @param attributes Attributes to set
 */
export function setAttributes(
		element: HTMLOrSVGElement,
		attributes: Array<Attr | Attribute>,
	): void;

/**
 * Set one or more attributes on an element
 *
 * _(Or remove them, if their value is `null` or `undefined`)_
 * @param element Element for attributes
 * @param attributes Attributes to set
 */
export function setAttributes(
	element: HTMLOrSVGElement,
	attributes: Record<string, unknown>,
): void;

export function setAttributes(
	element: HTMLOrSVGElement,
	attributes: Attribute[] | Record<string, unknown>,
): void {
	updateValues(element, attributes);
}

/**
 * Set a property on an element
 *
 * _(Or remove it, if value is not an empty string or does not match the name)_
 * @param element Element for property
 * @param property Property to set
 */
export function setProperty(
	element: HTMLOrSVGElement,
	property: Property,
): void;

/**
 * Set a property on an element
 *
 * _(Or remove it, if value is not an empty string or does not match the name)_
 * @param element Element for property
 * @param name Property name
 * @param value Property value
 */
export function setProperty(
	element: HTMLOrSVGElement,
	name: string,
	value: boolean | string,
): void;

export function setProperty(
	element: HTMLOrSVGElement,
	first: unknown,
	second?: unknown,
): void {
	updateValue(element, first, second, updateProperty);
}

/**
 * Set one or more properties on an element
 *
 * _(Or remove them, if their value is not an empty string or does not match the name)_
 * @param element Element for properties
 * @param properties Properties to set
 */
export function setProperties(
	element: HTMLOrSVGElement,
	properties: Property[],
): void;

/**
 * Set one or more properties on an element
 *
 * _(Or remove them, if their value is not an empty string or does not match the name)_
 * @param element Element for properties
 * @param properties Properties to set
 */
export function setProperties(
	element: HTMLOrSVGElement,
	properties: Record<string, unknown>,
): void;

export function setProperties(
	element: HTMLOrSVGElement,
	properties: Property[] | Record<string, unknown>,
): void {
	updateValues(element, properties, updateProperty);
}

function updateAttribute(
	element: HTMLOrSVGElement,
	name: string,
	value: unknown,
): void {
	if (booleanAttributes.includes(name.toLowerCase())) {
		updateProperty(element, name, value, false);
	} else if (value == null) {
		element.removeAttribute(name);
	} else {
		element.setAttribute(
			name,
			typeof value === 'string' ? value : getString(value),
		);
	}
}

function updateProperty(
	element: HTMLOrSVGElement,
	name: string,
	value: unknown,
	validate?: boolean,
): void {
	const actual = (validate ?? true) ? name.toLowerCase() : name;

	if (actual === 'hidden') {
		(element as HTMLElement).hidden = value === '' || value === true;
	} else {
		(element as unknown as PlainObject)[actual] =
			value === '' ||
			(typeof value === 'string' && value.toLowerCase() === actual) ||
			value === true;
	}
}

function updateValue(
	element: HTMLOrSVGElement,
	first: unknown,
	second: unknown,
	callback: (element: HTMLOrSVGElement, name: string, value: unknown) => void,
): void {
	if (!isHTMLOrSVGElement(element)) {
		return;
	}

	if (isProperty(first)) {
		callback(element, (first as Attribute).name, (first as Attribute).value);
	} else if (typeof first === 'string') {
		callback(element, first as string, second);
	}
}

function updateValues(
	element: HTMLOrSVGElement,
	values: Array<Attribute<unknown>> | Record<string, unknown>,
	callback?: (element: HTMLOrSVGElement, name: string, value: unknown) => void,
): void {
	if (!isHTMLOrSVGElement(element)) {
		return;
	}

	const isArray = Array.isArray(values);
	const entries = Object.entries(values);
	const {length} = entries;

	for (let index = 0; index < length; index += 1) {
		const entry = entries[index];

		if (isArray) {
			(callback ?? updateAttribute)(
				element,
				(entry[1] as Attribute).name,
				(entry[1] as Attribute).value,
			);
		} else {
			(callback ?? updateAttribute)(element, entry[0], entry[1]);
		}
	}
}

function validateAttribute(
	callback: (attribute: Attr | Attribute | undefined) => boolean,
	first: string | Attr | Attribute,
	second?: string,
): boolean {
	let attribute: Attribute | undefined;

	if (isAttribute(first)) {
		attribute = first;
	} else if (typeof first === 'string' && typeof second === 'string') {
		attribute = {name: first, value: second};
	}

	return callback(attribute);
}

//

/**
 * List of boolean attributes
 */
export const booleanAttributes = Object.freeze([
	'async',
	'autofocus',
	'autoplay',
	'checked',
	'controls',
	'default',
	'defer',
	'disabled',
	'formnovalidate',
	'hidden',
	'inert',
	'ismap',
	'itemscope',
	'loop',
	'multiple',
	'muted',
	'nomodule',
	'novalidate',
	'open',
	'playsinline',
	'readonly',
	'required',
	'reversed',
	'selected',
]);

const onPrefix = /^on/i;

const sourcePrefix = /^(href|src|xlink:href)$/i;

const valuePrefix = /(data:text\/html|javascript:)/i;
