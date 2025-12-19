import {updateValue, updateValues} from '../internal/attribute';
import type {Attribute, Property} from '../models';

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
 */
export function setAttribute(element: Element, attribute: Attr | Attribute): void;

export function setAttribute(element: Element, first: unknown, second?: unknown): void {
	updateValue(element, first, second);
}

/**
 * Set one or more attributes on an element
 *
 * _(Or remove them, if their value is `null` or `undefined`)_
 * @param element Element for attributes
 * @param attributes Attributes to set
 */
export function setAttributes(element: Element, attributes: Array<Attr | Attribute>): void;

/**
 * Set one or more attributes on an element
 *
 * _(Or remove them, if their value is `null` or `undefined`)_
 * @param element Element for attributes
 * @param attributes Attributes to set
 */
export function setAttributes(element: Element, attributes: Record<string, unknown>): void;

export function setAttributes(
	element: Element,
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
export function setProperty(element: Element, name: string, value: boolean | string): void;

/**
 * Set a property on an element
 *
 * _(Or remove it, if value is not an empty string or does not match the name)_
 * @param element Element for property
 * @param property Property to set
 */
export function setProperty(element: Element, property: Property): void;

export function setProperty(element: Element, first: unknown, second?: unknown): void {
	updateValue(element, first, second);
}

/**
 * Set one or more properties on an element
 *
 * _(Or remove them, if their value is not an empty string or does not match the name)_
 * @param element Element for properties
 * @param properties Properties to set
 */
export function setProperties(element: Element, properties: Property[]): void;

/**
 * Set one or more properties on an element
 *
 * _(Or remove them, if their value is not an empty string or does not match the name)_
 * @param element Element for properties
 * @param properties Properties to set
 */
export function setProperties(element: Element, properties: Record<string, unknown>): void;

export function setProperties(
	element: Element,
	properties: Property[] | Record<string, unknown>,
): void {
	updateValues(element, properties);
}
