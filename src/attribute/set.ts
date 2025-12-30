import {updateAttribute} from '../internal/attribute';
import {setElementValue, setElementValues} from '../internal/element-value';
import type {Attribute} from '../models';

//

type DispatchedAttribute = 'checked' | 'open' | 'value';

//

/**
 * Set an attribute on an element
 *
 * _(Or remove it, if value is `null` or `undefined`)_
 * @param element Element for attribute
 * @param name Attribute name
 * @param value Attribute value
 * @param dispatch Dispatch event for attribute? _(defaults to `true`)_
 */
export function setAttribute<Name extends DispatchedAttribute>(
	element: Element,
	name: Name,
	value?: unknown,
	dispatch?: boolean,
): void;

/**
 * Set an attribute on an element
 *
 * _(Or remove it, if value is `null` or `undefined`)_
 * @param element Element for attribute
 * @param name Attribute name
 * @param value Attribute value
 */
export function setAttribute(element: Element, name: string, value?: unknown): void;

/**
 * Set an attribute on an element
 *
 * _(Or remove it, if value is `null` or `undefined`)_
 * @param element Element for attribute
 * @param attribute Attribute to set
 * @param dispatch Dispatch event for attribute? _(defaults to `true`)_
 */
export function setAttribute(
	element: Element,
	attribute: Attr | Attribute,
	dispatch?: boolean,
): void;

export function setAttribute(
	element: Element,
	first: unknown,
	second?: unknown,
	third?: unknown,
): void {
	setElementValue(element, first, second, third, updateAttribute);
}

/**
 * Set one or more attributes on an element
 *
 * _(Or remove them, if their value is `null` or `undefined`)_
 * @param element Element for attributes
 * @param attributes Attributes to set
 * @param dispatch Dispatch events for relevant attributes? _(defaults to `true`)_
 */
export function setAttributes(
	element: Element,
	attributes: Array<Attr | Attribute>,
	dispatch?: boolean,
): void;

/**
 * Set one or more attributes on an element
 *
 * _(Or remove them, if their value is `null` or `undefined`)_
 * @param element Element for attributes
 * @param attributes Attributes to set
 * @param dispatch Dispatch events for relevant attributes? _(defaults to `true`)_
 */
export function setAttributes(
	element: Element,
	attributes: Record<string, unknown>,
	dispatch?: boolean,
): void;

export function setAttributes(
	element: Element,
	attributes: Attribute[] | Record<string, unknown>,
	dispatch?: boolean,
): void {
	setElementValues(element, attributes, null, dispatch, updateAttribute);
}
