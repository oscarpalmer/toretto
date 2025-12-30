import type {PlainObject} from '@oscarpalmer/atoms';
import {isPlainObject} from '@oscarpalmer/atoms/is';
import type {Attribute} from '../models';
import {updateElementValue} from './element-value';

function badAttributeHandler(name?: string, value?: string): boolean {
	if (typeof name !== 'string' || name.trim().length === 0 || typeof value !== 'string') {
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
	if (typeof name !== 'string' || name.trim().length === 0 || typeof value !== 'string') {
		return true;
	}

	const normalizedName = name.toLowerCase();

	if (!booleanAttributesSet.has(normalizedName)) {
		return false;
	}

	const normalized = value.toLowerCase();

	return !(normalized.length === 0 || normalized === normalizedName);
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

export function isAttribute(value: unknown): value is Attr | Attribute {
	return (
		value instanceof Attr ||
		(isPlainObject(value) &&
			typeof (value as PlainObject).name === 'string' &&
			'value' in (value as PlainObject))
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

function isValidSourceAttribute(name: string, value: string): boolean {
	return EXPRESSION_SOURCE_NAME.test(name) && EXPRESSION_SOURCE_VALUE.test(value);
}

export function updateAttribute(
	element: Element,
	name: string,
	value: unknown,
	dispatch?: unknown,
): void {
	const normalizedName = name.toLowerCase();

	const isBoolean = booleanAttributesSet.has(normalizedName);

	const next = isBoolean
		? value === true ||
			(typeof value === 'string' && (value === '' || value.toLowerCase() === normalizedName))
		: value == null
			? ''
			: value;

	if (name in element) {
		updateProperty(element, normalizedName, next, dispatch);
	}

	updateElementValue(
		element,
		name,
		isBoolean ? (next ? '' : null) : value,
		element.setAttribute,
		element.removeAttribute,
		isBoolean,
		false,
	);
}

function updateProperty(element: Element, name: string, value: unknown, dispatch?: unknown): void {
	if (Object.is((element as unknown as PlainObject)[name], value)) {
		return;
	}

	(element as unknown as PlainObject)[name] = value;

	const event = dispatch !== false && elementEvents[element.tagName]?.[name];

	if (typeof event === 'string') {
		element.dispatchEvent(new Event(event, {bubbles: true}));
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

//

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

const elementEvents: Record<string, Record<string, string>> = {
	DETAILS: {open: 'toggle'},
	INPUT: {checked: 'change', value: 'input'},
	SELECT: {value: 'change'},
	TEXTAREA: {value: 'input'},
};

const formElement = document.createElement('form');

let textArea: HTMLTextAreaElement;
