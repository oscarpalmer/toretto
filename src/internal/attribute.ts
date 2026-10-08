import {isPlainObject} from '@oscarpalmer/atoms/is';
import type {PlainObject} from '@oscarpalmer/atoms/models';
import {getString} from '@oscarpalmer/atoms/string';
import {kebabCase} from '@oscarpalmer/atoms/string/case';
import type {Attribute} from '../models';
import {
	ATTRIBUTE_EXPRESSION_CLOBBERED_NAME,
	ATTRIBUTE_EXPRESSION_DATA_OR_SCRIPT,
	ATTRIBUTE_EXPRESSION_EVENT_NAME,
	ATTRIBUTE_EXPRESSION_SKIP_NAME,
	ATTRIBUTE_EXPRESSION_SOURCE_NAME,
	ATTRIBUTE_EXPRESSION_SOURCE_VALUE,
	ATTRIBUTE_EXPRESSION_URI_VALUE,
	ATTRIBUTE_EXPRESSION_WHITESPACE,
	booleanAttributesSet,
	dispatchedAttributes,
} from '../models/attribute.model';
import {updateElementValue} from './element-value';
import {updateProperty} from './property';

// #region Functions

function badAttributeHandler(name?: string, value?: string): boolean {
	if (typeof name !== 'string' || name.trim().length === 0 || typeof value !== 'string') {
		return true;
	}

	if (
		(ATTRIBUTE_EXPRESSION_CLOBBERED_NAME.test(name) &&
			(value in document || value in formElement)) ||
		ATTRIBUTE_EXPRESSION_EVENT_NAME.test(name)
	) {
		return true;
	}

	if (
		ATTRIBUTE_EXPRESSION_SKIP_NAME.test(name) ||
		ATTRIBUTE_EXPRESSION_URI_VALUE.test(value) ||
		isValidSourceAttribute(name, value)
	) {
		return false;
	}

	return ATTRIBUTE_EXPRESSION_DATA_OR_SCRIPT.test(value);
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
		value = getString(first.value);
	} else if (typeof first === 'string' && typeof second === 'string') {
		name = first;
		value = second;
	}

	if (name != null) {
		name = kebabCase(name);
	}

	if (decode && value != null) {
		value = decodeAttribute(value);
	}

	return callback(name, value?.replace(ATTRIBUTE_EXPRESSION_WHITESPACE, ''));
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

export function _isInvalidBooleanAttribute(
	first: unknown,
	second: unknown,
	decode: boolean,
): boolean {
	return handleAttribute(booleanAttributeHandler, decode, first, second);
}

function isValidSourceAttribute(name: string, value: string): boolean {
	return (
		ATTRIBUTE_EXPRESSION_SOURCE_NAME.test(name) && ATTRIBUTE_EXPRESSION_SOURCE_VALUE.test(value)
	);
}

export function updateAttribute(
	element: Element,
	name: string,
	value: unknown,
	dispatch: boolean,
): void {
	const lowerCaseName = name.toLowerCase();

	const isBoolean = booleanAttributesSet.has(lowerCaseName);

	const next = isBoolean
		? value === true ||
			(typeof value === 'string' && (value === '' || value.toLowerCase() === lowerCaseName))
		: value == null
			? ''
			: value;

	if (isBoolean || dispatchedAttributes.has(name)) {
		updateProperty(element, name, next, dispatch);
	}

	updateElementValue(
		element,
		name,
		isBoolean ? (next ? '' : null) : value,
		// Using `.call` in `updateElementValue`
		// oxlint-disable-next-line typescript/unbound-method
		element.setAttribute,
		// Using `.call` in `updateElementValue`
		// oxlint-disable-next-line typescript/unbound-method
		element.removeAttribute,
		false,
	);
}

// #endregion

// #region Variables

const formElement = document.createElement('form');

let textArea: HTMLTextAreaElement;

// #endregion
