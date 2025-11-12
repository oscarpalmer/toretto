import type {PlainObject} from '@oscarpalmer/atoms';
import {isPlainObject} from '@oscarpalmer/atoms/is';
import type {Attribute} from '../models';

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
