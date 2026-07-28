/**
 * Any _ARIA_ attribute for an element _(both prefixed and unprefixed)_
 */
export type AnyAriaAttribute = AriaAttribute | AriaAttributeUnprefixed;

/**
 * Any _ARIA_ attribute for an element that can be set to a boolean value _(both prefixed and unprefixed)_
 */
export type AnyAriaBooleanAttribute = AriaBooleanAttribute | AriaBooleanAttributeUnprefixed;

/**
 * _ARIA_ attribute for an element
 *
 * _(https://www.w3.org/TR/wai-aria-1.3/#aria-attributes)_
 */
export type AriaAttribute = keyof AriaAttributes;

/**
 * _ARIA_ attribute for an element without the `aria-` prefix
 *
 * _(https://www.w3.org/TR/wai-aria-1.3/#aria-attributes)_
 */
export type AriaAttributeUnprefixed = keyof {
	[Key in AriaAttribute as Key extends `aria-${infer Name}` ? Name : never]: unknown;
};

type AriaAttributes = {
	[Key in keyof ARIAMixin as NormalizedName<Key>]: unknown;
};

/**
 * _ARIA_ attribute for an element that can be set to a boolean value
 */
export type AriaBooleanAttribute =
	| 'aria-atomic'
	| 'aria-busy'
	| 'aria-checked'
	| 'aria-current'
	| 'aria-disabled'
	| 'aria-expanded'
	| 'aria-haspopup'
	| 'aria-hidden'
	| 'aria-invalid'
	| 'aria-modal'
	| 'aria-multiline'
	| 'aria-multiselectable'
	| 'aria-pressed'
	| 'aria-readonly'
	| 'aria-required'
	| 'aria-selected';

/**
 * _ARIA_ attribute for an element that can be set to a boolean value, without the `aria-` prefix
 */
export type AriaBooleanAttributeUnprefixed = keyof {
	[Key in AriaBooleanAttribute as Key extends `aria-${infer Name}` ? Name : never]: string | null;
};

type NormalizedName<Key extends string> = Key extends `aria${infer Name}`
	? Name extends `${infer Part}Element`
		? `aria-${Lowercase<Part>}`
		: Name extends `${infer Part}Elements`
			? `aria-${Lowercase<Part>}`
			: `aria-${Lowercase<Name>}`
	: never;

/**
 * _ARIA_ role for an element
 *
 * _(https://www.w3.org/TR/wai-aria-1.3/#role_definitions)_
 */
export type AriaRole =
	| 'alert'
	| 'alertdialog'
	| 'application'
	| 'article'
	| 'banner'
	| 'blockquote'
	| 'button'
	| 'caption'
	| 'cell'
	| 'checkbox'
	| 'code'
	| 'columnheader'
	| 'combobox'
	| 'comment'
	| 'complementary'
	| 'contentinfo'
	| 'definition'
	| 'deletion'
	| 'dialog'
	| 'directory'
	| 'document'
	| 'emphasis'
	| 'feed'
	| 'figure'
	| 'form'
	| 'generic'
	| 'grid'
	| 'gridcell'
	| 'group'
	| 'heading'
	| 'img'
	| 'insertion'
	| 'link'
	| 'list'
	| 'listbox'
	| 'listitem'
	| 'log'
	| 'main'
	| 'mark'
	| 'marquee'
	| 'math'
	| 'menu'
	| 'menubar'
	| 'menuitem'
	| 'menuitemcheckbox'
	| 'menuitemradio'
	| 'meter'
	| 'navigation'
	| 'none'
	| 'note'
	| 'option'
	| 'paragraph'
	| 'presentation'
	| 'progressbar'
	| 'radio'
	| 'radiogroup'
	| 'region'
	| 'row'
	| 'rowgroup'
	| 'rowheader'
	| 'scrollbar'
	| 'search'
	| 'searchbox'
	| 'sectionfooter'
	| 'sectionheader'
	| 'separator'
	| 'slider'
	| 'spinbutton'
	| 'status'
	| 'strong'
	| 'subscript'
	| 'suggestion'
	| 'superscript'
	| 'switch'
	| 'tab'
	| 'table'
	| 'tablist'
	| 'tabpanel'
	| 'term'
	| 'textbox'
	| 'time'
	| 'timer'
	| 'toolbar'
	| 'tooltip'
	| 'tree'
	| 'treegrid'
	| 'treeitem';

/**
 * Attribute for an element
 */
export type Attribute = {
	name: string;
	value: unknown;
};

/**
 * CSS styles for an element
 */
export type CSSStyles = Record<keyof CSSStyleDeclaration, unknown>;

/**
 * CSSS values for an element _(both styles and variables)_
 */
export type CSSValues = CSSVariables & CSSStyles;

/**
 * CSS variables for an element
 */
export type CSSVariables<Value extends Record<string, unknown> = Record<string, unknown>> = {
	[Property in keyof Value as `--${string & Property}`]?: unknown;
};

/**
 * Event listener for custom events
 */
export type CustomEventListener = (event: CustomEvent) => void;

/**
 * Event listener that can be removed
 */
export type RemovableEventListener = () => void;

/**
 * Selector that be searched for
 */
export type Selector = string | Node | Node[] | NodeList;

/**
 * Text direction for an element
 */
export type TextDirection = 'ltr' | 'rtl';
