import {setElementValues, updateElementValue} from './internal/element-value';
import type {AnyAriaAttribute, AnyAriaBooleanAttribute, AriaRole} from './models';

// #region Types

type AriaAttributeItem<Name extends AnyAriaAttribute = AnyAriaAttribute> = {
	name: Name;
	value?: Name extends AnyAriaBooleanAttribute ? boolean | string : string;
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
): {
	[Key in Attribute as Key extends `aria-${infer Name}`
		? Name
		: Key]: Key extends AnyAriaBooleanAttribute ? boolean | string | undefined : string | undefined;
};

export function getAria(element: Element, value: string | string[]): unknown {
	if (!(element instanceof Element)) {
		return Array.isArray(value) ? {} : undefined;
	}

	if (!Array.isArray(value)) {
		return typeof value === 'string' ? getAriaValue(element, value) : undefined;
	}

	const arias = {} as Record<string, unknown>;

	const {length} = value;

	for (let index = 0; index < length; index += 1) {
		const attribute = value[index];

		if (typeof attribute === 'string') {
			arias[attribute.replace(ATTRIBUTE_ARIA_PREFIX, '')] = getAriaValue(element, attribute);
		}
	}

	return arias;
}

function getAriaValue(element: Element, attribute: string): unknown {
	const name = getName(attribute);

	const value = element.getAttribute(name) ?? undefined;

	if (
		ariaBooleanAttributesSet.has(name as never) &&
		typeof value === 'string' &&
		EXPRESSION_BOOLEAN.test(value)
	) {
		return value.toLowerCase() === 'true';
	}

	return value;
}

function getName(value: string): string {
	return EXPRESSION_ARIA_PREFIX.test(value) ? value : `${ATTRIBUTE_ARIA_PREFIX}${value}`;
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
export function setAria(
	element: Element,
	attributes: {
		[Key in AnyAriaAttribute]?: Key extends AnyAriaBooleanAttribute ? boolean | string : string;
	},
): void;

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
	const name = getName(key);

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
		false,
	);
}

// #endregion

// #region Variables

const ATTRIBUTE_ARIA_PREFIX = 'aria-';

const EXPRESSION_ARIA_PREFIX = /^aria-/i;

const EXPRESSION_BOOLEAN = /^(true|false)$/i;

/**
 * List of _ARIA_ attributes that can be treated as boolean values
 */
export const ariaBooleanAttributes: readonly AnyAriaBooleanAttribute[] = Object.freeze([
	'aria-atomic',
	'aria-busy',
	'aria-checked',
	'aria-current',
	'aria-disabled',
	'aria-expanded',
	'aria-haspopup',
	'aria-hidden',
	'aria-invalid',
	'aria-modal',
	'aria-multiline',
	'aria-multiselectable',
	'aria-pressed',
	'aria-readonly',
	'aria-required',
	'aria-selected',
]);

/**
 * Set of _ARIA_ attributes that can be treated as boolean values
 */
export const ariaBooleanAttributesSet = new Set(ariaBooleanAttributes);

// #endregion
