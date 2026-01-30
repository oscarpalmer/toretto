/**
 * Find the closest ancestor element that matches the tag name
 *
 * - If no match is found, `null` is returned
 * - _(If you want to search upwards, downwards, and sideways, use {@link findRelatives})_
 * @param origin Origin to start from
 * @param tagName Tag name to match
 * @returns Found ancestor or `null`
 */
export function findAncestor<TagName extends keyof HTMLElementTagNameMap>(
	origin: Element | Event | EventTarget,
	tagName: TagName,
): HTMLElementTagNameMap[TagName] | null;

/**
 * Find the closest ancestor element that matches the selector _(string or callback)_
 *
 * - If no match is found, `null` is returned
 * - _(If you want to search upwards, downwards, and sideways, use {@link findRelatives})_
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
 * Get the distance between two elements _(i.e., the amount of nodes of between them)_
 * @param origin Origin element
 * @param target Target element
 * @returns Distance between elements, or `-1` if distance cannot be calculated
 */
export function getDistance(origin: Element, target: Element): number {
	if (origin === target) {
		return 0;
	}

	if (origin.parentElement === target || target.parentElement === origin) {
		return 1;
	}

	if (origin.parentElement != null && origin.parentElement === target.parentElement) {
		const children = [...origin.parentElement.children];

		return Math.abs(children.indexOf(origin) - children.indexOf(target));
	}

	const comparison = origin.compareDocumentPosition(target);

	if (comparison & Node.DOCUMENT_POSITION_DISCONNECTED) {
		return -1;
	}

	const preceding = comparison & Node.DOCUMENT_POSITION_PRECEDING;

	return traverse(preceding ? origin : target, preceding ? target : origin) ?? -1;
}

function getElement(origin: unknown): Element | undefined {
	if (origin instanceof Element) {
		return origin;
	}

	return origin instanceof Event && origin.target instanceof Element ? origin.target : undefined;
}

function traverse(from: Element, to: Element): number | undefined {
	let current = from;
	let distance = 0;
	let parent: Element | null = from.parentElement;

	while (parent != null) {
		if (parent === to) {
			return distance + 1;
		}

		const children = [...parent.children];

		if (to.parentElement === parent) {
			return distance + Math.abs(children.indexOf(current) - children.indexOf(to));
		}

		const index = children.findIndex(child => child.contains(to));

		if (index > -1) {
			const traversed = traverse(current, children[index]);

			return traversed == null || traversed === -1
				? -1
				: distance + Math.abs(index - children.indexOf(current)) + traversed;
		}

		current = parent;
		distance += 1;
		parent = parent.parentElement;
	}
}
