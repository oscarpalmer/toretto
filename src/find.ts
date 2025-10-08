import type {PlainObject} from '@oscarpalmer/atoms';
import type {Selector} from './models';

/**
 * - Get the distance between two elements _(i.e., the amount of nodes of between them)_
 * - If the distance cannot be calculated, `-1` is returned
 */
function getDistanceBetweenElements(
	origin: Element,
	target: Element,
): number | undefined {
	if (origin === target || origin.parentElement === target) {
		return 0;
	}

	const comparison = origin.compareDocumentPosition(target);
	const children = [...(origin.parentElement?.children ?? [])];

	if (children.includes(target)) {
		return Math.abs(children.indexOf(origin) - children.indexOf(target));
	}

	const beforeOrInside = !!(comparison & 2 || comparison & 8);

	if (beforeOrInside || !!(comparison & 4 || comparison & 16)) {
		return (
			traverse(
				beforeOrInside ? origin : target,
				beforeOrInside ? target : origin,
			) ?? -1
		);
	}
}

/**
 * - Find the closest ancestor element that matches the selector
 * - Matches may be found by a query string or a callback
 * - If no match is found, `null` is returned
 * - _(If you want to search upwards, downwards, and sideways, use `findRelative`)_
 * @param origin Element to start from
 * @param selector Selector to match
 * @returns Found ancestor or `null`
 */
export function findAncestor(
	origin: Element,
	selector: string | ((element: Element) => boolean),
): Element | null {
	if (!(origin instanceof Element) || selector == null) {
		return null;
	}

	if (typeof selector === 'string') {
		if (origin.matches?.(selector)) {
			return origin;
		}

		return origin.closest(selector);
	}

	if (typeof selector !== 'function') {
		return null;
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
 * Find the first element that matches the selector
 *
 * _(`context` is optional and defaults to `document`)_
 * @param selector Selector to find
 * @param context Context to search within
 * @returns Found element or `null`
 */
export function findElement(
	selector: string,
	context?: Selector | null,
): Element | null {
	return findElementOrElements(selector, context, true) as never;
}

function findElementOrElements(
	selector: Selector,
	context: Selector | null | undefined,
	single: boolean,
): Element | Element[] | null {
	const callback = single ? QUERY_SELECTOR_SINGLE : QUERY_SELECTOR_ALL;

	const contexts =
		context == null
			? [document]
			: (findElementOrElements(context, undefined, false) as Element[]).filter(
					isContext,
				);

	if (typeof selector === 'string') {
		return findElementOrElementsForSelector(
			selector,
			contexts,
			callback,
			single,
		);
	}

	let array: unknown[];

	if (Array.isArray(selector)) {
		array = selector;
	} else {
		array = selector instanceof Node ? [selector] : [...selector];
	}

	return findElementOrElementsFromNodes(array, context, contexts);
}

function findElementOrElementsForSelector(
	selector: string,
	contexts: Array<Document | Element>,
	callback: 'querySelector' | 'querySelectorAll',
	single: boolean,
): Element | Element[] | null {
	const {length} = contexts;

	const result: Element[] = [];

	for (let index = 0; index < length; index += 1) {
		const value = (
			contexts[index][callback] as (selector: string) => Node | null
		)(selector) as Element | Element[] | null;

		if (single) {
			if (value == null) {
				continue;
			}

			return value;
		}

		result.push(...Array.from(value as Element[]));
	}

	return single
		? null
		: result.filter((value, index, array) => array.indexOf(value) === index);
}

function findElementOrElementsFromNodes(
	array: unknown[],
	context: unknown,
	contexts: Array<Document | Element>,
): Element | Element[] | null {
	const result: Element[] = [];

	const nodes = array.filter(node => node instanceof Node);
	const {length} = nodes;

	for (let index = 0; index < length; index += 1) {
		const node = nodes[index];

		let element: Element | undefined;

		if (node instanceof Document) {
			element = node.body;
		} else {
			element = node instanceof Element ? node : undefined;
		}

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
 * - _(`context` is optional and defaults to `document`)_
 * @param selector Selector to find
 * @param context Context to search within
 * @returns Found elements
 */
export function findElements(
	selector: Selector,
	context?: Selector | null,
): Element[] {
	return findElementOrElements(selector, context, false) as never;
}

/**
 * - Finds the closest elements to the origin element that matches the selector
 * - Traverses up, down, and sideways in the _DOM_-tree
 * - _(If you only want to traverse up, use `findAncestor`)_
 * @param origin Element to start from
 * @param selector Selector to match
 * @param context Context to search within
 * @returns Found elements
 */
export function findRelatives(
	origin: Element,
	selector: string,
	context?: Document | Element,
): Element[] {
	if (!(origin instanceof Element) || typeof selector !== 'string') {
		return [];
	}

	if (origin.matches(selector)) {
		return [origin];
	}

	const elements = [
		...(context instanceof Document || context instanceof Element
			? context
			: document
		).querySelectorAll(selector),
	];

	const {length} = elements;

	if (length === 0) {
		return [];
	}

	const distances = [];

	let minimum: number | undefined;

	for (let index = 0; index < length; index += 1) {
		const element = elements[index];
		const distance = getDistanceBetweenElements(origin, element) ?? -1;

		if (distance > -1) {
			if (minimum == null || distance < minimum) {
				minimum = distance;
			}

			distances.push({
				distance,
				element,
			});
		}
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
 * - _(If `skipIgnore` is `true`, no elements are ignored)_
 * @param skipIgnore Skip ignored elements?
 * @returns Found element or `null`
 */
export function getElementUnderPointer(skipIgnore?: boolean): Element | null {
	const elements = [...document.querySelectorAll(SUFFIX_HOVER)];
	const {length} = elements;

	const returned: Element[] = [];

	for (let index = 0; index < length; index += 1) {
		const element = elements[index];

		if (element.tagName === TAG_HEAD) {
			continue;
		}

		const style = getComputedStyle(element);

		if (
			skipIgnore === true ||
			(style.pointerEvents !== STYLE_NONE && style.visibility !== STYLE_HIDDEN)
		) {
			returned.push(element);
		}
	}

	return returned.at(-1) ?? null;
}

function isContext(value: unknown): boolean {
	return (
		typeof (value as PlainObject)?.querySelector === 'function' &&
		typeof (value as PlainObject)?.querySelectorAll === 'function'
	);
}

function traverse(from: Element, to: Element): number | undefined {
	let index = [...to.children].indexOf(from);

	if (index > -1) {
		return index + 1;
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

		index = children.findIndex(child => child.contains(to));

		if (index > -1) {
			const traversed = traverse(current, children[index]) ?? -1;

			return traversed === -1
				? -1
				: distance + Math.abs(index - children.indexOf(current)) + traversed;
		}

		current = parent;
		distance += 1;
		parent = parent.parentElement;
	}
}

//

const QUERY_SELECTOR_ALL = 'querySelectorAll';

const QUERY_SELECTOR_SINGLE = 'querySelector';

const STYLE_HIDDEN = 'hidden';

const STYLE_NONE = 'none';

const SUFFIX_HOVER = ':hover';

const TAG_HEAD = 'HEAD';

//

export {findElement as $, findElements as $$};
