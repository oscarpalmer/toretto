import type {HTMLOrSVGElement} from '~/models';

/**
 * Is the value a child node?
 */
export function isChildNode(value: unknown): value is ChildNode;

/**
 * - Is the value a child node?
 * - Ignores `DocumentType`-nodes
 */
export function isChildNode(
	value: unknown,
	ignoreDocumentType: true,
): value is ChildNode;

export function isChildNode(
	value: unknown,
	ignoreDocumentType?: boolean,
): value is ChildNode {
	return (
		value instanceof CharacterData ||
		(value instanceof DocumentType ? ignoreDocumentType !== true : false) ||
		value instanceof Element
	);
}

/**
 * Is the value an HTML or SVG element?
 */
export function isHTMLOrSVGElement(value: unknown): value is HTMLOrSVGElement {
	return value instanceof HTMLElement || value instanceof SVGElement;
}

/**
 * Is the node inside a document?
 */
export function isInDocument(node: Node): boolean;

/**
 * Is the node inside a specific document?
 */
export function isInDocument(node: Node, document: Document): boolean;

export function isInDocument(node: Node, document?: Document): boolean {
	return document == null
		? (node.ownerDocument?.contains(node) ?? true)
		: node.ownerDocument == null
			? node === document
			: node.ownerDocument === document && document.contains(node);
}
