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
	return getValidElements(parent, focusableFilters, false);
}

function getItem(element: Element, tabbable: boolean): ElementWithTabIndex {
	return {
		element,
		tabIndex: tabbable ? getTabIndex(element) : -1,
	};
}

/**
 * Get a list of tabbable elements within a parent element
 * @param parent Parent element
 * @returns Tabbable elements
 */
export function getTabbable(parent: Element): Element[] {
	return getValidElements(parent, tabbableFilters, true);
}

function getTabIndex(element: Element): number {
	const tabIndex = (element as HTMLElement)?.tabIndex ?? -1;

	if (
		tabIndex < 0 &&
		(specialTabIndexPattern.test(element.tagName) || isEditable(element)) &&
		!hasTabIndex(element)
	) {
		return 0;
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

	const elements = [...parent.querySelectorAll(selector)];
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

		if (item.tabIndex === 0) {
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
		Number.parseInt(element.getAttribute('tabindex') as string, 10),
	);
}

function isDisabled(item: ElementWithTabIndex): boolean {
	if (
		disableablePattern.test(item.element.tagName) &&
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
					return parent.matches('fieldset[disabled] *')
						? true
						: !child.contains(element);
				}
			}

			return true;
		}

		parent = parent.parentElement;
	}

	return false;
}

function isEditable(element: Element): boolean {
	return trueishPattern.test(element.getAttribute('contenteditable') as string);
}

/**
 * Is the element focusable?
 * @param element Element to check
 * @returns `true` if focusable, otherwise `false`
 */
export function isFocusable(element: Element): boolean {
	return element instanceof Element
		? isValidElement(element, focusableFilters, false)
		: false;
}

function isHidden(item: ElementWithTabIndex) {
	if (
		((item.element as HTMLElement).hidden ?? false) ||
		(item.element instanceof HTMLInputElement && item.element.type === 'hidden')
	) {
		return true;
	}

	const isDirectSummary = item.element.matches(firstSummary);

	const nodeUnderDetails = isDirectSummary
		? item.element.parentElement
		: item.element;

	if (nodeUnderDetails?.matches('details:not([open]) *') ?? false) {
		return true;
	}

	const style = getComputedStyle(item.element);

	if (style.display === 'none' || style.visibility === 'hidden') {
		return true;
	}

	const {height, width} = item.element.getBoundingClientRect();

	return height === 0 && width === 0;
}

function isInert(item: ElementWithTabIndex): boolean {
	return (
		((item.element as InertElement).inert ?? false) ||
		trueishPattern.test(item.element.getAttribute('inert') as string) ||
		(item.element.parentElement != null &&
			isInert({
				element: item.element.parentElement,
				tabIndex: -1,
			}))
	);
}

function isNotTabbable(item: ElementWithTabIndex) {
	return (item.tabIndex ?? -1) < 0;
}

function isNotTabbableRadio(item: ElementWithTabIndex): boolean {
	if (
		!(item.element instanceof HTMLInputElement) ||
		item.element.type !== 'radio' ||
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
			`input[type="radio"][name="${realName}"]`,
		),
	] as HTMLInputElement[];

	const checked = radios.find(radio => radio.checked);

	return checked != null && checked !== item.element;
}

function isSummarised(item: ElementWithTabIndex) {
	return (
		item.element instanceof HTMLDetailsElement &&
		[...item.element.children].some(child => summaryPattern.test(child.tagName))
	);
}

/**
 * Is the element tabbable?
 * @param element Element to check
 * @returns `true` if tabbable, otherwise `false`
 */
export function isTabbable(element: Element): boolean {
	return element instanceof Element
		? isValidElement(element, tabbableFilters, true)
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

const disableablePattern = /^(button|input|select|textarea)$/i;

const firstSummary = 'details > summary:first-of-type';

const focusableFilters = [isDisabled, isInert, isHidden, isSummarised];

const selector = [
	'[contenteditable]:not([contenteditable="false"])',
	'[tabindex]:not(slot)',
	'a[href]',
	'audio[controls]',
	'button',
	'details',
	firstSummary,
	'input',
	'select',
	'textarea',
	'video[controls]',
]
	.map(selector => `${selector}:not([inert])`)
	.join(',');

const specialTabIndexPattern = /^(audio|details|video)$/i;

const summaryPattern = /^summary$/i;

const tabbableFilters = [
	isNotTabbable,
	isNotTabbableRadio,
	...focusableFilters,
];

const trueishPattern = /^(|true)$/i;
