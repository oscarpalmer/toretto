import {setElementValues, updateElementValue} from './internal/element-value';
import {getStyleValue} from './internal/get-value';
import {isHTMLOrSVGElement} from './internal/is';
import type {TextDirection} from './models';

// #region Types

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

type Styles = Partial<Record<keyof CSSStyleDeclaration, unknown>>;

// #endregion

// #region Functions

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
	if (isHTMLOrSVGElement(element) && typeof property === 'string') {
		return getStyleValue(element, property, computed === true);
	}
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
 * Get the text direction of a node or element _(or document, if element is invalid)_
 * @param node Node or element to get the text direction from
 * @returns Text direction
 */
export function getTextDirection(node: Element | Node): TextDirection;

/**
 * Get the text direction of the document
 * @returns Text direction
 */
export function getTextDirection(): TextDirection;

export function getTextDirection(node?: Element | Node): TextDirection {
	let target: HTMLElement | SVGElement;

	if (isHTMLOrSVGElement(node)) {
		target = node;
	} else {
		target =
			node instanceof Node
				? (node.ownerDocument?.documentElement ?? document.documentElement)
				: document.documentElement;
	}

	let {direction} = target.style;

	if (direction === '') {
		direction = getStyleValue(target, PROPETY_DIRECTION, true)!;
	}

	return direction === DIRECTION_RTL ? DIRECTION_RTL : DIRECTION_LTR;
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
	value?: unknown,
): void {
	setElementValues(element, property as string, value, null, updateStyleProperty);
}

/**
 * Set styles on an element
 * @param element Element to set the styles on
 * @param styles Styles to set
 */
export function setStyles(element: Element, styles: Styles): void {
	setElementValues(element, styles as never, null, null, updateStyleProperty);
}

/**
 * Toggle styles for an element
 * @param element Element to style
 * @param styles Styles to be set or removed
 * @returns Style toggler
 */
export function toggleStyles(element: Element, styles: Styles): StyleToggler {
	function toggle(set: boolean): void {
		hasSet = set;

		let next: Styles;

		if (set) {
			values = getStyles(element, keys);

			next = styles;
		} else {
			next = {...values};

			values = {};

			for (let index = 0; index < length; index += 1) {
				values[keys[index] as never] = undefined;
			}
		}

		setStyles(element, next);
	}

	const keys = Object.keys(styles) as (keyof CSSStyleDeclaration)[];
	const {length} = keys;

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
		function (this: Element, property: string, style: unknown) {
			(this as HTMLElement).style[property as never] = String(style);
		},
		function (this: Element, property: string) {
			(this as HTMLElement).style[property as never] = '';
		},
		false,
		false,
	);
}

// #endregion

// #region Variables

const DIRECTION_LTR = 'ltr';

const DIRECTION_RTL = 'rtl';

const PROPETY_DIRECTION = 'direction';

// #endregion
