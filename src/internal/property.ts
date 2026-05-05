import type {PlainObject} from '@oscarpalmer/atoms/models';
import {getString} from '@oscarpalmer/atoms/string';
import {camelCase} from '@oscarpalmer/atoms/string/case';
import {isInputElement} from './is';

// #region Functions

function getPropertyValue(element: Element, name: string, value: unknown): unknown {
	if (isInputElement(element) && name === 'value') {
		return getString(value);
	}

	return value;
}

export function updateProperty(
	element: Element,
	name: string,
	value: unknown,
	dispatch: boolean,
): void {
	let property = name;

	if (!(property in element)) {
		property = camelCase(name);
	}

	const next = getPropertyValue(element, name, value);

	if (!(property in element) || Object.is((element as unknown as PlainObject)[property], next)) {
		return;
	}

	(element as unknown as PlainObject)[property] = next;

	const event = dispatch && elementEvents[element.tagName]?.[property];

	if (typeof event === 'string') {
		element.dispatchEvent(new Event(event, {bubbles: true, cancelable: true}));
	}
}

// #endregion

// #region Variables

const elementEvents: Record<string, Record<string, string>> = {
	DETAILS: {open: 'toggle'},
	INPUT: {checked: 'change', value: 'input'},
	SELECT: {value: 'change'},
	TEXTAREA: {value: 'input'},
};

// #endregion
