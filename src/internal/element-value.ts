import {isNullableOrWhitespace, isPlainObject} from '@oscarpalmer/atoms/is';
import type {PlainObject} from '@oscarpalmer/atoms/models';

export function setElementValues(
	element: HTMLElement,
	first: PlainObject | string,
	second: unknown,
	callback: (element: HTMLElement, key: string, value: unknown) => void,
): void {
	if (isPlainObject(first)) {
		const entries = Object.entries(first);
		const {length} = entries;

		for (let index = 0; index < length; index += 1) {
			const [key, value] = entries[index];

			callback(element, key, value);
		}
	} else if (first != null) {
		callback(element, first, second);
	}
}

export function updateElementValue(
	element: HTMLElement,
	key: string,
	value: unknown,
	set: (key: string, value: string) => void,
	remove: (key: string) => void,
	json: boolean,
): void {
	if (isNullableOrWhitespace(value)) {
		remove.call(element, key);
	} else {
		set.call(element, key, json ? JSON.stringify(value) : String(value));
	}
}
