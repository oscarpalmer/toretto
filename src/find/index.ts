import type {PlainObject} from '@oscarpalmer/atoms';
import type {Selector} from '../models';

/**
 * Find the first element that matches the selector
 * @param selector Selector to find element for
 * @param context Context to search within _(defaults to `document`)_
 * @returns Found element or `null`
 */
export function findElement(selector: string, context?: Selector | null): Element | null {
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
			: (findElementOrElements(context, undefined, false) as Element[]).filter(isContext);

	if (typeof selector === 'string') {
		return findElementOrElementsForSelector(selector, contexts, callback, single);
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
		const value = (contexts[index][callback] as (selector: string) => Node | null)(selector) as
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

	return single ? null : result.filter((value, index, array) => array.indexOf(value) === index);
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
				contexts.some(ctx => ctx === element || ctx.contains(element))) &&
			!result.includes(element)
		) {
			result.push(element);
		}
	}

	return result;
}

/**
 * Find elements that match the selector
 * @param selector Selector to find elements for
 * @param context Context to search within _(defaults to `document`)_
 * @returns Found elements
 */
export function findElements(selector: Selector, context?: Selector | null): Element[] {
	return findElementOrElements(selector, context, false) as never;
}

/**
 * Get the most specific element under the pointer
 *
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

//

const QUERY_SELECTOR_ALL = 'querySelectorAll';

const QUERY_SELECTOR_SINGLE = 'querySelector';

const STYLE_HIDDEN = 'hidden';

const STYLE_NONE = 'none';

const SUFFIX_HOVER = ':hover';

const TAG_HEAD = 'HEAD';

//

export {findElement as $, findElements as $$};
export {findAncestor, findRelatives} from './relative';
