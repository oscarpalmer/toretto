import type {
	AnyAriaAttribute,
	AnyAriaBooleanAttribute,
	AnyAriaNumericalAttribute,
	AriaBooleanAttribute,
	AriaNumericalAttribute,
} from './index';

// #region Types

export type AriaAttributeItem<Name extends AnyAriaAttribute = AnyAriaAttribute> = {
	name: Name;
	value?: Name extends AnyAriaBooleanAttribute ? boolean | string : string;
};

export type AriaAttributeValues<Attribute extends AnyAriaAttribute> = {
	[
		Key in Attribute as Key extends `aria-${infer Name}` ? Name : Key
	]: Key extends AnyAriaBooleanAttribute
		? boolean | string | undefined
		: Key extends AnyAriaNumericalAttribute
			? number | string | undefined
			: string | undefined;
};

// #endregion

// #region Variables

export const ARIA_PREFIX = 'aria-';

export const ARIA_EXPRESSION_BOOLEAN: RegExp = /^(true|false)$/i;

export const ARIA_EXPRESSION_NUMERICAL: RegExp = /^-?\d+(\.\d+)?$/;

export const ARIA_EXPRESSION_PREFIX: RegExp = /^aria-/i;

/**
 * List of _ARIA_ attributes that can be treated as boolean values
 */
export const ariaBooleanAttributes: readonly AriaBooleanAttribute[] = Object.freeze([
	'aria-atomic',
	'aria-busy',
	'aria-checked',
	'aria-current',
	'aria-disabled',
	'aria-expanded',
	'aria-haspopup',
	'aria-hidden',
	'aria-invalid',
	'aria-modal',
	'aria-multiline',
	'aria-multiselectable',
	'aria-pressed',
	'aria-readonly',
	'aria-required',
	'aria-selected',
]);

/**
 * Set of _ARIA_ attributes that can be treated as boolean values
 */
export const ariaBooleanAttributesSet: Set<AriaBooleanAttribute> = new Set(ariaBooleanAttributes);

/**
 * List of _ARIA_ attributes that can be treated as numerical values
 */
export const ariaNumericalAttributes: readonly AriaNumericalAttribute[] = Object.freeze([
	'aria-colcount',
	'aria-colindex',
	'aria-colspan',
	'aria-level',
	'aria-posinset',
	'aria-rowcount',
	'aria-rowindex',
	'aria-rowspan',
	'aria-setsize',
	'aria-valuemax',
	'aria-valuemin',
	'aria-valuenow',
]);

/**
 * Set of _ARIA_ attributes that can be treated as numerical values
 */
export const ariaNumericalAttributesSet: Set<AriaNumericalAttribute> = new Set(
	ariaNumericalAttributes,
);

// #endregion
