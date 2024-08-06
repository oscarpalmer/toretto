import type { Selector } from './models';
/**
 * - Find the closest ancestor element that matches the selector
 * - Matches may be found by a query string or a callback
 * - If no match is found, `null` is returned
 * - _(If you want to search upwards, downwards, and sideways, use `findRelative`)_
 */
export declare function findAncestor(origin: Element, selector: string | ((element: Element) => boolean)): Element | null;
/**
 * - Find the first element that matches the selector
 * - `context` is optional and defaults to `document`
 */
export declare function findElement(selector: string, context?: Selector): Element | undefined;
/**
 * - Find elements that match the selector
 * - If `selector` is a node or a list of nodes, they are filtered and returned
 * - `context` is optional and defaults to `document`
 */
export declare function findElements(selector: Selector, context?: Selector): Element[];
/**
 * - Finds the closest elements to the origin element that matches the selector
 * - Traverses up, down, and sideways in the _DOM_-tree
 * - _(If you only want to traverse up, use `findAncestor`)_
 */
export declare function findRelatives(origin: Element, selector: string, context?: Document | Element): Element[];
/**
 * - Get the most specific element under the pointer
 * - Ignores elements with `pointer-events: none` and `visibility: hidden`
 * - If `skipIgnore` is `true`, no elements are ignored
 */
export declare function getElementUnderPointer(skipIgnore?: boolean): Element | undefined;
export { findElement as $, findElements as $$ };
