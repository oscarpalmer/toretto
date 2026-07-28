import {getString} from '@oscarpalmer/atoms/string';
import {setElementValues, updateElementValue} from './internal/element-value';
import {getStyleValue} from './internal/get-value';
import type {CSSValues, TextDirection} from './models';

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

// #endregion

// #region Functions

/**
 * Get a style from an element
 *
 * @param element Element to get the style from
 * @param name Style name
 * @param computed Get the computed style? _(defaults to `false`)_
 * @returns Style value
 */
export function getStyle(
	element: Element,
	name: keyof CSSValues,
	computed?: boolean,
): string | undefined {
	if (element instanceof Element && typeof name === 'string') {
		return getStyleValue(element, name, computed === true);
	}
}

/**
 * Get styles from an element
 *
 * @param element Element to get the styles from
 * @param names Styles to get
 * @param computed Get the computed styles? _(defaults to `false`)_
 * @returns Style values
 */
export function getStyles<Name extends keyof CSSValues>(
	element: Element,
	names: Name[],
	computed?: boolean,
): Record<Name, string | undefined> {
	const styles = {} as Record<Name, string | undefined>;

	if (!(element instanceof Element && Array.isArray(names))) {
		return styles;
	}

	const {length} = names;

	for (let index = 0; index < length; index += 1) {
		const name = names[index];

		if (typeof name === 'string') {
			styles[name] = getStyleValue(element, name, computed === true) as never;
		}
	}

	return styles;
}

/**
 * Get the text direction of a node or element _(or document, if element is invalid)_
 *
 * @param node Node or element to get the text direction from
 * @returns Text direction
 */
export function getTextDirection(node: Element | Node): TextDirection;

/**
 * Get the text direction of the document
 *
 * @returns Text direction
 */
export function getTextDirection(): TextDirection;

export function getTextDirection(node?: Element | Node): TextDirection {
	let target: HTMLElement;

	if (node instanceof Element) {
		target = node as HTMLElement;
	} else {
		target =
			node instanceof Node
				? (node.ownerDocument?.documentElement ?? document.documentElement)
				: document.documentElement;
	}

	let {direction} = target.style;

	if (direction === '') {
		direction = getStyleValue(target, PROPERTY_DIRECTION, true)!;
	}

	return direction === DIRECTION_RTL ? DIRECTION_RTL : DIRECTION_LTR;
}

/**
 * Set a style on an element
 *
 * @param element Element to set the style on
 * @param name Style name
 * @param value Style value
 */
export function setStyle(element: Element, name: keyof CSSValues, value?: unknown): void {
	setElementValues(element, name as string, value, null, updateStyleProperty, true);
}

/**
 * Set styles on an element
 *
 * @param element Element to set the styles on
 * @param styles Styles to set
 */
export function setStyles(element: Element, styles: Partial<CSSValues>): void {
	setElementValues(element, styles as never, null, null, updateStyleProperty, true);
}

/**
 * Toggle styles for an element
 *
 * @param element Element to style
 * @param styles Styles to be set or removed
 * @returns Style toggler
 */
export function toggleStyles(element: Element, styles: Partial<CSSValues>): StyleToggler {
	function toggle(set: boolean): void {
		hasSet = set;

		let next: Partial<CSSValues>;

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
	let values: Record<string, unknown> = {};

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
		function (this: Element, name: string, style: unknown) {
			if (name.startsWith(VARIABLE_PREFIX)) {
				(this as HTMLElement).style.setProperty(name, getString(style));
			} else {
				(this as HTMLElement).style[name as never] = getString(style);
			}
		},
		function (this: Element, name: string) {
			if (name.startsWith(VARIABLE_PREFIX)) {
				(this as HTMLElement).style.removeProperty(name);
			} else {
				(this as HTMLElement).style[name as never] = '';
			}

			if ((this as HTMLElement).getAttribute(ATTRIBUTE_STYLE) === '') {
				(this as HTMLElement).removeAttribute(ATTRIBUTE_STYLE);
			}
		},
		false,
		false,
	);
}

// #endregion

// #region Variables

const ATTRIBUTE_STYLE = 'style';

const DIRECTION_LTR = 'ltr';

const DIRECTION_RTL = 'rtl';

const PROPERTY_DIRECTION = 'direction';

const VARIABLE_PREFIX = '--';

// #endregion
