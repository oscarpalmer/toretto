import type {PlainObject} from '@oscarpalmer/atoms';
import {getString} from '@oscarpalmer/atoms/string';
import {booleanAttributes} from '../internal/attribute';
import {isHTMLOrSVGElement} from '../internal/is';
import type {Attribute, HTMLOrSVGElement} from '../models';
import {isProperty} from './is';

export function updateAttribute(
	element: HTMLOrSVGElement,
	name: string,
	value: unknown,
): void {
	if (booleanAttributes.includes(name.toLowerCase())) {
		updateProperty(element, name, value, false);
	} else if (value == null) {
		element.removeAttribute(name);
	} else {
		element.setAttribute(
			name,
			typeof value === 'string' ? value : getString(value),
		);
	}
}

export function updateProperty(
	element: HTMLOrSVGElement,
	name: string,
	value: unknown,
	validate?: boolean,
): void {
	const actual = (validate ?? true) ? name.toLowerCase() : name;

	if (actual === 'hidden') {
		(element as HTMLElement).hidden = value === '' || value === true;
	} else {
		(element as unknown as PlainObject)[actual] =
			value === '' ||
			(typeof value === 'string' && value.toLowerCase() === actual) ||
			value === true;
	}
}

export function updateValue(
	element: HTMLOrSVGElement,
	first: unknown,
	second: unknown,
	callback: (element: HTMLOrSVGElement, name: string, value: unknown) => void,
): void {
	if (!isHTMLOrSVGElement(element)) {
		return;
	}

	if (isProperty(first)) {
		callback(element, (first as Attribute).name, (first as Attribute).value);
	} else if (typeof first === 'string') {
		callback(element, first as string, second);
	}
}

export function updateValues(
	element: HTMLOrSVGElement,
	values: Attribute<unknown>[] | Record<string, unknown>,
	callback?: (element: HTMLOrSVGElement, name: string, value: unknown) => void,
): void {
	if (!isHTMLOrSVGElement(element)) {
		return;
	}

	const isArray = Array.isArray(values);
	const entries = Object.entries(values);
	const {length} = entries;

	for (let index = 0; index < length; index += 1) {
		const entry = entries[index];

		if (isArray) {
			(callback ?? updateAttribute)(
				element,
				(entry[1] as Attribute).name,
				(entry[1] as Attribute).value,
			);
		} else {
			(callback ?? updateAttribute)(element, entry[0], entry[1]);
		}
	}
}
