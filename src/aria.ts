import {setElementValues, updateElementValue} from './internal/element-value';
import type {AriaAttribute, AriaAttributeUnprefixed, AriaRole} from './models';

// #region Types

type AnyAriaAttribute = AriaAttribute | AriaAttributeUnprefixed;

type AriaAttributeItem = {
	name: AnyAriaAttribute;
	value?: string;
};

// #endregion

// #region Functions

/**
 * Get the value of a specific _ARIA_ attribute from an element
 *
 * @param element Element to get _ARIA_ attribute from
 * @param name _ARIA_ name
 * @returns _ARIA_ value _(or `undefined`)_
 */
export function getAria(element: Element, attribute: AnyAriaAttribute): string | undefined;

/**
 * Get specific _ARIA_ attributes from an element
 *
 * @param element Element to get _ARIA_ attributes from
 * @param names _ARIA_ attribute names
 * @returns Object of named _ARIA_ attributes
 */
export function getAria<Attribute extends AnyAriaAttribute>(
	element: Element,
	attributes: Attribute[],
): Record<Attribute, string | undefined>;

export function getAria(element: Element, value: string | string[]): unknown {
	if (!(element instanceof Element)) {
		return Array.isArray(value) ? {} : undefined;
	}

	if (!Array.isArray(value)) {
		return typeof value === 'string' ? getAriaValue(element, value) : undefined;
	}

	const arias = {} as Record<string, string | undefined>;

	const {length} = value;

	for (let index = 0; index < length; index += 1) {
		const attribute = value[index];

		if (typeof attribute === 'string') {
			arias[attribute.replace(ATTRIBUTE_ARIA_PREFIX, '')] = getAriaValue(element, attribute);
		}
	}

	return arias;
}

function getAriaValue(element: Element, attribute: string): string | undefined {
	return element.getAttribute(getName(attribute)) ?? undefined;
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
export function getRole(element: Element): unknown {
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
export function setAria(element: Element, attribute: AnyAriaAttribute, value?: unknown): void;

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
	attributes: Partial<Record<AnyAriaAttribute, unknown>>,
): void;

export function setAria(
	element: Element,
	first: AnyAriaAttribute | AriaAttributeItem[] | Partial<Record<AnyAriaAttribute, unknown>>,
	second?: unknown,
): void {
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
	updateElementValue(
		element,
		getName(key),
		value,
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

// #endregion
