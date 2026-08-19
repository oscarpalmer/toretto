import {
	ariaBooleanAttributes,
	ariaBooleanAttributesSet,
	ATTRIBUTE_ARIA_PREFIX,
	EXPRESSION_ARIA_PREFIX,
	EXPRESSION_BOOLEAN,
	getAriaName,
	getAriaValue,
} from './internal/aria';
import {setElementValues, updateElementValue} from './internal/element-value';
import type {
	AnyAriaAttribute,
	AnyAriaBooleanAttribute,
	AnyAriaNumericalAttribute,
	AriaAttributes,
	AriaRole,
} from './models';

// #region Types

type AriaAttributeItem<Name extends AnyAriaAttribute = AnyAriaAttribute> = {
	name: Name;
	value?: Name extends AnyAriaBooleanAttribute ? boolean | string : string;
};

type AriaAttributeValues<Attribute extends AnyAriaAttribute> = {
	[Key in Attribute as Key extends `aria-${infer Name}`
		? Name
		: Key]: Key extends AnyAriaBooleanAttribute
		? boolean | string | undefined
		: Key extends AnyAriaNumericalAttribute
			? number | string | undefined
			: string | undefined;
};

// #endregion

// #region Functions

/**
 * Get the value of a specific _ARIA_ attribute from an element
 *
 * @param element Element to get _ARIA_ attribute from
 * @param name _ARIA_ attribute name
 * @returns _ARIA_ value _(or `undefined`)_
 */
export function getAria(
	element: Element,
	name: AnyAriaBooleanAttribute,
): boolean | string | undefined;

/**
 * Get the value of a specific _ARIA_ attribute from an element
 *
 * @param element Element to get _ARIA_ attribute from
 * @param name _ARIA_ attribute name
 * @returns _ARIA_ value _(or `undefined`)_
 */
export function getAria(element: Element, name: AnyAriaAttribute): string | undefined;

/**
 * Get specific _ARIA_ attributes from an element
 *
 * @param element Element to get _ARIA_ attributes from
 * @param names _ARIA_ attribute names
 * @returns Object of named _ARIA_ attributes
 */
export function getAria<Attribute extends AnyAriaAttribute>(
	element: Element,
	names: Attribute[],
): AriaAttributeValues<Attribute>;

/**
 * Get all _ARIA_ attributes from an element
 *
 * @param element Element to get _ARIA_ attributes from
 * @returns Object of all _ARIA_ attributes
 */
export function getAria(element: Element): Partial<AriaAttributes>;

export function getAria(element: Element, value?: string | string[]): unknown {
	if (!(element instanceof Element)) {
		return Array.isArray(value) ? {} : undefined;
	}

	if (typeof value === 'string') {
		return getAriaValue(element, value);
	}

	let attributes: string[] | undefined;

	if (Array.isArray(value)) {
		attributes = value;
	} else if (value == null) {
		attributes = [...element.attributes]
			.filter(attribute => EXPRESSION_ARIA_PREFIX.test(attribute.name))
			.map(attribute => attribute.name);
	}

	if (attributes == null) {
		return;
	}

	const arias: Record<string, unknown> = {};

	const {length} = attributes;

	for (let index = 0; index < length; index += 1) {
		const attribute = attributes[index];

		if (typeof attribute === 'string') {
			arias[attribute.replace(ATTRIBUTE_ARIA_PREFIX, '')] = getAriaValue(element, attribute);
		}
	}

	return arias;
}

/**
 * Get the role of an element
 *
 * @param element Element to get role from
 * @returns Element role _(or `undefined`)_
 */
export function getRole(element: Element): string | undefined {
	if (element instanceof Element) {
		return element.getAttribute('role') ?? undefined;
	}
}

/**
 * Set an _ARIA_ attribute on an element
 *
 * _(Or remove it, if value is `null` or `undefined`)_
 *
 * @param element Element for _ARIA_ attribute
 * @param attribute _ARIA_ attribute to set
 * @param value _ARIA_ attribute value
 */
export function setAria(
	element: Element,
	attribute: AnyAriaBooleanAttribute,
	value?: boolean | string,
): void;

/**
 * Set an _ARIA_ attribute on an element
 *
 * _(Or remove it, if value is `null` or `undefined`)_
 *
 * @param element Element for _ARIA_ attribute
 * @param attribute _ARIA_ attribute to set
 * @param value _ARIA_ attribute value
 */
export function setAria(element: Element, attribute: AnyAriaAttribute, value?: string): void;

/**
 * Set one or more _ARIA_ attributes on an element
 *
 * _(Or remove them, if their value is `null` or `undefined`)_
 *
 * @param element Element for _ARIA_ attributes
 * @param attributes _ARIA_ attributes to set
 */
export function setAria(element: Element, attributes: AriaAttributeItem[]): void;

/**
 * Set one or more _ARIA_ attributes on an element
 *
 * _(Or remove them, if their value is `null` or `undefined`)_
 *
 * @param element Element for _ARIA_ attributes
 * @param attributes _ARIA_ attributes to set
 */
export function setAria(element: Element, attributes: Record<string, unknown>): void;

export function setAria(element: Element, first: unknown, second?: unknown): void {
	setElementValues(element, first, second, null, updateAriaAttribute);
}

/**
 * Set the role of an element
 *
 * @param element Element for role
 * @param role Role to set _(or `undefined` to remove it)_
 */
export function setRole(element: Element, role?: AriaRole): void {
	if (!(element instanceof Element)) {
		return;
	}

	if (typeof role === 'string') {
		element.setAttribute('role', role);
	} else {
		element.removeAttribute('role');
	}
}

function updateAriaAttribute(element: Element, key: string, value: unknown): void {
	const name = getAriaName(key);

	let actual = value;

	if (
		ariaBooleanAttributesSet.has(name as never) &&
		typeof value === 'string' &&
		EXPRESSION_BOOLEAN.test(value)
	) {
		actual = value.toLowerCase() === 'true';
	}

	updateElementValue(
		element,
		name,
		actual,
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

// #region Exports

export {ariaBooleanAttributes, ariaBooleanAttributesSet};

// #endregion
