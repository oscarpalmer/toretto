import {isPlainObject} from '@oscarpalmer/atoms/is';
import type {PlainObject, Primitive} from '@oscarpalmer/atoms/models';
import {setAttribute} from '../attribute';
import type {DispatchedAttributeName} from '../attribute/set.attribute';
import {booleanAttributesSet, dispatchedAttributes} from '../internal/attribute';
import {updateProperty} from '../internal/property';

// #region Types

type DispatchedPropertyValue<
	Target extends Element,
	Property extends DispatchedAttributeName,
> = Property extends keyof SetProperties<Target> ? SetProperties<Target>[Property] : never;

type SetProperties<Target extends Element> = {
	[Property in keyof Target as Target[Property] extends Primitive
		? Property
		: never]?: Target[Property];
};

// #endregion

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
	properties: SetProperties<Target>,
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
	value: DispatchedPropertyValue<Target, Property>,
	dispatch?: boolean,
): void;

/**
 * Set the value for a property on an element
 *
 * @param target Target element
 * @param property Property to set
 * @param value Value to set
 */
export function setProperty<Target extends Element, Property extends keyof SetProperties<Target>>(
	target: Target,
	property: Property,
	value: SetProperties<Target>[Property],
): void;

export function setProperty<Target extends Element, Property extends keyof SetProperties<Target>>(
	target: Target,
	property: Property,
	value: SetProperties<Target>[Property],
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
