import {getString} from '@oscarpalmer/atoms/string';

type Attribute<Value = unknown> = {
	name: string;
	value: Value;
};

/**
 * List of boolean attributes
 */
export const booleanAttributes = Object.freeze([
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

const onPrefix = /^on/i;
const sourcePrefix = /^(href|src|xlink:href)$/i;
const valuePrefix = /(data:text\/html|javascript:)/i;

/**
 * Is the attribute considered bad and potentially harmful?
 */
export function isBadAttribute(attribute: Attribute<string>): boolean {
	return (
		onPrefix.test(attribute.name) ||
		(sourcePrefix.test(attribute.name) && valuePrefix.test(attribute.value))
	);
}

/**
 * Is the attribute a boolean attribute?
 */
export function isBooleanAttribute(name: string): boolean {
	return booleanAttributes.includes(name.toLowerCase());
}

/**
 * Is the attribute empty and not a boolean attribute?
 */
export function isEmptyNonBooleanAttribute(
	attribute: Attribute<string>,
): boolean {
	return (
		!booleanAttributes.includes(attribute.name) &&
		attribute.value.trim().length === 0
	);
}

/**
 * - Is the attribute an invalid boolean attribute?
 * - I.e., its value is not empty or the same as its name?
 */
export function isInvalidBooleanAttribute(
	attribute: Attribute<string>,
): boolean {
	if (!booleanAttributes.includes(attribute.name)) {
		return true;
	}

	const normalised = attribute.value.toLowerCase().trim();

	return !(
		normalised.length === 0 ||
		normalised === attribute.name ||
		(attribute.name === 'hidden' && normalised === 'until-found')
	);
}

/**
 * Set an attribute on an element  _(or remove it, if the value is `null` or `undefined`)_
 */
export function setAttribute(element: Element, attribute: Attribute): void;

/**
 * Set an attribute on an element  _(or remove it, if the value is `null` or `undefined`)_
 */
export function setAttribute(
	element: Element,
	name: string,
	value?: unknown,
): void;

export function setAttribute(
	element: Element,
	first: unknown,
	second?: unknown,
): void {
	if (
		typeof first === 'object' &&
		typeof (first as Attribute)?.name === 'string'
	) {
		setAttributeValue(
			element,
			(first as Attribute).name,
			(first as Attribute).value,
		);
	} else if (typeof first === 'string') {
		setAttributeValue(element, first, second);
	}
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
