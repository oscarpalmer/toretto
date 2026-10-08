// #region Types

export type InternalStyleToggler = {
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

export type StyleTogglerState = {
	active: boolean;
	element: Element;
	keys: string[];
	styles: Record<string, unknown>;
	values: Record<string, unknown>;
};

// #endregion

// #region Variables

export const STYLE_ATTRIBUTE = 'style';

export const STYLE_DIRECTION_LTR = 'ltr';

export const STYLE_DIRECTION_RTL = 'rtl';

export const STYLE_PROPERTY_DIRECTION = 'direction';

export const STYLE_SYMBOL: unique symbol = Symbol(STYLE_ATTRIBUTE);

// #endregion
