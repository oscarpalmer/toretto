import type {Primitive} from '@oscarpalmer/atoms/models';
import {setAttributes} from './attribute';
import {setStyles} from './style';
import {setProperties} from './property';

// #region Types

type Properties<Target extends Element> = {
	[Property in keyof Target]?: Target[Property] extends Primitive ? Target[Property] : never;
};

type Styles = Partial<Record<keyof CSSStyleDeclaration, unknown>>;

// #endregion

// #region Functions

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
): HTMLUnknownElement;

export function createElement(
	tag: string,
	properties?: Properties<HTMLElement>,
	attributes?: Record<string, unknown>,
	styles?: Styles,
): HTMLElement {
	if (typeof tag !== 'string') {
		throw new TypeError(MESSAGE);
	}

	const element = document.createElement(tag);

	if (properties != null) {
		setProperties(element, properties);
	}

	if (attributes != null) {
		setAttributes(element, attributes);
	}

	if (styles != null) {
		setStyles(element, styles);
	}

	return element;
}

// #endregion

// #region Variables

const MESSAGE = 'Tag name must be a string';

// #endregion
