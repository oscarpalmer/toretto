import {
	FOCUSABLE_ATTRIBUTE_CONTENTEDITABLE,
	FOCUSABLE_ATTRIBUTE_INERT,
	FOCUSABLE_ATTRIBUTE_TABINDEX,
	FOCUSABLE_EXPRESSION_DISABLEABLE,
	FOCUSABLE_EXPRESSION_SPECIAL_TABINDEX,
	FOCUSABLE_EXPRESSION_SUMMARY,
	FOCUSABLE_EXPRESSION_TRUEISH,
	FOCUSABLE_SELECTOR_DETAILS_CLOSED_CHILDREN,
	FOCUSABLE_SELECTOR_FIELDSET_DISABLED,
	FOCUSABLE_SELECTOR_FULL,
	FOCUSABLE_SELECTOR_RADIO_PREFIX,
	FOCUSABLE_SELECTOR_RADIO_SUFFIX,
	FOCUSABLE_SELECTOR_SUMMARY_FIRST,
	FOCUSABLE_STYLE_HIDDEN,
	FOCUSABLE_STYLE_NONE,
	FOCUSABLE_TABINDEX_BASE,
	FOCUSABLE_TABINDEX_DEFAULT,
	FOCUSABLE_TYPE_RADIO,
	type FocusableElementWithTabIndex,
	type FocusableFilter,
	type FocusableInertElement,
} from './models/focusable.model';

// Based on https://github.com/focus-trap/tabbable :-)

// #region Functions

/**
 * Get a list of focusable elements within a parent element
 *
 * @param parent Parent element
 * @returns Focusable elements
 */
export function getFocusable(parent: Element): Element[] {
	return getValidElements(parent, FILTERS_FOCUSABLE, false);
}

function getItem(element: Element, tabbable: boolean): FocusableElementWithTabIndex {
	return {
		element,
		tabIndex: tabbable ? getTabIndex(element) : FOCUSABLE_TABINDEX_DEFAULT,
	};
}

/**
 * Get a list of tabbable elements within a parent element
 *
 * @param parent Parent element
 * @returns Tabbable elements
 */
export function getTabbable(parent: Element): Element[] {
	return getValidElements(parent, FILTERS_TABBABLE, true);
}

function getTabIndex(element: Element): number {
	const tabIndex = (element as HTMLElement)?.tabIndex ?? FOCUSABLE_TABINDEX_DEFAULT;

	if (
		tabIndex < FOCUSABLE_TABINDEX_BASE &&
		(FOCUSABLE_EXPRESSION_SPECIAL_TABINDEX.test(element.tagName) || isEditable(element)) &&
		!hasTabIndex(element)
	) {
		return FOCUSABLE_TABINDEX_BASE;
	}

	return tabIndex;
}

function getValidElements(
	parent: Element,
	filters: FocusableFilter[],
	tabbable: boolean,
): Element[] {
	if (!(parent instanceof Element)) {
		return [];
	}

	const elements = [...parent.querySelectorAll(FOCUSABLE_SELECTOR_FULL)];
	const items: FocusableElementWithTabIndex[] = [];

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

		if (item.tabIndex === FOCUSABLE_TABINDEX_BASE) {
			zeroed.push(item.element);
		} else {
			indiced[item.tabIndex] = [...(indiced[item.tabIndex] ?? []), item.element];
		}
	}

	return [...indiced.flat(), ...zeroed];
}

function hasTabIndex(element: Element): boolean {
	return !Number.isNaN(
		Number.parseInt(element.getAttribute(FOCUSABLE_ATTRIBUTE_TABINDEX) as string, 10),
	);
}

function isDisabled(item: FocusableElementWithTabIndex): boolean {
	if (
		FOCUSABLE_EXPRESSION_DISABLEABLE.test(item.element.tagName) &&
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
					return parent.matches(FOCUSABLE_SELECTOR_FIELDSET_DISABLED) || !child.contains(element);
				}
			}

			return true;
		}

		parent = parent.parentElement;
	}

	return false;
}

function isEditable(element: Element): boolean {
	return FOCUSABLE_EXPRESSION_TRUEISH.test(
		element.getAttribute(FOCUSABLE_ATTRIBUTE_CONTENTEDITABLE) as string,
	);
}

/**
 * Is the element focusable?
 *
 * @param element Element to check
 * @returns `true` if focusable, otherwise `false`
 */
export function isFocusable(element: Element): boolean {
	return element instanceof Element ? isValidElement(element, FILTERS_FOCUSABLE, false) : false;
}

function isHidden(item: FocusableElementWithTabIndex): boolean {
	if (
		((item.element as HTMLElement).hidden ?? false) ||
		(item.element instanceof HTMLInputElement && item.element.type === FOCUSABLE_STYLE_HIDDEN)
	) {
		return true;
	}

	const isDirectSummary = item.element.matches(FOCUSABLE_SELECTOR_SUMMARY_FIRST);

	const nodeUnderDetails = isDirectSummary ? item.element.parentElement : item.element;

	if (nodeUnderDetails?.matches(FOCUSABLE_SELECTOR_DETAILS_CLOSED_CHILDREN) ?? false) {
		return true;
	}

	const style = getComputedStyle(item.element);

	if (style.display === FOCUSABLE_STYLE_NONE || style.visibility === FOCUSABLE_STYLE_HIDDEN) {
		return true;
	}

	const {height, width} = item.element.getBoundingClientRect();

	return height === 0 && width === 0;
}

function isInert(item: FocusableElementWithTabIndex): boolean {
	return (
		((item.element as FocusableInertElement).inert ?? false) ||
		FOCUSABLE_EXPRESSION_TRUEISH.test(
			item.element.getAttribute(FOCUSABLE_ATTRIBUTE_INERT) as string,
		) ||
		(item.element.parentElement != null &&
			isInert({
				element: item.element.parentElement,
				tabIndex: FOCUSABLE_TABINDEX_DEFAULT,
			}))
	);
}

function isNotTabbable(item: FocusableElementWithTabIndex): boolean {
	return (item.tabIndex ?? FOCUSABLE_TABINDEX_DEFAULT) < FOCUSABLE_TABINDEX_BASE;
}

function isNotTabbableRadio(item: FocusableElementWithTabIndex): boolean {
	if (
		!(item.element instanceof HTMLInputElement) ||
		item.element.type !== FOCUSABLE_TYPE_RADIO ||
		!item.element.name ||
		item.element.checked
	) {
		return false;
	}

	const parent = item.element.form ?? item.element.getRootNode?.() ?? item.element.ownerDocument;

	const realName = CSS?.escape?.(item.element.name) ?? item.element.name;

	const radios = [
		...(parent as Element).querySelectorAll(
			`${FOCUSABLE_SELECTOR_RADIO_PREFIX}${realName}${FOCUSABLE_SELECTOR_RADIO_SUFFIX}`,
		),
	] as HTMLInputElement[];

	const checked = radios.find(radio => radio.checked);

	return checked != null && checked !== item.element;
}

function isSummarised(item: FocusableElementWithTabIndex): boolean {
	return (
		item.element instanceof HTMLDetailsElement &&
		[...item.element.children].some(child => FOCUSABLE_EXPRESSION_SUMMARY.test(child.tagName))
	);
}

/**
 * Is the element tabbable?
 *
 * @param element Element to check
 * @returns `true` if tabbable, otherwise `false`
 */
export function isTabbable(element: Element): boolean {
	return element instanceof Element ? isValidElement(element, FILTERS_TABBABLE, true) : false;
}

function isValidElement(element: Element, filters: FocusableFilter[], tabbable: boolean): boolean {
	const item = getItem(element, tabbable);

	return !filters.some(filter => filter(item));
}

// #endregion

// #region Variables

const FILTERS_FOCUSABLE: Array<(item: FocusableElementWithTabIndex) => boolean> = [
	isDisabled,
	isInert,
	isHidden,
	isSummarised,
];

const FILTERS_TABBABLE: Array<(item: FocusableElementWithTabIndex) => boolean> = [
	isNotTabbable,
	isNotTabbableRadio,
	...FILTERS_FOCUSABLE,
];

// #endregion
