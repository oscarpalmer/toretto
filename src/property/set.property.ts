import {isPlainObject} from '@oscarpalmer/atoms/is';
import type {PlainObject} from '@oscarpalmer/atoms/models';
import {setAttribute} from '../attribute';
import {updateProperty} from '../internal/property';
import {
	booleanAttributesSet,
	dispatchedAttributes,
	type DispatchedAttributeName,
} from '../models/attribute.model';
import type {
	PropertyDispatchedPropertyValue,
	PropertySetProperties,
} from '../models/property.model';

// #region Functions

/**
 * Set the values of one or more properties on an element
 *
 * Also updates attributes for boolean/dispatchable properties, and if `dispatch` is `true`, will dispatch events for dispatchable properties
 *
 * @param target Target element
 * @param properties Properties to set
 * @param dispatch Dispatch events for properties? _(defaults to `true`)_
 */
export function setProperties<Target extends Element>(
	target: Target,
	properties: PropertySetProperties<Target>,
	dispatch?: boolean,
): void {
	if (!(target instanceof Element) || !isPlainObject(properties)) {
		return;
	}

	const shouldDispatch = dispatch !== false;

	const keys = Object.keys(properties);
	const {length} = keys;

	for (let index = 0; index < length; index += 1) {
		setPropertyValue(target, keys[index], (properties as PlainObject)[keys[index]], shouldDispatch);
	}
}

/**
 * Set the value for a dispatchable property on an element
 *
 * @param target Target element
 * @param property Property to set
 * @param value Value to set
 * @param dispatch Dispatch event for property? _(defaults to `true`)_
 */
export function setProperty<Target extends Element, Property extends DispatchedAttributeName>(
	target: Target,
	property: Property,
	value: PropertyDispatchedPropertyValue<Target, Property>,
	dispatch?: boolean,
): void;

/**
 * Set the value for a property on an element
 *
 * @param target Target element
 * @param property Property to set
 * @param value Value to set
 */
export function setProperty<
	Target extends Element,
	Property extends keyof PropertySetProperties<Target>,
>(target: Target, property: Property, value: PropertySetProperties<Target>[Property]): void;

export function setProperty<
	Target extends Element,
	Property extends keyof PropertySetProperties<Target>,
>(
	target: Target,
	property: Property,
	value: PropertySetProperties<Target>[Property],
	dispatch?: boolean,
): void {
	if (target instanceof Element && typeof property === 'string') {
		setPropertyValue(target, property, value, dispatch !== false);
	}
}

function setPropertyValue(
	element: Element,
	property: string,
	value: unknown,
	dispatch: boolean,
): void {
	if (booleanAttributesSet.has(property.toLowerCase()) || dispatchedAttributes.has(property)) {
		setAttribute(element, property as never, value, dispatch);
	} else {
		updateProperty(element, property, value, dispatch);
	}
}

// #endregion
