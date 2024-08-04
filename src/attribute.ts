import {getString} from '@oscarpalmer/atoms/string';

type Attribute<Value = unknown> = {
	name: string;
	value: Value;
};

/**
 * Set an attribute on an element  _(or remove it, if the value is `null` or `undefined`)_
 */
export function setAttribute(
	element: Element,
	name: string,
	value: unknown,
): void {
	setAttributeValue(element, name, value);
}

function setAttributeValue(
	element: Element,
	name: string,
	value: unknown,
): void {
	if (value == null) {
		element.removeAttribute(name);
	} else {
		element.setAttribute(
			name,
			typeof value === 'string' ? value : getString(value),
		);
	}
}

/**
 * Set one or more attributes on an element  _(or remove them, if their value is `null` or `undefined`)_
 */
export function setAttributes(element: Element, attributes: Attribute[]): void;

/**
 * Set one or more attributes on an element  _(or remove them, if their value is `null` or `undefined`)_
 */
export function setAttributes(
	element: Element,
	attributes: Record<string, unknown>,
): void;

export function setAttributes(
	element: Element,
	attributes: Attribute[] | Record<string, unknown>,
): void {
	const isArray = Array.isArray(attributes);
	const entries = Object.entries(attributes);
	const {length} = entries;

	for (let index = 0; index < length; index += 1) {
		const entry = entries[index];

		if (isArray) {
			setAttributeValue(
				element,
				(entry[1] as Attribute).name,
				(entry[1] as Attribute).value,
			);
		} else {
			setAttributeValue(element, entry[0], entry[1]);
		}
	}
}
