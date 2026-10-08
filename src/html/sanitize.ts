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

function removeNode(node: Node): void {
	if (typeof (node as ChildNode).remove === 'function') {
		(node as ChildNode).remove();
	}
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

		let remove = isClobbered(node);

		if (!remove) {
			switch (node.nodeType) {
				case Node.ELEMENT_NODE:
					handleElement(node as Element);
					break;

				case Node.COMMENT_NODE:
					remove = HTML_COMMENT_HARMFUL.test((node as Comment).data);
					break;

				case Node.DOCUMENT_TYPE_NODE:
				case Node.PROCESSING_INSTRUCTION_NODE:
					remove = true;
					break;

				default:
					break;
			}
		}

		if (remove) {
			removeNode(node);

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
