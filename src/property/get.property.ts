import type {Primitive} from '@oscarpalmer/atoms/models';
import {camelCase} from '@oscarpalmer/atoms/string/case';
import {isHTMLOrSVGElement} from '../internal/is';

// #region Types

type GetProperties<Target extends Element> = {
	[Property in keyof Target as Target[Property] extends Primitive
		? Property
		: never]?: Target[Property];
};

// #endregion

// #region Functions

/**
 * Get the values of one or more properties on an element
 * @param target Target element
 * @param properties Properties to get
 * @returns Property values
 */
export function getProperties<Target extends Element, Property extends keyof GetProperties<Target>>(
	target: Target,
	properties: Property[],
): Pick<GetProperties<Target>, Property> {
	const values: Partial<GetProperties<Target>> = {};

	if (!isHTMLOrSVGElement(target) || !Array.isArray(properties)) {
		return values as Pick<GetProperties<Target>, Property>;
	}

	const {length} = properties;

	for (let index = 0; index < length; index += 1) {
		const property = properties[index];

		if (typeof property === 'string') {
			values[property] = getPropertyValue(target, property) as GetProperties<Target>[Property];
		}
	}

	return values as Pick<GetProperties<Target>, Property>;
}

/**
 * Get the value of a property on an element
 * @param target Target element
 * @param property Property to get
 * @returns Property value
 */
export function getProperty<Target extends Element, Property extends keyof GetProperties<Target>>(
	target: Target,
	property: Property,
): GetProperties<Target>[Property] {
	if (isHTMLOrSVGElement(target) && typeof property === 'string') {
		return getPropertyValue(target, property) as GetProperties<Target>[Property];
	}
}

function getPropertyValue(element: HTMLElement, property: string): unknown {
	let actual = property;

	if (!(actual in element)) {
		actual = camelCase(actual);
	}

	if (actual in element) {
		return element[actual as keyof HTMLElement];
	}
}

// #endregion
