import type {PlainObject} from '@oscarpalmer/atoms';
import {isPlainObject} from '@oscarpalmer/atoms/is';
import {getString} from '@oscarpalmer/atoms/string';
import type {Attribute, HTMLOrSVGElement, Property} from '../models';
import {isHTMLOrSVGElement} from './is';

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

export function isBadAttribute(first: string | Attr | Attribute, second?: string): boolean {
	return isValidAttribute(
		attribute =>
			attribute == null ||
			EXPRESSION_ON_PREFIX.test(attribute.name) ||
			(EXPRESSION_SOURCE_PREFIX.test(attribute.name) &&
				EXPRESSION_VALUE_PREFIX.test(String(attribute.value))),
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
	return isValidAttribute(
		attribute => attribute != null && booleanAttributes.includes(attribute.name.toLowerCase()),
		value,
		'',
	);
}

/**
 * Is the attribute empty and not a boolean attribute?
 * @param attribute Attribute to check
 * @returns `true` if attribute is empty and not a boolean attribute
 */
export function isEmptyNonBooleanAttribute(attribute: Attr | Attribute): boolean;

/**
 * Is the attribute empty and not a boolean attribute?
 * @param name Attribute name
 * @param value Attribute value
 * @returns `true` if attribute is empty and not a boolean attribute
 */
export function isEmptyNonBooleanAttribute(name: string, value: string): boolean;

export function isEmptyNonBooleanAttribute(
	first: string | Attr | Attribute,
	second?: string,
): boolean {
	return isValidAttribute(
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
	return isValidAttribute(
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

export function isProperty(value: unknown): value is Property {
	return isPlainObject(value) && typeof (value as PlainObject).name === 'string';
}

function isValidAttribute(
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

function updateAttribute(element: HTMLOrSVGElement, name: string, value: unknown): void {
	const isBoolean = booleanAttributes.includes(name.toLowerCase());

	if (isBoolean) {
		updateProperty(element, name, value);
	}

	if (isBoolean ? value !== true : value == null) {
		element.removeAttribute(name);
	} else {
		element.setAttribute(name, isBoolean ? '' : getString(value));
	}
}

function updateProperty(element: HTMLOrSVGElement, name: string, value: unknown): void {
	const actual = name.toLowerCase();

	(element as unknown as PlainObject)[actual] =
		value === '' || (typeof value === 'string' && value.toLowerCase() === actual) || value === true;
}

export function updateValue(element: HTMLOrSVGElement, first: unknown, second: unknown): void {
	if (!isHTMLOrSVGElement(element)) {
		return;
	}

	if (isProperty(first)) {
		updateAttribute(element, (first as Attribute).name, (first as Attribute).value);
	} else if (typeof first === 'string') {
		updateAttribute(element, first as string, second);
	}
}

export function updateValues(
	element: HTMLOrSVGElement,
	values: Attribute<unknown>[] | Record<string, unknown>,
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
			updateAttribute(element, (entry[1] as Attribute).name, (entry[1] as Attribute).value);
		} else {
			updateAttribute(element, entry[0], entry[1]);
		}
	}
}

//

const EXPRESSION_ON_PREFIX = /^on/i;

const EXPRESSION_SOURCE_PREFIX = /^(href|src|xlink:href)$/i;

const EXPRESSION_VALUE_PREFIX = /(data:text\/html|javascript:)/i;

/**
 * List of boolean attributes
 */
export const booleanAttributes: readonly string[] = Object.freeze([
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
