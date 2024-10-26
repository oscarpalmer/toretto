import type {PlainObject} from '@oscarpalmer/atoms/models';
import {parse} from '@oscarpalmer/atoms/string';
import {setElementValues, updateElementValue} from './internal/element-value';
import type {HTMLOrSVGElement} from '~/models';

/**
 * Get data values from an element
 */
export function getData<Value extends PlainObject>(
	element: HTMLOrSVGElement,
	keys: string[],
): Value;

/**
 * Get a data value from an element
 */
export function getData(element: HTMLOrSVGElement, key: string): unknown;

export function getData(
	element: HTMLOrSVGElement,
	keys: string | string[],
): unknown {
	if (typeof keys === 'string') {
		return getDataValue(element, keys);
	}

	const {length} = keys;

	const data: PlainObject = {};

	for (let index = 0; index < length; index += 1) {
		const key = keys[index];

		data[key] = getDataValue(element, key);
	}

	return data;
}

function getDataValue(element: HTMLOrSVGElement, key: string): unknown {
	const value = element.dataset[key];

	if (value != null) {
		return parse(value);
	}
}

/**
 * Set data values on an element
 */
export function setData(element: HTMLOrSVGElement, data: PlainObject): void;

/**
 * Set a data value on an element
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
		`data-${key}`,
		value,
		element.setAttribute,
		element.removeAttribute,
		true,
	);
}
