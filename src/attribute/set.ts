import {updateValue, updateValues} from '../internal/attribute';
import type {Attribute, HTMLOrSVGElement, Property} from '../models';

/**
 * Set an attribute on an element
 *
 * _(Or remove it, if value is `null` or `undefined`)_
 * @param element Element for attribute
 * @param name Attribute name
 * @param value Attribute value
 */
export function setAttribute(
	element: HTMLOrSVGElement,
	name: string,
	value?: unknown,
): void;

/**
 * Set an attribute on an element
 *
 * _(Or remove it, if value is `null` or `undefined`)_
 * @param element Element for attribute
 * @param attribute Attribute to set
 */
export function setAttribute(
	element: HTMLOrSVGElement,
	attribute: Attr | Attribute,
): void;

export function setAttribute(
	element: HTMLOrSVGElement,
	first: unknown,
	second?: unknown,
): void {
	updateValue(element, first, second);
}

/**
 * Set one or more attributes on an element
 *
 * _(Or remove them, if their value is `null` or `undefined`)_
 * @param element Element for attributes
 * @param attributes Attributes to set
 */
export function setAttributes(
	element: HTMLOrSVGElement,
	attributes: Array<Attr | Attribute>,
): void;

/**
 * Set one or more attributes on an element
 *
 * _(Or remove them, if their value is `null` or `undefined`)_
 * @param element Element for attributes
 * @param attributes Attributes to set
 */
export function setAttributes(
	element: HTMLOrSVGElement,
	attributes: Record<string, unknown>,
): void;

export function setAttributes(
	element: HTMLOrSVGElement,
	attributes: Attribute[] | Record<string, unknown>,
): void {
	updateValues(element, attributes);
}

/**
 * Set a property on an element
 *
 * _(Or remove it, if value is not an empty string or does not match the name)_
 * @param element Element for property
 * @param name Property name
 * @param value Property value
 */
export function setProperty(
	element: HTMLOrSVGElement,
	name: string,
	value: boolean | string,
): void;

/**
 * Set a property on an element
 *
 * _(Or remove it, if value is not an empty string or does not match the name)_
 * @param element Element for property
 * @param property Property to set
 */
export function setProperty(
	element: HTMLOrSVGElement,
	property: Property,
): void;

export function setProperty(
	element: HTMLOrSVGElement,
	first: unknown,
	second?: unknown,
): void {
	updateValue(element, first, second);
}

/**
 * Set one or more properties on an element
 *
 * _(Or remove them, if their value is not an empty string or does not match the name)_
 * @param element Element for properties
 * @param properties Properties to set
 */
export function setProperties(
	element: HTMLOrSVGElement,
	properties: Property[],
): void;

/**
 * Set one or more properties on an element
 *
 * _(Or remove them, if their value is not an empty string or does not match the name)_
 * @param element Element for properties
 * @param properties Properties to set
 */
export function setProperties(
	element: HTMLOrSVGElement,
	properties: Record<string, unknown>,
): void;

export function setProperties(
	element: HTMLOrSVGElement,
	properties: Property[] | Record<string, unknown>,
): void {
	updateValues(element, properties);
}
