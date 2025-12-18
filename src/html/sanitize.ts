import {
	isBadAttribute,
	isEmptyNonBooleanAttribute,
	isInvalidBooleanAttribute,
} from '../internal/attribute';

function handleElement(element: Element, depth: number): boolean {
	if (isClobbered(element)) {
		element.remove();

		return true;
	}

	if (depth === 0) {
		const scripts = element.querySelectorAll('script');

		for (const script of scripts) {
			script.remove();
		}
	}

	sanitizeAttributes(element, [...element.attributes]);

	return false;
}

/**
 * Is the element clobbered?
 *
 * Thanks, DOMPurify _(https://github.com/cure53/DOMPurify)_
 */
function isClobbered(element: Element): boolean {
	return (
		element instanceof HTMLFormElement &&
		(typeof element.nodeName !== 'string' ||
			typeof element.textContent !== 'string' ||
			typeof element.removeChild !== 'function' ||
			!(element.attributes instanceof NamedNodeMap) ||
			typeof element.removeAttribute !== 'function' ||
			typeof element.setAttribute !== 'function' ||
			typeof element.namespaceURI !== 'string' ||
			typeof element.insertBefore !== 'function' ||
			typeof element.hasChildNodes !== 'function')
	);
}

export function sanitizeAttributes(element: Element, attributes: Attr[]): void {
	const {length} = attributes;

	for (let index = 0; index < length; index += 1) {
		const {name, value} = attributes[index];

		if (isBadAttribute(name, value, false) || isEmptyNonBooleanAttribute(name, value, false)) {
			element.removeAttribute(name);
		} else if (isInvalidBooleanAttribute(name, value, false)) {
			element.setAttribute(name, '');
		}
	}
}

export function sanitizeNodes(nodes: Node[], depth: number): Node[] {
	const actual = nodes.filter(node => node instanceof Node);
	let {length} = nodes;

	for (let index = 0; index < length; index += 1) {
		const node = actual[index];

		if (node instanceof Element && handleElement(node, depth)) {
			actual.splice(index, 1);

			length -= 1;
			index -= 1;

			continue;
		}

		if (node.hasChildNodes()) {
			sanitizeNodes([...node.childNodes], depth + 1);
		}
	}

	return nodes;
}
