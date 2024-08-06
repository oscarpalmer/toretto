// Based on https://github.com/focus-trap/tabbable :-)

type ElementWithTabIndex = {
	element: Element;
	tabIndex: number;
};

type Filter = (item: ElementWithTabIndex) => boolean;
type InertElement = Element & {inert: boolean};

const focusableFilters = [isDisabled, isInert, isHidden, isSummarised];

const selector = [
	'[contenteditable]:not([contenteditable="false"])',
	'[tabindex]:not(slot)',
	'a[href]',
	'audio[controls]',
	'button',
	'details',
	'details > summary:first-of-type',
	'input',
	'select',
	'textarea',
	'video[controls]',
]
	.map(selector => `${selector}:not([inert])`)
	.join(',');

const tabbableFilters = [
	isNotTabbable,
	isNotTabbableRadio,
	...focusableFilters,
];

/**
 * Get a list of focusable elements within a parent element
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
 */
export function getTabbable(parent: Element): Element[] {
	return getValidElements(parent, tabbableFilters, true);
}

function getTabIndex(element: Element): number {
	const tabIndex = (element as HTMLElement)?.tabIndex ?? -1;

	if (
		tabIndex < 0 &&
		(/^(audio|details|video)$/i.test(element.tagName) || isEditable(element)) &&
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
): Array<Element> {
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

	const indiced: Array<Array<Element>> = [];
	const zeroed: Array<Element> = [];

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
		/^(button|input|select|textarea)$/i.test(item.element.tagName) &&
		isDisabledFromFieldset(item.element)
	) {
		return true;
	}

	return (
		((item.element as HTMLInputElement).disabled ?? false) ||
		item.element.getAttribute('aria-disabled') === 'true'
	);
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
	return /^(|true)$/i.test(element.getAttribute('contenteditable') as string);
}

/**
 * Is the element focusable?
 */
export function isFocusable(element: Element): boolean {
	return isValidElement(element, focusableFilters, false);
}

function isHidden(item: ElementWithTabIndex) {
	if (
		((item.element as HTMLElement).hidden ?? false) ||
		(item.element instanceof HTMLInputElement && item.element.type === 'hidden')
	) {
		return true;
	}

	const isDirectSummary = item.element.matches(
		'details > summary:first-of-type',
	);

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
		/^(|true)$/i.test(item.element.getAttribute('inert') as string) ||
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

	const radios = Array.from(
		(parent as Element).querySelectorAll(
			`input[type="radio"][name="${realName}"]`,
		),
	) as HTMLInputElement[];

	const checked = radios.find(radio => radio.checked);

	return checked != null && checked !== item.element;
}

function isSummarised(item: ElementWithTabIndex) {
	return (
		item.element instanceof HTMLDetailsElement &&
		Array.from(item.element.children).some(child =>
			/^summary$/i.test(child.tagName),
		)
	);
}

/**
 * Is the element tabbable?
 */
export function isTabbable(element: Element): boolean {
	return isValidElement(element, tabbableFilters, true);
}

function isValidElement(
	element: Element,
	filters: Filter[],
	tabbable: boolean,
): boolean {
	const item = getItem(element, tabbable);

	return !filters.some(filter => filter(item));
}
