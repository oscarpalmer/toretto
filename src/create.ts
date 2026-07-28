import {isPlainObject} from '@oscarpalmer/atoms/is';
import type {Primitive} from '@oscarpalmer/atoms/models';
import {setAria} from './aria';
import {setAttributes} from './attribute';
import {setData} from './data';
import type {AnyAriaAttribute, AnyAriaBooleanAttribute, CSSValues} from './models';
import {setProperties} from './property';
import {setStyles} from './style';

// #region Types

type CreateElementValues<Target extends Element> = {
	aria?: CreateElementValuesAria;
	attribute?: Record<string, unknown>;
	data?: Record<string, unknown>;
	property?: CreateElementValuesProperties<Target>;
	style?: Partial<CSSValues>;
};

type CreateElementValuesAria = {
	[Key in AnyAriaAttribute]?: Key extends AnyAriaBooleanAttribute ? boolean | string : string;
};

type CreateElementValuesProperties<Target extends Element> = {
	[Property in keyof Target]?: Target[Property] extends Primitive ? Target[Property] : never;
};

// #endregion

// #region Functions

/**
 * Creates an _HTML_ element with the specified tag name together with optional properties, attributes, and styles
 *
 * @param tag Tag name
 * @param values Element values
 * @returns Created element
 */
export function createElement<TagName extends keyof HTMLElementTagNameMap>(
	tag: TagName,
	values?: CreateElementValues<HTMLElementTagNameMap[TagName]>,
): HTMLElementTagNameMap[TagName];

/**
 * Creates an _HTML_ element with the specified tag name together with optional properties, attributes, and styles
 *
 * @param tag Tag name
 * @param values Element values
 * @returns Created element
 */
export function createElement(
	tag: string,
	values?: CreateElementValues<HTMLElement>,
): HTMLUnknownElement;

export function createElement(tag: string, values?: CreateElementValues<HTMLElement>): HTMLElement {
	if (typeof tag !== 'string') {
		throw new TypeError(MESSAGE);
	}

	const element = document.createElement(tag);

	const {aria, attribute, data, property, style} = getElementValues<HTMLElement>(values);

	setAria(element, aria ?? {});
	setAttributes(element, attribute ?? {});
	setData(element, data ?? {});
	setProperties(element, property ?? {});
	setStyles(element, style ?? {});

	return element;
}

function getElementValues<Target extends Element>(input?: unknown): CreateElementValues<Target> {
	if (!isPlainObject(input)) {
		return {};
	}

	return {
		aria: isPlainObject(input.aria) ? input.aria : undefined,
		attribute: isPlainObject(input.attribute)
			? (input.attribute as Record<string, unknown>)
			: undefined,
		data: isPlainObject(input.data) ? input.data : undefined,
		property: isPlainObject(input.property)
			? (input.property as CreateElementValuesProperties<Target>)
			: undefined,
		style: isPlainObject(input.style) ? input.style : undefined,
	};
}

// #endregion

// #region Variables

const MESSAGE = 'Tag name must be a string';

// #endregion
