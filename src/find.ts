import type {Selector} from './models';

/**
 * Get the distance between two elements _(i.e., the amount of nodes of between them)_
 */
export function getDistanceBetweenElements(
	origin: Element,
	target: Element,
): number {
	if (origin === target || origin.parentElement === target) {
		return 0;
	}

	const comparison = origin.compareDocumentPosition(target);
	const children = [...(origin.parentElement?.children ?? [])];

	switch (true) {
		case children.includes(target):
			return Math.abs(children.indexOf(origin) - children.indexOf(target));

		case !!(comparison & 2 || comparison & 8):
			// Target element is before or holds the origin element
			return traverse(origin, target);

		case !!(comparison & 4 || comparison & 16):
			// Origin element is before or holds the target element
			return traverse(target, origin);

		default:
			return -1;
	}
}

/**
 * - Find the closest ancestor element that matches the selector
 * - Matches may be found by a query string or a callback
 * - If no match is found, `null` is returned
 * - _(If you want to search upwards, downwards, and sideways, use `findRelative`)_
 */
export function findAncestor(
	origin: Element,
	selector: string | ((element: Element) => boolean),
): Element | null {
	if (origin == null || selector == null) {
		return null;
	}

	if (typeof selector === 'string') {
		if (origin.matches?.(selector)) {
			return origin;
		}

		return origin.closest(selector);
	}

	if (selector(origin)) {
		return origin;
	}

	let parent: Element | null = origin.parentElement;

	while (parent != null && !selector(parent)) {
		if (parent === document.body) {
			return null;
		}

		parent = parent.parentElement;
	}

	return parent;
}

/**
 * - Find the first element that matches the selector
 * - `context` is optional and defaults to `document`
 */
export function findElement(
	selector: string,
	context?: Selector,
): Element | undefined {
	return findElementOrElements(selector, context, true) as never;
}

function findElementOrElements(
	selector: Selector,
	context: Selector | undefined,
	single: boolean,
): Element | Element[] | undefined {
	const callback = single ? document.querySelector : document.querySelectorAll;

	const contexts =
		context == null
			? [document]
			: (findElementOrElements(context, undefined, false) as Element[]);

	const result: Element[] = [];

	if (typeof selector === 'string') {
		const {length} = contexts;

		for (let index = 0; index < length; index += 1) {
			const value = callback.call(contexts[index], selector) as
				| Element
				| Element[]
				| null;

			if (single) {
				if (value == null) {
					continue;
				}

				return value;
			}

			result.push(...Array.from(value as Element[]));
		}

		return single
			? undefined
			: result.filter((value, index, array) => array.indexOf(value) === index);
	}

	const nodes = Array.isArray(selector)
		? selector
		: selector instanceof NodeList
			? Array.from(selector)
			: [selector];

	const {length} = nodes;

	for (let index = 0; index < length; index += 1) {
		const node = nodes[index];

		const element =
			node instanceof Document
				? node.body
				: node instanceof Element
					? node
					: undefined;

		if (
			element != null &&
			(context == null ||
				contexts.length === 0 ||
				contexts.some(
					context => context === element || context.contains(element),
				)) &&
			!result.includes(element)
		) {
			result.push(element);
		}
	}

	return result;
}

/**
 * - Find elements that match the selector
 * - If `selector` is a node or a list of nodes, they are filtered and returned
 * - `context` is optional and defaults to `document`
 */
export function findElements(
	selector: Selector,
	context?: Selector,
): Element[] {
	return findElementOrElements(selector, context, false) as never;
}

/**
 * - Finds the closest elements to the origin element that matches the selector
 * - Traverses up, down, and sideways in the _DOM_-tree
 * - _(If you only want to traverse up, use `findAncestor`)_
 */
export function findRelatives(
	origin: Element,
	selector: string,
	context?: Document | Element,
): Element[] {
	if (origin.matches(selector)) {
		return [origin];
	}

	const elements = [...(context ?? document).querySelectorAll(selector)];
	const {length} = elements;

	if (length === 0) {
		return [];
	}

	const distances = [];

	let minimum: number | null = null;

	for (let index = 0; index < length; index += 1) {
		const element = elements[index];
		const distance = getDistanceBetweenElements(origin, element);

		if (distance < 0) {
			continue;
		}

		if (minimum == null || distance < minimum) {
			minimum = distance;
		}

		distances.push({
			distance,
			element,
		});
	}

	return minimum == null
		? []
		: distances
				.filter(found => found.distance === minimum)
				.map(found => found.element);
}

/**
 * - Get the most specific element under the pointer
 * - Ignores elements with `pointer-events: none` and `visibility: hidden`
 * - If `skipIgnore` is `true`, no elements are ignored
 */
export function getElementUnderPointer(
	skipIgnore?: boolean,
): Element | undefined {
	const elements = [...document.querySelectorAll(':hover')];
	const {length} = elements;

	const returned: Element[] = [];

	for (let index = 0; index < length; index += 1) {
		const element = elements[index];

		if (/^head$/i.test(element.tagName)) {
			continue;
		}

		const style = getComputedStyle(element);

		if (
			skipIgnore === true ||
			(style.pointerEvents !== 'none' && style.visibility !== 'hidden')
		) {
			returned.push(element);
		}
	}

	return returned.at(-1);
}

function traverse(from: Element, to: Element): number {
	const children = [...to.children];

	if (children.includes(from)) {
		return children.indexOf(from) + 1;
	}

	let current = from;
	let distance = 0;
	let parent: Element | null = from.parentElement;

	while (parent != null) {
		if (parent === to) {
			return distance + 1;
		}

		const children = [...(parent.children ?? [])];

		if (children.includes(to)) {
			return (
				distance + Math.abs(children.indexOf(current) - children.indexOf(to))
			);
		}

		const index = children.findIndex(child => child.contains(to));

		if (index > -1) {
			return (
				distance +
				Math.abs(index - children.indexOf(current)) +
				traverse(to, children[index])
			);
		}

		current = parent;
		distance += 1;
		parent = parent.parentElement;
	}

	return -1_000_000;
}

export {findElement as $, findElements as $$};
