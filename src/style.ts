import {setElementValues, updateElementValue} from './internal/element-value';
import {getStyleValue} from './internal/get-value';
import {isHTMLOrSVGElement} from './internal/is';
import type {TextDirection} from './models';

export type StyleToggler = {
	/**
	 * Set the provided styles on the element
	 */
	set(): void;
	/**
	 * Remove the provided styles from the element _(and sets any previous styles)_
	 */
	remove(): void;
};

/**
 * Get a style from an element
 * @param element Element to get the style from
 * @param property Style name
 * @param computed Get the computed style? _(defaults to `false`)_
 * @returns Style value
 */
export function getStyle(
	element: Element,
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
	element: Element,
	properties: Property[],
	computed?: boolean,
): Record<Property, string | undefined> {
	const styles = {} as Record<Property, string | undefined>;

	if (!(isHTMLOrSVGElement(element) && Array.isArray(properties))) {
		return styles;
	}

	const {length} = properties;

	for (let index = 0; index < length; index += 1) {
		const property = properties[index];

		if (typeof property === 'string') {
			styles[property] = getStyleValue(element, property, computed === true) as never;
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
export function getTextDirection(element: Element, computed?: boolean): TextDirection {
	if (!(element instanceof Element)) {
		return undefined as never;
	}

	const direction = element.getAttribute(ATTRIBUTE_DIRECTION);

	if (direction != null && EXPRESSION_DIRECTION.test(direction)) {
		return direction.toLowerCase() as TextDirection;
	}

	const value = getStyleValue(element, 'direction', computed === true);

	return value === 'rtl' ? value : 'ltr';
}

/**
 * Set a style on an element
 * @param element Element to set the style on
 * @param property Style name
 * @param value Style value
 */
export function setStyle(
	element: Element,
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
export function setStyles(element: Element, styles: Partial<CSSStyleDeclaration>): void {
	setElementValues(element, styles as never, null, updateStyleProperty);
}

/**
 * Toggle styles for an element
 * @param element Element to style
 * @param styles Styles to be set or removed
 * @returns Style toggler
 */
export function toggleStyles(element: Element, styles: Partial<CSSStyleDeclaration>): StyleToggler {
	function toggle(set: boolean): void {
		hasSet = set;

		let next: Partial<CSSStyleDeclaration>;

		if (set) {
			values = getStyles(element, keys);

			next = styles;
		} else {
			next = {...values};

			values = {};

			for (const key of keys) {
				values[key as never] = undefined;
			}
		}

		setStyles(element, next);
	}

	const keys = Object.keys(styles) as (keyof CSSStyleDeclaration)[];

	let hasSet = false;
	let values: Record<string, string | undefined> = {};

	return {
		set(): void {
			if (!hasSet) {
				toggle(true);
			}
		},
		remove(): void {
			if (hasSet) {
				toggle(false);
			}
		},
	};
}

function updateStyleProperty(element: Element, key: string, value: unknown): void {
	updateElementValue(
		element,
		key,
		value,
		function (this: Element, property: string, style: string) {
			(this as HTMLElement).style[property as never] = style;
		},
		function (this: Element, property: string) {
			(this as HTMLElement).style[property as never] = '';
		},
		false,
	);
}

//

const ATTRIBUTE_DIRECTION = 'dir';

const EXPRESSION_DIRECTION = /^(ltr|rtl)$/i;
