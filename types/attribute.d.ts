import type { Attribute, HTMLOrSVGElement, Property } from './models';
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
export declare function setAttribute(element: HTMLOrSVGElement, attribute: Attribute): void;
/**
 * Set an attribute on an element  _(or remove it, if the value is `null` or `undefined`)_
 */
export declare function setAttribute(element: HTMLOrSVGElement, name: string, value?: unknown): void;
/**
 * Set one or more attributes on an element _(or remove them, if their value is `null` or `undefined`)_
 */
export declare function setAttributes(element: HTMLOrSVGElement, attributes: Attribute[]): void;
/**
 * Set one or more attributes on an element _(or remove them, if their value is `null` or `undefined`)_
 */
export declare function setAttributes(element: HTMLOrSVGElement, attributes: Record<string, unknown>): void;
/**
 * Set a property on an element _(or remove it, if the value is not an empty string or does not match the name)_
 */
export declare function setProperty(element: HTMLOrSVGElement, property: Property): void;
/**
 * Set a property on an element _(or remove it, if the value is not an empty string or does not match the name)_
 */
export declare function setProperty(element: HTMLOrSVGElement, name: string, value: boolean | string): void;
/**
 * Set one or more properties on an element _(or remove them, if their value is not an empty string or does not match the name)_
 */
export declare function setProperties(element: HTMLOrSVGElement, properties: Property[]): void;
/**
 * Set one or more properties on an element _(or remove them, if their value is not an empty string or does not match the name)_
 */
export declare function setProperties(element: HTMLOrSVGElement, properties: Record<string, unknown>): void;
