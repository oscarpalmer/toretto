import type {PlainObject} from '@oscarpalmer/atoms/models';
import {camelCase} from '@oscarpalmer/atoms/string/case';

// #region Functions

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

	if (!(property in element) || Object.is((element as unknown as PlainObject)[property], value)) {
		return;
	}

	(element as unknown as PlainObject)[property] = value;

	const event = dispatch && elementEvents[element.tagName]?.[property];

	if (typeof event === 'string') {
		element.dispatchEvent(new Event(event, {bubbles: true}));
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
