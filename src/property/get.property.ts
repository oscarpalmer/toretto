import {camelCase} from '@oscarpalmer/atoms/string/case';
import type {PropertyGetProperties} from '../models/property.model';

// #region Functions

/**
 * Get the values of one or more properties on an element
 *
 * @param target Target element
 * @param properties Properties to get
 * @returns Property values
 */
export function getProperties<
	Target extends Element,
	Property extends keyof PropertyGetProperties<Target>,
>(target: Target, properties: Property[]): Pick<PropertyGetProperties<Target>, Property> {
	const values: Partial<PropertyGetProperties<Target>> = {};

	if (!(target instanceof Element && Array.isArray(properties))) {
		return values as Pick<PropertyGetProperties<Target>, Property>;
	}

	const {length} = properties;

	for (let index = 0; index < length; index += 1) {
		const property = properties[index];

		if (typeof property === 'string') {
			values[property] = getPropertyValue(
				target,
				property,
			) as PropertyGetProperties<Target>[Property];
		}
	}

	return values as Pick<PropertyGetProperties<Target>, Property>;
}

/**
 * Get the value of a property on an element
 *
 * @param target Target element
 * @param property Property to get
 * @returns Property value
 */
export function getProperty<
	Target extends Element,
	Property extends keyof PropertyGetProperties<Target>,
>(target: Target, property: Property): PropertyGetProperties<Target>[Property] {
	return target instanceof Element && typeof property === 'string'
		? (getPropertyValue(target, property) as PropertyGetProperties<Target>[Property])
		: undefined;
}

function getPropertyValue(element: Element, property: string): unknown {
	let actual = property;

	if (!(actual in element)) {
		actual = camelCase(actual);
	}

	if (actual in element) {
		return element[actual as keyof Element];
	}

	return undefined;
}

// #endregion
