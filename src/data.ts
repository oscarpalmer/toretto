import type {PlainObject} from '@oscarpalmer/atoms/models';
import {parse} from '@oscarpalmer/atoms/string';
import {camelCase, kebabCase} from '@oscarpalmer/atoms/string/case';
import {setElementValues, updateElementValue} from './internal/element-value';
import {EXPRESSION_DATA_PREFIX} from './internal/get-value';

// #region Functions

/**
 * Get a keyed data value from an element, without parsing the value
 *
 * @param element Element to get data from
 * @param key Data key
 * @param parse Parse the value?
 * @returns Data value
 */
export function getData(element: Element, key: string, parse: false): string | undefined;

/**
 * Get a keyed data value from an element and parse the value
 *
 * @param element Element to get data from
 * @param key Data key
 * @returns Data value
 */
export function getData(element: Element, key: string): unknown;

/**
 * Get keyed data values from an element, without parsing the values
 *
 * @param element Element to get data from
 * @param keys Keys of the data values to get
 * @param parse Parse the values?
 * @returns Keyed data values
 */
export function getData<Key extends string>(
	element: Element,
	keys: Key[],
	parse: false,
): Record<Key, string | undefined>;

/**
 * Get keyed data values from an element and parse the values
 *
 * @param element Element to get data from
 * @param keys Keys of the data values to get
 * @returns Keyed data values
 */
export function getData<Key extends string>(element: Element, keys: Key[]): Record<Key, unknown>;

export function getData(element: Element, keys: string | string[], parseValues?: boolean): unknown {
	if (!(element instanceof Element)) {
		return;
	}

	const noParse = parseValues === false;

	if (typeof keys === 'string') {
		return getDataValue(element, keys, noParse);
	}

	const {length} = keys;

	const data: PlainObject = {};

	for (let index = 0; index < length; index += 1) {
		const key = keys[index];

		data[key] = getDataValue(element, key, noParse);
	}

	return data;
}

function getDataValue(element: Element, key: string, noParse: boolean): unknown {
	const value = (element as HTMLElement).dataset[camelCase(key)];

	if (value == null) {
		return;
	}

	if (noParse) {
		return value;
	}

	return parse(value) ?? value;
}

function getName(original: string): string {
	return `${ATTRIBUTE_DATA_PREFIX}${kebabCase(original.replace(EXPRESSION_DATA_PREFIX, ''))}`;
}

/**
 * Set data values on an element
 *
 * @param element Element to set data on
 * @param data Data to set
 */
export function setData(element: Element, data: PlainObject): void;

/**
 * Set a data value on an element
 *
 * @param element Element to set data on
 * @param key Data key
 * @param value Data value
 */
export function setData(element: Element, key: string, value: unknown): void;

export function setData(element: Element, first: PlainObject | string, second?: unknown): void {
	setElementValues(element, first, second, null, updateDataAttribute);
}

function updateDataAttribute(element: Element, key: string, value: unknown): void {
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
		true,
	);
}

// #endregion

// #region Variables

const ATTRIBUTE_DATA_PREFIX = 'data-';

// #endregion
