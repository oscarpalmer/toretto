import type {PlainObject} from '@oscarpalmer/atoms';
import {isPlainObject} from '@oscarpalmer/atoms/is';
import {getString} from '@oscarpalmer/atoms/string';
import type {Attribute, Property} from '../models';
import {isHTMLOrSVGElement} from './is';

function badAttributeHandler(name?: string, value?: string): boolean {
	if (name == null || value == null) {
		return true;
	}

	if (
		(EXPRESSION_CLOBBERED_NAME.test(name) && (value in document || value in formElement)) ||
		EXPRESSION_EVENT_NAME.test(name)
	) {
		return true;
	}

	if (
		EXPRESSION_SKIP_NAME.test(name) ||
		EXPRESSION_URI_VALUE.test(value) ||
		isValidSourceAttribute(name, value)
	) {
		return false;
	}

	return EXPRESSION_DATA_OR_SCRIPT.test(value);
}

function booleanAttributeHandler(name?: string, value?: string): boolean {
	if (name == null || value == null) {
		return true;
	}

	if (!booleanAttributesSet.has(name)) {
		return false;
	}

	const normalized = value.toLowerCase().trim();

	return !(normalized.length === 0 || normalized === name);
}

function decodeAttribute(value: string): string {
	textArea ??= document.createElement('textarea');

	textArea.innerHTML = value;

	return decodeURIComponent(textArea.value);
}

function handleAttribute(
	callback: (name?: string, value?: string) => boolean,
	decode: boolean,
	first: unknown,
	second?: unknown,
): boolean {
	let name: string | undefined;
	let value: string | undefined;

	if (isAttribute(first)) {
		name = first.name;
		value = String(first.value);
	} else if (typeof first === 'string' && typeof second === 'string') {
		name = first;
		value = second;
	}

	if (decode && value != null) {
		value = decodeAttribute(value);
	}

	return callback(name, value?.replace(EXPRESSION_WHITESPACE, ''));
}

function isAttribute(value: unknown): value is Attr | Attribute {
	return (
		value instanceof Attr ||
		(isPlainObject(value) &&
			typeof (value as PlainObject).name === 'string' &&
			typeof (value as PlainObject).value === 'string')
	);
}

export function _isBadAttribute(first: unknown, second: unknown, decode: boolean): boolean {
	return handleAttribute(badAttributeHandler, decode, first, second);
}

export function _isBooleanAttribute(first: unknown, decode: boolean): boolean {
	return handleAttribute(
		name => booleanAttributesSet.has(name?.toLowerCase() as string),
		decode,
		first,
		'',
	);
}

export function _isEmptyNonBooleanAttribute(
	first: unknown,
	second: unknown,
	decode: boolean,
): boolean {
	return handleAttribute(
		(name, value) =>
			name != null && value != null && !booleanAttributesSet.has(name) && value.trim().length === 0,
		decode,
		first,
		second,
	);
}

export function _isInvalidBooleanAttribute(
	first: unknown,
	second: unknown,
	decode: boolean,
): boolean {
	return handleAttribute(booleanAttributeHandler, decode, first, second);
}

export function isProperty(value: unknown): value is Property {
	return isPlainObject(value) && typeof (value as PlainObject).name === 'string';
}

function isValidSourceAttribute(name: string, value: string): boolean {
	return EXPRESSION_SOURCE_NAME.test(name) && EXPRESSION_SOURCE_VALUE.test(value);
}

function updateAttribute(element: Element, name: string, value: unknown): void {
	const isBoolean = booleanAttributesSet.has(name.toLowerCase());

	if (isBoolean) {
		updateProperty(element, name, value);
	}

	if (isBoolean ? value !== true : value == null) {
		element.removeAttribute(name);
	} else {
		element.setAttribute(name, isBoolean ? '' : getString(value));
	}
}

function updateProperty(element: Element, name: string, value: unknown): void {
	const actual = name.toLowerCase();

	(element as unknown as PlainObject)[actual] =
		value === '' || (typeof value === 'string' && value.toLowerCase() === actual) || value === true;
}

export function updateValue(element: Element, first: unknown, second: unknown): void {
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
	element: Element,
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

const EXPRESSION_CLOBBERED_NAME = /^(id|name)$/i;

const EXPRESSION_DATA_OR_SCRIPT = /^(?:data|\w+script):/i;

const EXPRESSION_EVENT_NAME = /^on/i;

const EXPRESSION_SKIP_NAME = /^(aria-[-\w]+|data-[-\w.\u00B7-\uFFFF]+)$/i;

const EXPRESSION_SOURCE_NAME = /^src$/i;

const EXPRESSION_SOURCE_VALUE = /^data:/i;

const EXPRESSION_URI_VALUE =
	/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i;

// oxlint-disable-next-line no-control-regex
const EXPRESSION_WHITESPACE = /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g;

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

const booleanAttributesSet = new Set(booleanAttributes);

const formElement = document.createElement('form');

let textArea: HTMLTextAreaElement;
