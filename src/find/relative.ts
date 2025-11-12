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
 * Find the closest ancestor element that matches the selector _(string or callback)_
 *
 * - If no match is found, `null` is returned
 * - _(If you want to search upwards, downwards, and sideways, use {@link findRelatives})_
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
 * Finds the closest elements to the origin element that matches the selector
 *
 * - Traverses up, down, and sideways in the _DOM_-tree
 * - _(If you only want to traverse up, use {@link findAncestor})_
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

	if (length === 1) {
		return [elements[0]];
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
