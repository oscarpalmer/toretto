import {getAttributeValue} from '../internal/get-value';
import {isHTMLOrSVGElement} from '../internal/is';

/**
 * Get the value of a specific attribute from an element
 * @param element Element to get attribute from
 * @param name Attribute name
 * @param parse Parse value? _(defaults to `true`)_
 * @returns Attribute value _(or `undefined`)_
 */
export function getAttribute(
	element: HTMLOrSVGElement,
	name: `data-${string}`,
	parse?: boolean,
): unknown;

/**
 * Get the value of a specific attribute from an element
 * @param element Element to get attribute from
 * @param name Attribute name
 * @returns Attribute value _(or `undefined`)_
 */
export function getAttribute(element: HTMLOrSVGElement, name: string): unknown;

export function getAttribute(
	element: HTMLOrSVGElement,
	name: string,
	parseValues?: boolean,
): unknown {
	if (isHTMLOrSVGElement(element) && typeof name === 'string') {
		return getAttributeValue(element, name, parseValues !== false);
	}
}

/**
 * Get specific attributes from an element
 * @param element Element to get attributes from
 * @param names Attribute names
 * @param parseData Parse data values? _(defaults to `true`)_
 * @returns Object of named attributes
 */
export function getAttributes<Key extends string>(
	element: HTMLOrSVGElement,
	names: Key[],
	parseData?: boolean,
): Record<Key, unknown> {
	const attributes: Record<string, unknown> = {};

	if (!(isHTMLOrSVGElement(element) && Array.isArray(names))) {
		return attributes;
	}

	const shouldParse = parseData !== false;

	const {length} = names;

	for (let index = 0; index < length; index += 1) {
		const name = names[index];

		if (typeof name === 'string') {
			attributes[name] = getAttributeValue(element, name, shouldParse);
		}
	}

	return attributes;
}
