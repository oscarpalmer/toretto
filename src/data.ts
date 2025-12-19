import type {PlainObject} from '@oscarpalmer/atoms';
import {kebabCase, parse} from '@oscarpalmer/atoms/string';
import {setElementValues, updateElementValue} from './internal/element-value';
import {EXPRESSION_DATA_PREFIX} from './internal/get-value';
import {isHTMLOrSVGElement} from './internal/is';

/**
 * Get a keyed data value from an element
 * @param element Element to get data from
 * @param key Data key
 * @param parse Parse values? _(defaults to `true`)_
 * @returns Data value
 */
export function getData(element: Element, key: string, parse?: boolean): unknown;

/**
 * Get keyed data values from an element
 * @param element Element to get data from
 * @param keys Keys of the data values to get
 * @param parse Parse values? _(defaults to `true`)_
 * @returns Keyed data values
 */
export function getData<Key extends string>(
	element: Element,
	keys: Key[],
	parse?: boolean,
): Record<Key, unknown>;

export function getData(element: Element, keys: string | string[], parseValues?: boolean): unknown {
	if (!isHTMLOrSVGElement(element)) {
		return;
	}

	const shouldParse = parseValues !== false;

	if (typeof keys === 'string') {
		const value = element.dataset[keys];

		if (value === undefined) {
			return;
		}

		return shouldParse ? parse(value) : value;
	}

	const {length} = keys;

	const data: PlainObject = {};

	for (let index = 0; index < length; index += 1) {
		const key = keys[index];
		const value = element.dataset[key];

		if (value == null) {
			data[key] = undefined;
		} else {
			data[key] = shouldParse ? parse(value) : value;
		}
	}

	return data;
}

function getName(original: string): string {
	return `${ATTRIBUTE_DATA_PREFIX}${kebabCase(original).replace(EXPRESSION_DATA_PREFIX, '')}`;
}

/**
 * Set data values on an element
 * @param element Element to set data on
 * @param data Data to set
 */
export function setData(element: Element, data: PlainObject): void;

/**
 * Set a data value on an element
 * @param element Element to set data on
 * @param key Data key
 * @param value Data value
 */
export function setData(element: Element, key: string, value: unknown): void;

export function setData(element: Element, first: PlainObject | string, second?: unknown): void {
	setElementValues(element, first, second, updateDataAttribute);
}

function updateDataAttribute(element: Element, key: string, value: unknown): void {
	updateElementValue(
		element,
		getName(key),
		value,
		element.setAttribute,
		element.removeAttribute,
		true,
	);
}

//

const ATTRIBUTE_DATA_PREFIX = 'data-';
