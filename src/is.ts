import type {HTMLOrSVGElement} from './models';

/**
 * Is the value a child node?
 * @param value Value to check
 * @returns `true` if it's a child node, otherwise `false`
 */
export function isChildNode(value: unknown): value is ChildNode {
	return value instanceof Node && childNodeTypes.has(value.nodeType);
}

/**
 * Is the value an event target?
 * @param value Value to check
 * @returns `true` if it's an event target, otherwise `false`
 */
export function isEventTarget(value: unknown): value is EventTarget {
	return (
		typeof value === 'object' &&
		value != null &&
		typeof (value as EventTarget).addEventListener === 'function' &&
		typeof (value as EventTarget).removeEventListener === 'function' &&
		typeof (value as EventTarget).dispatchEvent === 'function'
	);
}

/**
 * Is the value an HTML or SVG element?
 * @param value Value to check
 * @returns `true` if it's an HTML or SVG element, otherwise `false`
 */
export function isHTMLOrSVGElement(value: unknown): value is HTMLOrSVGElement {
	return value instanceof HTMLElement || value instanceof SVGElement;
}

/**
 * Is the node inside a document?
 * @param node Node to check
 * @returns `true` if it's inside a document, otherwise `false`
 */
export function isInDocument(node: Node): boolean;

/**
 * Is the node inside a specific document?
 * @param node Node to check
 * @param document Document to check within
 * @returns `true` if it's inside the document, otherwise `false`
 */
export function isInDocument(node: Node, document: Document): boolean;

export function isInDocument(node: Node, document?: Document): boolean {
	return node instanceof Node
		? document instanceof Document
			? node.ownerDocument == null
				? node === document
				: node.ownerDocument === document && document.contains(node)
			: (node.ownerDocument?.contains(node) ?? true)
		: false;
}

//

const childNodeTypes = new Set<unknown>([
	1, // Node.ELEMENT_NODE,
	3, // Node.TEXT_NODE,
	7, // Node.PROCESSING_INSTRUCTION_NODE,
	8, // Node.COMMENT_NODE,
	10, // Node.DOCUMENT_TYPE_NODE,
]);
