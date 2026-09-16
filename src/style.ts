import {getString} from '@oscarpalmer/atoms/string';
import {setElementValues, updateElementValue} from './internal/element-value';
import {getStyleValue} from './internal/get-value';
import type {CSSValues, TextDirection} from './models';

// #region Types

type InternalStyleToggler = {
	[STYLE_SYMBOL]: StyleTogglerState;
} & StyleToggler;

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

type StyleTogglerState = {
	active: boolean;
	element: Element;
	keys: string[];
	styles: Record<string, unknown>;
	values: Record<string, unknown>;
};

// #endregion

// #region Instances

function StyleToggler(this: any, element: Element, styles: Partial<CSSValues>) {
	Object.defineProperty(this, STYLE_SYMBOL, {
		value: {
			element,
			styles,
			active: false,
			keys: Object.keys(styles),
			values: {},
		},
	});
}

Object.defineProperties(StyleToggler.prototype, {
	remove: {
		value: removeStyleTogglerValues,
	},
	set: {
		value: setStyleTogglerValues,
	},
});

// #endregion

// #region Functions

/**
 * Get a style from an element
 *
 * @param element Element to get style from
 * @param name Style name
 * @param computed Get computed style? _(defaults to `false`)_
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
 * @param element Element to get styles from
 * @param names Styles to get
 * @param computed Get computed styles? _(defaults to `false`)_
 * @returns Style values
 */
export function getStyles<Name extends keyof CSSValues>(
	element: Element,
	names: Name[],
	computed?: boolean,
): Record<Name, string | undefined>;

/**
 * Get all styles from an element
 *
 * @param element Element to get styles from
 * @param computed Get computed styles? _(defaults to `false`)_
 * @returns Style values
 */
export function getStyles(element: Element, computed?: boolean): CSSStyleDeclaration;

/**
 * Get styles from an element
 *
 * @param element Element to get styles from
 * @param names Styles to get
 * @param computed Get computed styles? _(defaults to `false`)_
 * @returns Style values
 */
export function getStyles(element: Element, first?: boolean | string[], second?: boolean): unknown {
	if (!(element instanceof Element)) {
		return {};
	}

	if (first == null || typeof first === 'boolean') {
		return first === true ? getComputedStyle(element) : (element as HTMLElement).style;
	}

	const {length} = first;

	const styles = {} as Record<string, string | undefined>;

	for (let index = 0; index < length; index += 1) {
		const name = first[index];

		if (typeof name === 'string') {
			styles[name] = getStyleValue(element, name, second === true) as never;
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
		direction = getStyleValue(target, STYLE_PROPERTY_DIRECTION, true)!;
	}

	return direction === STYLE_DIRECTION_RTL ? STYLE_DIRECTION_RTL : STYLE_DIRECTION_LTR;
}

function removeStyleTogglerValues(this: InternalStyleToggler): void {
	toggleStyleValues(this, false);
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

function setStyleTogglerValues(this: InternalStyleToggler): void {
	toggleStyleValues(this, true);
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

function toggleStyleValues(instance: InternalStyleToggler, active: boolean): void {
	const state = instance[STYLE_SYMBOL];

	if (state.active === active) {
		return;
	}

	state.active = active;

	let next: Partial<CSSValues>;

	if (active) {
		state.values = getStyles(state.element, state.keys as (keyof CSSValues)[]);

		next = state.styles;
	} else {
		next = {...state.values};

		state.values = {};

		for (let index = 0; index < state.keys.length; index += 1) {
			state.values[state.keys[index]] = undefined;
		}
	}

	setStyles(state.element, next);
}

/**
 * Toggle styles for an element
 *
 * @param element Element to style
 * @param styles Styles to be set or removed
 * @returns Style toggler
 */
export function toggleStyles(element: Element, styles: Partial<CSSValues>): StyleToggler {
	// @ts-expect-error All good, no worries :-)
	return new StyleToggler(element, styles);
}

function updateStyleProperty(element: Element, key: string, value: unknown): void {
	updateElementValue(
		element,
		key,
		value,
		function (this: Element, name: string, style: unknown) {
			if (name.startsWith(STYLE_VARIABLE_PREFIX)) {
				(this as HTMLElement).style.setProperty(name, getString(style));
			} else {
				(this as HTMLElement).style[name as never] = getString(style);
			}
		},
		function (this: Element, name: string) {
			if (name.startsWith(STYLE_VARIABLE_PREFIX)) {
				(this as HTMLElement).style.removeProperty(name);
			} else {
				(this as HTMLElement).style[name as never] = '';
			}

			if ((this as HTMLElement).getAttribute(STYLE_ATTRIBUTE) === '') {
				(this as HTMLElement).removeAttribute(STYLE_ATTRIBUTE);
			}
		},
		false,
	);
}

// #endregion

// #region Variables

const STYLE_ATTRIBUTE = 'style';

const STYLE_DIRECTION_LTR = 'ltr';

const STYLE_DIRECTION_RTL = 'rtl';

const STYLE_PROPERTY_DIRECTION = 'direction';

const STYLE_SYMBOL = Symbol(STYLE_ATTRIBUTE);

const STYLE_VARIABLE_PREFIX = '--';

// #endregion
