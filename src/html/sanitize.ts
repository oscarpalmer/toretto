import {setAttribute} from '../attribute/set';
import {
	_isBadAttribute,
	_isEmptyNonBooleanAttribute,
	_isInvalidBooleanAttribute,
} from '../internal/attribute';

function handleElement(element: Element, depth: number): void {
	if (depth === 0) {
		const removable = element.querySelectorAll(REMOVE_SELECTOR);

		for (const item of removable) {
			item.remove();
		}
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

		if (_isBadAttribute(name, value, false) || _isEmptyNonBooleanAttribute(name, value, false)) {
			element.removeAttribute(name);
		} else if (_isInvalidBooleanAttribute(name, value, false)) {
			setAttribute(element, name, true);
		}
	}
}

export function sanitizeNodes(nodes: Node[], depth: number): Node[] {
	const actual = nodes.filter(node => node instanceof Node);

	let {length} = nodes;

	for (let index = 0; index < length; index += 1) {
		const node = actual[index];

		let remove = isClobbered(node);

		if (!remove) {
			switch (node.nodeType) {
				case Node.ELEMENT_NODE:
					handleElement(node as Element, depth);
					break;

				case Node.COMMENT_NODE:
					remove = COMMENT_HARMFUL.test((node as Comment).data);
					break;

				case Node.DOCUMENT_TYPE_NODE:
				case Node.PROCESSING_INSTRUCTION_NODE:
					remove = true;
					break;
			}
		}

		if (remove) {
			removeNode(node);

			actual.splice(index, 1);

			index -= 1;
			length -= 1;

			continue;
		}

		if (node.hasChildNodes()) {
			sanitizeNodes([...node.childNodes], depth + 1);
		}
	}

	return nodes;
}

//

const COMMENT_HARMFUL = /<[/\w]/g;

const REMOVE_SELECTOR = 'script, toretto-temporary';
