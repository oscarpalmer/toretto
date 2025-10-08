// Based on https://github.com/focus-trap/tabbable :-)

type ElementWithTabIndex = {
	element: Element;
	tabIndex: number;
};

type Filter = (item: ElementWithTabIndex) => boolean;

type InertElement = Element & {inert: boolean};

//

/**
 * Get a list of focusable elements within a parent element
 * @param parent Parent element
 * @returns Focusable elements
 */
export function getFocusable(parent: Element): Element[] {
	return getValidElements(parent, FILTERS_FOCUSABLE, false);
}

function getItem(element: Element, tabbable: boolean): ElementWithTabIndex {
	return {
		element,
		tabIndex: tabbable ? getTabIndex(element) : TABINDEX_DEFAULT,
	};
}

/**
 * Get a list of tabbable elements within a parent element
 * @param parent Parent element
 * @returns Tabbable elements
 */
export function getTabbable(parent: Element): Element[] {
	return getValidElements(parent, FILTERS_TABBABLE, true);
}

function getTabIndex(element: Element): number {
	const tabIndex = (element as HTMLElement)?.tabIndex ?? TABINDEX_DEFAULT;

	if (
		tabIndex < TABINDEX_BASE &&
		(EXPRESSION_SPECIAL_TABINDEX.test(element.tagName) ||
			isEditable(element)) &&
		!hasTabIndex(element)
	) {
		return TABINDEX_BASE;
	}

	return tabIndex;
}

function getValidElements(
	parent: Element,
	filters: Filter[],
	tabbable: boolean,
): Element[] {
	if (!(parent instanceof Element)) {
		return [];
	}

	const elements = [...parent.querySelectorAll(SELECTOR_FULL)];
	const items: ElementWithTabIndex[] = [];

	let {length} = elements;

	for (let index = 0; index < length; index += 1) {
		const item = getItem(elements[index], tabbable);

		if (!filters.some(filter => filter(item))) {
			items.push(item);
		}
	}

	if (!tabbable) {
		return items.map(item => item.element);
	}

	const indiced: Element[][] = [];
	const zeroed: Element[] = [];

	length = items.length;

	for (let index = 0; index < length; index += 1) {
		const item = items[index];

		if (item.tabIndex === TABINDEX_BASE) {
			zeroed.push(item.element);
		} else {
			indiced[item.tabIndex] = [
				...(indiced[item.tabIndex] ?? []),
				item.element,
			];
		}
	}

	return [...indiced.flat(), ...zeroed];
}

function hasTabIndex(element: Element): boolean {
	return !Number.isNaN(
		Number.parseInt(element.getAttribute(ATTRIBUTE_TABINDEX) as string, 10),
	);
}

function isDisabled(item: ElementWithTabIndex): boolean {
	if (
		EXPRESSION_DISABLEABLE.test(item.element.tagName) &&
		isDisabledFromFieldset(item.element)
	) {
		return true;
	}

	return (item.element as HTMLInputElement).disabled ?? false;
}

function isDisabledFromFieldset(element: Element): boolean {
	let parent = element.parentElement;

	while (parent != null) {
		if (parent instanceof HTMLFieldSetElement && parent.disabled) {
			const children = Array.from(parent.children);
			const {length} = children;

			for (let index = 0; index < length; index += 1) {
				const child = children[index];

				if (child instanceof HTMLLegendElement) {
					return (
						parent.matches(SELECTOR_FIELDSET_DISABLED) ||
						!child.contains(element)
					);
				}
			}

			return true;
		}

		parent = parent.parentElement;
	}

	return false;
}

function isEditable(element: Element): boolean {
	return EXPRESSION_TRUEISH.test(
		element.getAttribute(ATTRIBUTE_CONTENTEDITABLE) as string,
	);
}

/**
 * Is the element focusable?
 * @param element Element to check
 * @returns `true` if focusable, otherwise `false`
 */
export function isFocusable(element: Element): boolean {
	return element instanceof Element
		? isValidElement(element, FILTERS_FOCUSABLE, false)
		: false;
}

function isHidden(item: ElementWithTabIndex): boolean {
	if (
		((item.element as HTMLElement).hidden ?? false) ||
		(item.element instanceof HTMLInputElement &&
			item.element.type === STYLE_HIDDEN)
	) {
		return true;
	}

	const isDirectSummary = item.element.matches(SELECTOR_SUMMARY_FIRST);

	const nodeUnderDetails = isDirectSummary
		? item.element.parentElement
		: item.element;

	if (nodeUnderDetails?.matches(SELECTOR_DETAILS_CLOSED_CHILDREN) ?? false) {
		return true;
	}

	const style = getComputedStyle(item.element);

	if (style.display === STYLE_NONE || style.visibility === STYLE_HIDDEN) {
		return true;
	}

	const {height, width} = item.element.getBoundingClientRect();

	return height === 0 && width === 0;
}

function isInert(item: ElementWithTabIndex): boolean {
	return (
		((item.element as InertElement).inert ?? false) ||
		EXPRESSION_TRUEISH.test(
			item.element.getAttribute(ATTRIBUTE_INERT) as string,
		) ||
		(item.element.parentElement != null &&
			isInert({
				element: item.element.parentElement,
				tabIndex: TABINDEX_DEFAULT,
			}))
	);
}

function isNotTabbable(item: ElementWithTabIndex): boolean {
	return (item.tabIndex ?? TABINDEX_DEFAULT) < TABINDEX_BASE;
}

function isNotTabbableRadio(item: ElementWithTabIndex): boolean {
	if (
		!(item.element instanceof HTMLInputElement) ||
		item.element.type !== TYPE_RADIO ||
		!item.element.name ||
		item.element.checked
	) {
		return false;
	}

	const parent =
		item.element.form ??
		item.element.getRootNode?.() ??
		item.element.ownerDocument;

	const realName = CSS?.escape?.(item.element.name) ?? item.element.name;

	const radios = [
		...(parent as Element).querySelectorAll(
			`${SELECTOR_RADIO_PREFIX}${realName}${SELECTOR_RADIO_SUFFIX}`,
		),
	] as HTMLInputElement[];

	const checked = radios.find(radio => radio.checked);

	return checked != null && checked !== item.element;
}

function isSummarised(item: ElementWithTabIndex): boolean {
	return (
		item.element instanceof HTMLDetailsElement &&
		[...item.element.children].some(child =>
			EXPRESSION_SUMMARY.test(child.tagName),
		)
	);
}

/**
 * Is the element tabbable?
 * @param element Element to check
 * @returns `true` if tabbable, otherwise `false`
 */
export function isTabbable(element: Element): boolean {
	return element instanceof Element
		? isValidElement(element, FILTERS_TABBABLE, true)
		: false;
}

function isValidElement(
	element: Element,
	filters: Filter[],
	tabbable: boolean,
): boolean {
	const item = getItem(element, tabbable);

	return !filters.some(filter => filter(item));
}

//

const ATTRIBUTE_CONTENTEDITABLE = 'contenteditable';

const ATTRIBUTE_INERT = 'inert';

const ATTRIBUTE_TABINDEX = 'tabindex';

const EXPRESSION_DISABLEABLE = /^(button|input|select|textarea)$/i;

const EXPRESSION_SPECIAL_TABINDEX = /^(audio|details|video)$/i;

const EXPRESSION_SUMMARY = /^summary$/i;

const EXPRESSION_TRUEISH = /^(|true)$/i;

const FILTERS_FOCUSABLE: Array<(item: ElementWithTabIndex) => boolean> = [
	isDisabled,
	isInert,
	isHidden,
	isSummarised,
];

const FILTERS_TABBABLE: Array<(item: ElementWithTabIndex) => boolean> = [
	isNotTabbable,
	isNotTabbableRadio,
	...FILTERS_FOCUSABLE,
];

const SELECTOR_DETAILS_CLOSED_CHILDREN = 'details:not([open]) *';

const SELECTOR_FIELDSET_DISABLED = 'fieldset[disabled] *';

const SELECTOR_SUMMARY_FIRST = 'details > summary:first-of-type';

const SELECTOR_RADIO_PREFIX = 'input[type="radio"][name="';

const SELECTOR_RADIO_SUFFIX = '"]';

const SELECTOR_FULL: string = [
	'[contenteditable]:not([contenteditable="false"])',
	'[tabindex]:not(slot)',
	'a[href]',
	'audio[controls]',
	'button',
	'details',
	SELECTOR_SUMMARY_FIRST,
	'input',
	'select',
	'textarea',
	'video[controls]',
]
	.map(selector => `${selector}:not([inert])`)
	.join(',');

const STYLE_HIDDEN = 'hidden';

const STYLE_NONE = 'none';

const TABINDEX_BASE = 0;

const TABINDEX_DEFAULT = -1;

const TYPE_RADIO = 'radio';
