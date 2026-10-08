import {IS_CHILDNODES} from './models/misc.model';

// #region Functions

/**
 * Is the value a child node?
 *
 * @param value Value to check
 * @returns `true` if it's a child node, otherwise `false`
 */
export function isChildNode(value: unknown): value is ChildNode {
	return value instanceof Node && IS_CHILDNODES.has(value.nodeType);
}

/**
 * Is the node inside a document?
 *
 * @param node Node to check
 * @returns `true` if it's inside a document, otherwise `false`
 */
export function isInDocument(node: Node): boolean;

/**
 * Is the node inside a specific document?
 *
 * @param node Node to check
 * @param document Document to check within
 * @returns `true` if it's inside the document, otherwise `false`
 */
export function isInDocument(node: Node, document: Document): boolean;

export function isInDocument(node: Node, doc?: Document): boolean {
	if (!(node instanceof Node)) {
		return false;
	}

	if (!(doc instanceof Document)) {
		return node.ownerDocument?.contains(node) ?? true;
	}

	return node.ownerDocument == null
		? node === doc
		: node.ownerDocument === doc && doc.contains(node);
}

// #endregion

// #region Exports

export {isEventPosition, isEventTarget, isHTMLOrSVGElement, isInputElement} from './internal/is';

// #endregion
