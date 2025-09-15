import type {PlainObject} from '@oscarpalmer/atoms';
import {kebabCase, parse} from '@oscarpalmer/atoms/string';
import {setElementValues, updateElementValue} from './internal/element-value';
import {isHTMLOrSVGElement} from './is';
import type {HTMLOrSVGElement} from './models';

/**
 * Get a keyed data value from an element
 * @param element Element to get data from
 * @param key Data key
 * @param parse Parse values? _(defaults to `true`)_
 * @returns Data value
 */
export function getData(
	element: HTMLOrSVGElement,
	key: string,
	parse?: boolean,
): unknown;

/**
 * Get keyed data values from an element
 * @param element Element to get data from
 * @param keys Keys of the data values to get
 * @param parse Parse values? _(defaults to `true`)_
 * @returns Keyed data values
 */
export function getData<Key extends string>(
	element: HTMLOrSVGElement,
	keys: Key[],
	parse?: boolean,
): Record<Key, unknown>;

export function getData(
	element: HTMLOrSVGElement,
	keys: string | string[],
	parseValues?: boolean,
): unknown {
	if (!isHTMLOrSVGElement(element)) {
		return;
	}

	const shouldParse = parseValues !== false;

	if (typeof keys === 'string') {
		const value = element.dataset[keys];

		return value == null ? undefined : shouldParse ? parse(value) : value;
	}

	const {length} = keys;

	const data: PlainObject = {};

	for (let index = 0; index < length; index += 1) {
		const key = keys[index];
		const value = element.dataset[key];

		data[key] = value == null ? undefined : shouldParse ? parse(value) : value;
	}

	return data;
}

function getName(original: string): string {
	return `data-${kebabCase(original).replace(dataPrefix, '')}`;
}

/**
 * Set data values on an element
 * @param element Element to set data on
 * @param data Data to set
 */
export function setData(element: HTMLOrSVGElement, data: PlainObject): void;

/**
 * Set a data value on an element
 * @param element Element to set data on
 * @param key Data key
 * @param value Data value
 */
export function setData(
	element: HTMLOrSVGElement,
	key: string,
	value: unknown,
): void;

export function setData(
	element: HTMLOrSVGElement,
	first: PlainObject | string,
	second?: unknown,
): void {
	setElementValues(element, first, second, updateDataAttribute);
}

function updateDataAttribute(
	element: HTMLOrSVGElement,
	key: string,
	value: unknown,
): void {
	updateElementValue(
		element,
		getName(key),
		value,
		element.setAttribute,
		element.removeAttribute,
		true,
	);
}

const dataPrefix = /^data-/i;
