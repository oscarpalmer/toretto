import {isNullableOrWhitespace} from '@oscarpalmer/atoms/is';
import {getString} from '@oscarpalmer/atoms/string';
import {kebabCase} from '@oscarpalmer/atoms/string/case';
import {isHTMLOrSVGElement} from '../is';
import {isAttribute} from './attribute';

// #region Functions

function ignoreSetAttribute(element: Element, name: string): boolean {
	if (element instanceof HTMLTextAreaElement && name === 'value') {
		return true;
	}

	return false;
}

function normalizeKey(key: string, style?: boolean): string {
	return style && key.startsWith(CSS_VARIABLE_PREFIX) ? key : kebabCase(key);
}

export function setElementValue(
	element: Element,
	first: unknown,
	second: unknown,
	third: unknown,
	callback: (element: Element, key: string, value: unknown, dispatch: boolean) => void,
	style?: boolean,
): void {
	if (!isHTMLOrSVGElement(element)) {
		return;
	}

	if (typeof first === 'string') {
		setElementValues(element, first, second, third, callback, style);
	} else if (isAttribute(first)) {
		setElementValues(element, first.name, first.value, third, callback, style);
	}
}

export function setElementValues(
	element: Element,
	first: unknown,
	second: unknown,
	third: unknown,
	callback: (element: Element, key: string, value: unknown, dispatch: boolean) => void,
	style?: boolean,
): void {
	if (!isHTMLOrSVGElement(element)) {
		return;
	}

	const dispatch = third !== false;

	if (typeof first === 'string') {
		callback(element, normalizeKey(first, style), second, dispatch);

		return;
	}

	const isArray = Array.isArray(first);

	if (!isArray && !(typeof first === 'object' && first !== null)) {
		return;
	}

	const entries = isArray ? first : Object.entries(first).map(([name, value]) => ({name, value}));
	const {length} = entries;

	for (let index = 0; index < length; index += 1) {
		const entry = entries[index];

		if (typeof entry === 'object' && typeof entry?.name === 'string') {
			callback(element, normalizeKey(entry.name, style), entry.value, dispatch);
		}
	}
}

export function updateElementValue(
	element: Element,
	key: string,
	value: unknown,
	set: (key: string, value: string) => void,
	remove: (key: string) => void,
	isBoolean: boolean,
	json: boolean,
): void {
	if (isBoolean ? value == null : isNullableOrWhitespace(value)) {
		remove.call(element, key);
	} else if (!ignoreSetAttribute(element, key)) {
		set.call(element, key, json ? JSON.stringify(value) : getString(value));
	}
}

// #endregion Functions

// #region Variables

const CSS_VARIABLE_PREFIX = '--';

// #endregion
