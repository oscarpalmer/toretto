import {
	ARIA_EXPRESSION_BOOLEAN,
	ARIA_EXPRESSION_NUMERICAL,
	ARIA_EXPRESSION_PREFIX,
	ARIA_PREFIX,
	ariaBooleanAttributesSet,
	ariaNumericalAttributesSet,
} from '../models/aria.model';

// #region Functions

export function getAriaValue(element: Element, attribute: string): unknown {
	const name = getAriaName(attribute);

	const value = element.getAttribute(name) ?? undefined;

	if (
		ariaBooleanAttributesSet.has(name as never) &&
		typeof value === 'string' &&
		ARIA_EXPRESSION_BOOLEAN.test(value)
	) {
		return value.toLowerCase() === 'true';
	}

	if (
		ariaNumericalAttributesSet.has(name as never) &&
		typeof value === 'string' &&
		ARIA_EXPRESSION_NUMERICAL.test(value)
	) {
		return Number.parseFloat(value);
	}

	return value;
}

export function getAriaName(value: string): string {
	return ARIA_EXPRESSION_PREFIX.test(value) ? value : `${ARIA_PREFIX}${value}`;
}

// #endregion
