import {camelCase, kebabCase, parse} from '@oscarpalmer/atoms/string';
import type {HTMLOrSVGElement} from '../models';

export function getBoolean(value: unknown, defaultValue?: boolean): boolean {
	return typeof value === 'boolean' ? value : (defaultValue ?? false);
}

export function getAttributeValue(
	element: HTMLOrSVGElement,
	name: string,
	parseValue: boolean,
): unknown {
	const normalized = kebabCase(name);
	const attribute = element.attributes[normalized as keyof NamedNodeMap];
	const value = attribute instanceof Attr ? attribute.value : undefined;

	return EXPRESSION_DATA_PREFIX.test(normalized) && typeof value === 'string' && parseValue
		? (parse(value) ?? value)
		: value;
}

export function getStyleValue(
	element: HTMLOrSVGElement,
	property: string,
	computed: boolean,
): string | undefined {
	const name = camelCase(property);

	return computed ? getComputedStyle(element)[name as never] : element.style[name as never];
}

export const EXPRESSION_DATA_PREFIX = /^data-/i;
