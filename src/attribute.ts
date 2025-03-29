import {isPlainObject} from '@oscarpalmer/atoms/is';
import type {PlainObject} from '@oscarpalmer/atoms/models';
import {getString} from '@oscarpalmer/atoms/string';
import {isHTMLOrSVGElement} from './is';
import type {Attribute, HTMLOrSVGElement, Property} from './models';

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

function isAttribute(value: unknown): value is Attribute<string> {
	return (
		value instanceof Attr ||
		(isPlainObject(value) &&
			typeof (value as PlainObject).name === 'string' &&
			typeof (value as PlainObject).value === 'string')
	);
}

/**
 * Is the attribute considered bad and potentially harmful?
 */
export function isBadAttribute(attribute: Attribute<string>): boolean {
	return (
		!isAttribute(attribute) ||
		onPrefix.test(attribute.name) ||
		(sourcePrefix.test(attribute.name) && valuePrefix.test(attribute.value))
	);
}

/**
 * Is the attribute a boolean attribute?
 */
export function isBooleanAttribute(name: string): boolean {
	return (
		typeof name === 'string' && booleanAttributes.includes(name.toLowerCase())
	);
}

/**
 * Is the attribute empty and not a boolean attribute?
 */
export function isEmptyNonBooleanAttribute(
	attribute: Attribute<string>,
): boolean {
	return (
		isAttribute(attribute) &&
		!booleanAttributes.includes(attribute.name) &&
		attribute.value.trim().length === 0
	);
}

/**
 * - Is the attribute an invalid boolean attribute?
 * - I.e., its value is not empty or the same as its name?
 */
export function isInvalidBooleanAttribute(
	attribute: Attribute<string>,
): boolean {
	if (!isAttribute(attribute)) {
		return true;
	}

	if (!booleanAttributes.includes(attribute.name)) {
		return false;
	}

	const normalised = attribute.value.toLowerCase().trim();

	return !(normalised.length === 0 || normalised === attribute.name);
}

function isProperty(value: unknown): value is Property {
	return (
		isPlainObject(value) && typeof (value as PlainObject).name === 'string'
	);
}

/**
 * Set an attribute on an element  _(or remove it, if the value is `null` or `undefined`)_
 */
export function setAttribute(
	element: HTMLOrSVGElement,
	attribute: Attribute,
): void;

/**
 * Set an attribute on an element  _(or remove it, if the value is `null` or `undefined`)_
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
 * Set one or more attributes on an element _(or remove them, if their value is `null` or `undefined`)_
 */
export function setAttributes(
	element: HTMLOrSVGElement,
	attributes: Attribute[],
): void;

/**
 * Set one or more attributes on an element _(or remove them, if their value is `null` or `undefined`)_
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
 * Set a property on an element _(or remove it, if the value is not an empty string or does not match the name)_
 */
export function setProperty(
	element: HTMLOrSVGElement,
	property: Property,
): void;

/**
 * Set a property on an element _(or remove it, if the value is not an empty string or does not match the name)_
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
 * Set one or more properties on an element _(or remove them, if their value is not an empty string or does not match the name)_
 */
export function setProperties(
	element: HTMLOrSVGElement,
	properties: Property[],
): void;

/**
 * Set one or more properties on an element _(or remove them, if their value is not an empty string or does not match the name)_
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
	const normalised = name.toLowerCase();

	if (booleanAttributes.includes(normalised)) {
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
	values: Attribute[] | Record<string, unknown>,
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
