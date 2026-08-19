import type {AriaBooleanAttribute, AriaNumericalAttribute} from '../models';

// #region Functions

export function getAriaValue(element: Element, attribute: string): unknown {
	const name = getAriaName(attribute);

	const value = element.getAttribute(name) ?? undefined;

	if (
		ariaBooleanAttributesSet.has(name as never) &&
		typeof value === 'string' &&
		EXPRESSION_BOOLEAN.test(value)
	) {
		return value.toLowerCase() === 'true';
	}

	if (
		ariaNumericalAttributesSet.has(name as never) &&
		typeof value === 'string' &&
		EXPRESSION_NUMERICAL.test(value)
	) {
		return Number.parseFloat(value);
	}

	return value;
}

export function getAriaName(value: string): string {
	return EXPRESSION_ARIA_PREFIX.test(value) ? value : `${ATTRIBUTE_ARIA_PREFIX}${value}`;
}

// #endregion

// #region Variables

export const ATTRIBUTE_ARIA_PREFIX = 'aria-';

export const EXPRESSION_ARIA_PREFIX = /^aria-/i;

export const EXPRESSION_BOOLEAN = /^(true|false)$/i;

export const EXPRESSION_NUMERICAL = /^-?\d+(\.\d+)?$/;

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
export const ariaBooleanAttributesSet = new Set(ariaBooleanAttributes);

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
export const ariaNumericalAttributesSet = new Set(ariaNumericalAttributes);

// #endregion
