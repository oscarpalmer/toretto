import type { HTMLOrSVGElement } from './models';
/**
 * Is the value a child node?
 */
export declare function isChildNode(value: unknown): value is ChildNode;
/**
 * - Is the value a child node?
 * - Ignores `DocumentType`-nodes
 */
export declare function isChildNode(value: unknown, ignoreDocumentType: true): value is ChildNode;
/**
 * Is the value an HTML or SVG element?
 */
export declare function isHTMLOrSVGElement(value: unknown): value is HTMLOrSVGElement;
/**
 * Is the node inside a document?
 */
export declare function isInDocument(node: Node): boolean;
/**
 * Is the node inside a specific document?
 */
export declare function isInDocument(node: Node, document: Document): boolean;
