import {setElementValues, updateElementValue} from './internal/element-value';
import {getStyleValue} from './internal/get-value';
import {isHTMLOrSVGElement} from './is';
import type {HTMLOrSVGElement, TextDirection} from './models';

/**
 * Get a style from an element
 * @param element Element to get the style from
 * @param property Style name
 * @param computed Get the computed style? _(defaults to `false`)_
 * @returns Style value
 */
export function getStyle(
	element: HTMLOrSVGElement,
	property: keyof CSSStyleDeclaration,
	computed?: boolean,
): string | undefined {
	if (!isHTMLOrSVGElement(element) || typeof property !== 'string') {
		return undefined;
	}

	return getStyleValue(element, property, computed === true);
}

/**
 * Get styles from an element
 * @param element Element to get the styles from
 * @param properties Styles to get
 * @param computed Get the computed styles? _(defaults to `false`)_
 * @returns Style values
 */
export function getStyles<Property extends keyof CSSStyleDeclaration>(
	element: HTMLOrSVGElement,
	properties: Property[],
	computed?: boolean,
): Record<Property, string | undefined> {
	const styles = {} as Record<Property, string | undefined>;

	if (!isHTMLOrSVGElement(element) || !Array.isArray(properties)) {
		return styles;
	}

	const {length} = properties;

	for (let index = 0; index < length; index += 1) {
		const property = properties[index];

		if (typeof property === 'string') {
			styles[property] = getStyleValue(
				element,
				property,
				computed === true,
			) as never;
		}
	}

	return styles;
}

/**
 * Get the text direction of an element
 * @param element Element to get the text direction from
 * @param computed Get the computed text direction? _(defaults to `false`)_
 * @returns Text direction
 */
export function getTextDirection(
	element: HTMLOrSVGElement,
	computed?: boolean,
): TextDirection {
	if (!(element instanceof Element)) {
		return undefined as never;
	}

	const direction = element.getAttribute('dir');

	if (direction != null && /^(ltr|rtl)$/i.test(direction)) {
		return direction.toLowerCase() as TextDirection;
	}

	return getStyleValue(element, 'direction', computed === true) === 'rtl'
		? 'rtl'
		: 'ltr';
}

/**
 * Set a style on an element
 * @param element Element to set the style on
 * @param property Style name
 * @param value Style value
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
 * @param element Element to set the styles on
 * @param styles Styles to set
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
