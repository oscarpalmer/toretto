import {
	isBadAttribute as internalIsBadAttribute,
	isBooleanAttribute as _isBooleanAttribute,
	isEmptyNonBooleanAttribute as _isEmptyNonBooleanAttribute,
	isInvalidBooleanAttribute as _isInvalidBooleanAttribute,
} from '../internal/attribute';
import type {Attribute} from '../models';

/**
 * Is the attribute considered bad and potentially harmful?
 * @param attribute Attribute to check
 * @returns `true` if attribute is considered bad
 */
export function isBadAttribute(attribute: Attr | Attribute): boolean;

/**
 * Is the attribute considered bad and potentially harmful?
 * @param name Attribute name
 * @param value Attribute value
 * @returns `true` if attribute is considered bad
 */
export function isBadAttribute(name: string, value: string): boolean;

export function isBadAttribute(first: unknown, second?: unknown): boolean {
	return internalIsBadAttribute(first, second, true);
}

/**
 * Is the attribute a boolean attribute?
 * @param name Attribute to check
 * @returns `true` if attribute is a boolean attribute
 */
export function isBooleanAttribute(attribute: Attr | Attribute): boolean;

/**
 * Is the attribute a boolean attribute?
 * @param name Attribute name
 * @returns `true` if attribute is a boolean attribute
 */
export function isBooleanAttribute(name: string): boolean;

export function isBooleanAttribute(first: unknown): boolean {
	return _isBooleanAttribute(first, true);
}

/**
 * Is the attribute empty and not a boolean attribute?
 * @param attribute Attribute to check
 * @returns `true` if attribute is empty and not a boolean attribute
 */
export function isEmptyNonBooleanAttribute(attribute: Attr | Attribute): boolean;

/**
 * Is the attribute empty and not a boolean attribute?
 * @param name Attribute name
 * @param value Attribute value
 * @returns `true` if attribute is empty and not a boolean attribute
 */
export function isEmptyNonBooleanAttribute(name: string, value: string): boolean;

export function isEmptyNonBooleanAttribute(first: unknown, second?: unknown): boolean {
	return _isEmptyNonBooleanAttribute(first, second, true);
}

/**
 * Is the attribute an invalid boolean attribute?
 *
 * _(I.e., its value is not empty or the same as its name)_
 * @param attribute Attribute to check
 * @returns `true` if attribute is an invalid boolean attribute
 */
export function isInvalidBooleanAttribute(attribute: Attr | Attribute): boolean;

/**
 * Is the attribute an invalid boolean attribute?
 *
 * _(I.e., its value is not empty or the same as its name)_
 * @param name Attribute name
 * @param value Attribute value
 * @returns `true` if attribute is an invalid boolean attribute
 */
export function isInvalidBooleanAttribute(name: string, value: string): boolean;

export function isInvalidBooleanAttribute(first: unknown, second?: unknown): boolean {
	return _isInvalidBooleanAttribute(first, second, true);
}

export {booleanAttributes} from '../internal/attribute';
export * from './get';
export * from './set';
