import {setAttribute} from '../attribute/set.attribute';
import {_isBadAttribute, _isInvalidBooleanAttribute} from '../internal/attribute';
import {HTML_COMMENT_HARMFUL, HTML_REMOVE_SELECTOR} from '../models/html.model';

// #region Functions

function handleElement(element: Element): void {
	const removable = [...element.querySelectorAll(HTML_REMOVE_SELECTOR)];
	const {length} = removable;

	for (let index = 0; index < length; index += 1) {
		removable[index].remove();
	}

	sanitizeAttributes(element, [...element.attributes]);
}

function handleNode(node: Node): boolean {
	if (node.nodeType === Node.ELEMENT_NODE) {
		handleElement(node as Element);

		return false;
	}

	if (node.nodeType === Node.COMMENT_NODE) {
		return HTML_COMMENT_HARMFUL.test((node as Comment).data);
	}

	return (
		node.nodeType === Node.DOCUMENT_TYPE_NODE || node.nodeType === Node.PROCESSING_INSTRUCTION_NODE
	);
}

/**
 * Is the element clobbered?
 *
 * Thanks, DOMPurify _(https://github.com/cure53/DOMPurify)_
 */
function isClobbered(value: unknown): boolean {
	return (
		value instanceof HTMLFormElement &&
		(typeof value.nodeName !== 'string' ||
			typeof value.textContent !== 'string' ||
			typeof value.removeChild !== 'function' ||
			!(value.attributes instanceof NamedNodeMap) ||
			typeof value.removeAttribute !== 'function' ||
			typeof value.setAttribute !== 'function' ||
			typeof value.namespaceURI !== 'string' ||
			typeof value.insertBefore !== 'function' ||
			typeof value.hasChildNodes !== 'function')
	);
}

export function sanitizeAttributes(element: Element, attributes: Attr[]): void {
	const {length} = attributes;

	for (let index = 0; index < length; index += 1) {
		const {name, value} = attributes[index];

		if (_isBadAttribute(name, value, false)) {
			element.removeAttribute(name);
		} else if (_isInvalidBooleanAttribute(name, value, false)) {
			setAttribute(element, name, true);
		}
	}
}

export function sanitizeNodes(nodes: Node[] | NodeList): Node[] {
	const actual: Node[] = [];

	let {length} = nodes;

	for (let index = 0; index < length; index += 1) {
		const node = nodes[index];

		const remove = isClobbered(node) || handleNode(node);

		if (remove) {
			node.parentNode?.removeChild(node);

			continue;
		}

		if (node.hasChildNodes()) {
			sanitizeNodes(node.childNodes);
		}

		actual.push(node);
	}

	return actual;
}

// #endregion
