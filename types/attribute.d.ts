import type { Attribute } from './models';
/**
 * List of boolean attributes
 */
export declare const booleanAttributes: readonly string[];
/**
 * Is the attribute considered bad and potentially harmful?
 */
export declare function isBadAttribute(attribute: Attribute<string>): boolean;
/**
 * Is the attribute a boolean attribute?
 */
export declare function isBooleanAttribute(name: string): boolean;
/**
 * Is the attribute empty and not a boolean attribute?
 */
export declare function isEmptyNonBooleanAttribute(attribute: Attribute<string>): boolean;
/**
 * - Is the attribute an invalid boolean attribute?
 * - I.e., its value is not empty or the same as its name?
 */
export declare function isInvalidBooleanAttribute(attribute: Attribute<string>): boolean;
/**
 * Set an attribute on an element  _(or remove it, if the value is `null` or `undefined`)_
 */
export declare function setAttribute(element: Element, attribute: Attribute): void;
/**
 * Set an attribute on an element  _(or remove it, if the value is `null` or `undefined`)_
 */
export declare function setAttribute(element: Element, name: string, value?: unknown): void;
/**
 * Set one or more attributes on an element  _(or remove them, if their value is `null` or `undefined`)_
 */
export declare function setAttributes(element: Element, attributes: Attribute[]): void;
/**
 * Set one or more attributes on an element  _(or remove them, if their value is `null` or `undefined`)_
 */
export declare function setAttributes(element: Element, attributes: Record<string, unknown>): void;
