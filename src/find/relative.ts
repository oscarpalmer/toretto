import type {FindAncestorOrigin} from '../models/find.model';

// #region Functions

/**
 * Find the closest ancestor element that matches the tag name
 *
 * - If no match is found, `null` is returned
 * - _(If you want to search upwards, downwards, and sideways, use {@link findRelatives})_
 *
 * @param origin Origin to start from
 * @param tagName Tag name to match
 * @returns Found ancestor or `null`
 */
export function findAncestor<TagName extends keyof HTMLElementTagNameMap>(
	origin: FindAncestorOrigin,
	tagName: TagName,
): HTMLElementTagNameMap[TagName] | null;

/**
 * Find the closest ancestor element that matches the selector _(string or callback)_
 *
 * - If no match is found, `null` is returned
 * - _(If you want to search upwards, downwards, and sideways, use {@link findRelatives})_
 *
 * @param origin Origin to start from
 * @param selector Selector to match
 * @returns Found ancestor or `null`
 */
export function findAncestor(
	origin: Element | Event | EventTarget,
	selector: string | ((element: Element) => boolean),
): Element | null;

export function findAncestor(
	origin: Element | Event | EventTarget,
	selector: string | ((element: Element) => boolean),
): Element | null {
	const element = getElement(origin);

	if (element == null || selector == null) {
		return null;
	}

	if (typeof selector === 'string') {
		if (Element.prototype.matches.call(element, selector)) {
			return element;
		}

		return Element.prototype.closest.call(element, selector);
	}

	if (typeof selector !== 'function') {
		return null;
	}

	if (selector(element)) {
		return element;
	}

	let parent: Element | null = element.parentElement;

	while (parent != null && !selector(parent)) {
		if (parent === document.body) {
			return null;
		}

		parent = parent.parentElement;
	}

	return parent;
}

/**
 * Finds the closest elements to the origin element that matches the tag name
 *
 * Traverses up, down, and sideways in the _DOM_-tree. _(If you only want to traverse up, use {@link findAncestor})_
 *
 * @param origin Element to start from
 * @param tagName Tag name to match
 * @param context Context to search within
 * @returns Found elements
 */
export function findRelatives<TagName extends keyof HTMLElementTagNameMap>(
	origin: Element,
	tagName: TagName,
	context?: Document | Element,
): HTMLElementTagNameMap[TagName][];

/**
 * Finds the closest elements to the origin element that matches the selector
 *
 * Traverses up, down, and sideways in the _DOM_-tree. _(If you only want to traverse up, use {@link findAncestor})_
 *
 * @param origin Element to start from
 * @param selector Selector to match
 * @param context Context to search within
 * @returns Found elements
 */
export function findRelatives(
	origin: Element,
	selector: string,
	context?: Document | Element,
): Element[];

export function findRelatives(
	origin: Element,
	selector: string,
	context?: Document | Element,
): Element[] {
	if (!(origin instanceof Element) || typeof selector !== 'string') {
		return [];
	}

	const elements = [
		...(context instanceof Document || context instanceof Element
			? context
			: document
		).querySelectorAll(selector),
	];

	const {length} = elements;

	if (length < 2) {
		return elements.filter(element => element !== origin);
	}

	const distances = [];

	let minimum: number | undefined;

	for (let index = 0; index < length; index += 1) {
		const element = elements[index];
		const distance = getDistance(origin, element);

		if (distance > 0) {
			if (minimum == null || distance < minimum) {
				minimum = distance;
			}

			distances.push({
				distance,
				element,
			});
		}
	}

	return distances.filter(found => found.distance === minimum).map(found => found.element);
}

/**
 * Get the distance between two elements _(i.e., the amount of steps between them)_
 *
 * - Ancestors and descendants: the number of levels between them
 * - Other elements: the levels up to the closest shared ancestor, the number of siblings to step over at that level, and the levels down to the target
 *
 * @param origin Origin element
 * @param target Target element
 * @returns Distance between elements, or `-1` if distance cannot be calculated
 */
export function getDistance(origin: Element, target: Element): number {
	if (origin === target) {
		return 0;
	}

	if (origin.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_DISCONNECTED) {
		return -1;
	}

	if (target.contains(origin)) {
		return getLevels(origin, target);
	}

	if (origin.contains(target)) {
		return getLevels(target, origin);
	}

	let branch = origin;

	while (branch.parentElement != null && !branch.parentElement.contains(target)) {
		branch = branch.parentElement;
	}

	const {parentElement} = branch;

	// No shared ancestor element, e.g., top-level elements in a fragment
	if (parentElement == null) {
		return -1;
	}

	const children = [...parentElement.children];
	const other = children.find(child => child.contains(target)) as Element;

	return (
		getLevels(origin, branch) +
		getLevels(target, other) +
		Math.abs(children.indexOf(branch) - children.indexOf(other))
	);
}

function getElement(origin: unknown): Element | undefined {
	if (origin instanceof Element) {
		return origin;
	}

	return origin instanceof Event && origin.target instanceof Element ? origin.target : undefined;
}

/**
 * Get the number of levels from an element up to one of its ancestors _(or itself)_
 */
function getLevels(from: Element, ancestor: Element): number {
	let levels = 0;

	for (let current = from; current !== ancestor; current = current.parentElement as Element) {
		levels += 1;
	}

	return levels;
}

// #endregion
