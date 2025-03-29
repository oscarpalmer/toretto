import {setElementValues, updateElementValue} from './internal/element-value';
import {isHTMLOrSVGElement} from './is';
import type {HTMLOrSVGElement, TextDirection} from './models';

/**
 * Get a style from an element
 */
export function getStyle(
	element: HTMLOrSVGElement,
	property: keyof CSSStyleDeclaration,
): string {
	return isHTMLOrSVGElement(element)
		? element.style[property as never]
		: (undefined as never);
}

/**
 * Get styles from an element
 */
export function getStyles<Property extends keyof CSSStyleDeclaration>(
	element: HTMLOrSVGElement,
	properties: Property[],
): Pick<CSSStyleDeclaration, Property> {
	if (!isHTMLOrSVGElement(element) || !Array.isArray(properties)) {
		return {} as Pick<CSSStyleDeclaration, Property>;
	}

	const styles = {} as Pick<CSSStyleDeclaration, Property>;
	const {length} = properties;

	for (let index = 0; index < length; index += 1) {
		const property = properties[index];

		styles[property] = element.style[property as never] as never;
	}

	return styles;
}

/**
 * Get the text direction of an element
 */
export function getTextDirection(element: Element): TextDirection {
	if (!(element instanceof Element)) {
		return undefined as never;
	}

	const direction = element.getAttribute('dir');

	if (direction != null && /^(ltr|rtl)$/i.test(direction)) {
		return direction.toLowerCase() as TextDirection;
	}

	return (
		getComputedStyle?.(element)?.direction === 'rtl' ? 'rtl' : 'ltr'
	) as TextDirection;
}

/**
 * Set a style on an element
 */
export function setStyle(
	element: HTMLOrSVGElement,
	property: keyof CSSStyleDeclaration,
	value?: string,
): void {
	setElementValues(element, property as string, value, updateStyleProperty);
}

/**
 * Set styles on an element
 */
export function setStyles(
	element: HTMLOrSVGElement,
	styles: Partial<CSSStyleDeclaration>,
): void {
	setElementValues(element, styles as never, null, updateStyleProperty);
}

function updateStyleProperty(
	element: HTMLOrSVGElement,
	key: string,
	value: unknown,
): void {
	updateElementValue(
		element,
		key,
		value,
		function (this: HTMLOrSVGElement, property: string, value: string) {
			this.style[property as never] = value;
		},
		function (this: HTMLOrSVGElement, property: string) {
			this.style[property as never] = '';
		},
		false,
	);
}
