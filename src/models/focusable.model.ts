// #region Types

export type FocusableElementWithTabIndex = {
	element: Element;
	tabIndex: number;
};

export type FocusableFilter = (item: FocusableElementWithTabIndex) => boolean;

export type FocusableInertElement = Element & {inert: boolean};

// #endregion

// #region Variables

export const FOCUSABLE_ATTRIBUTE_CONTENTEDITABLE = 'contenteditable';

export const FOCUSABLE_ATTRIBUTE_INERT = 'inert';

export const FOCUSABLE_ATTRIBUTE_TABINDEX = 'tabindex';

export const FOCUSABLE_EXPRESSION_DISABLEABLE: RegExp = /^(button|input|select|textarea)$/i;

export const FOCUSABLE_EXPRESSION_SPECIAL_TABINDEX: RegExp = /^(audio|details|video)$/i;

export const FOCUSABLE_EXPRESSION_SUMMARY: RegExp = /^summary$/i;

export const FOCUSABLE_EXPRESSION_TRUEISH: RegExp = /^(|true)$/i;

export const FOCUSABLE_SELECTOR_DETAILS_CLOSED_CHILDREN = 'details:not([open]) *';

export const FOCUSABLE_SELECTOR_FIELDSET_DISABLED = 'fieldset[disabled] *';

export const FOCUSABLE_SELECTOR_SUMMARY_FIRST = 'details > summary:first-of-type';

export const FOCUSABLE_SELECTOR_RADIO_PREFIX = 'input[type="radio"][name="';

export const FOCUSABLE_SELECTOR_RADIO_SUFFIX = '"]';

export const FOCUSABLE_SELECTOR_FULL: string = [
	'[contenteditable]:not([contenteditable="false"])',
	'[tabindex]:not(slot)',
	'a[href]',
	'audio[controls]',
	'button',
	'details',
	FOCUSABLE_SELECTOR_SUMMARY_FIRST,
	'input',
	'select',
	'textarea',
	'video[controls]',
]
	.map(selector => `${selector}:not([inert])`)
	.join(',');

export const FOCUSABLE_STYLE_HIDDEN = 'hidden';

export const FOCUSABLE_STYLE_NONE = 'none';

export const FOCUSABLE_TABINDEX_BASE = 0;

export const FOCUSABLE_TABINDEX_DEFAULT = -1;

export const FOCUSABLE_TYPE_RADIO = 'radio';

// #endregion
