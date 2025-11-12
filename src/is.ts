/**
 * Is the value a child node?
 * @param value Value to check
 * @returns `true` if it's a child node, otherwise `false`
 */
export function isChildNode(value: unknown): value is ChildNode {
	return value instanceof Node && CHILD_NODE_TYPES.has(value.nodeType);
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
	if (!(node instanceof Node)) {
		return false;
	}

	if (!(document instanceof Document)) {
		return node.ownerDocument?.contains(node) ?? true;
	}

	return node.ownerDocument == null
		? node === document
		: node.ownerDocument === document && document.contains(node);
}

//

const CHILD_NODE_TYPES: Set<number> = new Set([
	Node.ELEMENT_NODE,
	Node.TEXT_NODE,
	Node.PROCESSING_INSTRUCTION_NODE,
	Node.COMMENT_NODE,
	Node.DOCUMENT_TYPE_NODE,
]);

//

export {isEventTarget, isHTMLOrSVGElement} from './internal/is'
