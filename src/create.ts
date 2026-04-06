import type {Primitive} from '@oscarpalmer/atoms/models';
import {setAttributes} from './attribute';
import {setStyles} from './style';

type Properties<Element extends HTMLElement> = Partial<{
	[key in keyof Element]: Element[key] extends Primitive ? Element[key] : never;
}>;

type Styles = Partial<Record<keyof CSSStyleDeclaration, unknown>>;

/**
 * Creates an HTML element with the specified tag name together with optional properties, attributes, and styles
 * @param tag Tag name
 * @param properties Element properties
 * @param attributes Element attributes
 * @param styles Element styles
 * @returns Created element
 */
export function createElement<TagName extends keyof HTMLElementTagNameMap>(
	tag: TagName,
	properties?: Properties<HTMLElementTagNameMap[TagName]>,
	attributes?: Record<string, unknown>,
	styles?: Styles,
): HTMLElementTagNameMap[TagName];

/**
 * Creates an HTML element with the specified tag name together with optional properties, attributes, and styles
 * @param tag Tag name
 * @param properties Element properties
 * @param attributes Element attributes
 * @param styles Element styles
 * @returns Created element
 */
export function createElement(
	tag: string,
	properties?: Properties<HTMLElement>,
	attributes?: Record<string, unknown>,
	styles?: Styles,
): HTMLElement;

export function createElement(
	tag: string,
	properties?: Properties<HTMLElement>,
	attributes?: Record<string, unknown>,
	styles?: Styles,
): HTMLElement {
	const element = document.createElement(tag);

	if (properties != null) {
		Object.assign(element, properties);
	}

	if (attributes != null) {
		setAttributes(element, attributes);
	}

	if (styles != null) {
		setStyles(element, styles);
	}

	return element;
}
