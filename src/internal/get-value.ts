import {parse} from '@oscarpalmer/atoms/string';
import {camelCase, kebabCase} from '@oscarpalmer/atoms/string/case';
import {ARIA_EXPRESSION_PREFIX} from '../models/aria.model';
import {CSS_VARIABLE_PREFIX, DATA_EXPRESSION_PREFIX} from '../models/misc.model';
import {getAriaValue} from './aria';

// #region Functions

export function getBoolean(value: unknown, defaultValue?: boolean): boolean {
	return typeof value === 'boolean' ? value : (defaultValue ?? false);
}

export function getAttributeValue(element: Element, name: string, parseValue: boolean): unknown {
	const normalized = kebabCase(name);
	const attribute = element.attributes[normalized as keyof NamedNodeMap];
	const value = attribute instanceof Attr ? attribute.value : undefined;

	const isString = typeof value === 'string';

	if (isString && ARIA_EXPRESSION_PREFIX.test(normalized)) {
		return getAriaValue(element, normalized);
	}

	if (isString && DATA_EXPRESSION_PREFIX.test(normalized) && parseValue) {
		return parse(value) ?? value;
	}

	return value;
}

export function getStyleValue(
	element: Element,
	property: string,
	computed: boolean,
): string | undefined {
	if (property.startsWith(CSS_VARIABLE_PREFIX)) {
		return (element as HTMLElement).style.getPropertyValue(property);
	}

	const name = camelCase(property);

	return computed
		? getComputedStyle(element)[name as never]
		: (element as HTMLElement).style[name as never];
}

// #endregion
