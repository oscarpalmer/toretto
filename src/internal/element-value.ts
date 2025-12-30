import {isNullableOrWhitespace} from '@oscarpalmer/atoms/is';
import {isHTMLOrSVGElement} from '../is';
import {isAttribute} from './attribute';

export function setElementValue(
	element: Element,
	first: unknown,
	second: unknown,
	third: unknown,
	callback: (element: Element, key: string, value: unknown) => void,
): void {
	if (!isHTMLOrSVGElement(element)) {
		return;
	}

	if (typeof first === 'string') {
		setElementValues(element, first, second, third, callback);
	} else if (isAttribute(first)) {
		setElementValues(element, first.name, first.value, third, callback);
	}
}

export function setElementValues(
	element: Element,
	first: unknown,
	second: unknown,
	third: unknown,
	callback: (element: Element, key: string, value: unknown, dispatch?: unknown) => void,
): void {
	if (!isHTMLOrSVGElement(element)) {
		return;
	}

	if (typeof first === 'string') {
		callback(element, first, second, third);

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
			callback(element, entry.name, entry.value, third);
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
	} else {
		set.call(element, key, json ? JSON.stringify(value) : String(value));
	}
}
