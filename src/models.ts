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
	[Key in AriaAttribute as Key extends `aria-${infer Name}` ? Name : never]: string | null;
};

type AriaAttributes = {
	[Key in keyof ARIAMixin as NormalizedName<Key>]: string | null;
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
