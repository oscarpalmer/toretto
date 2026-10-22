import type {AriaBooleanAttribute} from './index';

// #region Types

export type DispatchedAttributeName = 'checked' | 'open' | 'value';

export type ParsedAttributes<Keys extends string = string> = {
	[Key in Keys]: Key extends AriaBooleanAttribute
		? boolean | undefined
		: Key extends `data-${string}`
			? unknown
			: string | undefined;
};

export type UnparsedAttributes<Keys extends string = string> = {
	[Key in Keys]: Key extends AriaBooleanAttribute ? boolean | undefined : string | undefined;
};

// #endregion

// #region Variables

// Expressions via DOMPurify (https://github.com/cure53/dompurify)

export const ATTRIBUTE_DATA_PREFIX = 'data-';

export const ATTRIBUTE_EXPRESSION_CLOBBERED_NAME: RegExp = /^(id|name)$/i;

export const ATTRIBUTE_EXPRESSION_DATA_OR_SCRIPT: RegExp = /^(?:data|\w+script):/i;

export const ATTRIBUTE_EXPRESSION_EVENT_NAME: RegExp = /^on/i;

export const ATTRIBUTE_EXPRESSION_SKIP_NAME: RegExp = /^(aria-[-\w]+|data-[-\w.\u00B7-\uFFFF]+)$/i;

export const ATTRIBUTE_EXPRESSION_SOURCE_NAME: RegExp = /^src$/i;

export const ATTRIBUTE_EXPRESSION_SOURCE_VALUE: RegExp = /^data:/i;

export const ATTRIBUTE_EXPRESSION_URI_VALUE: RegExp =
	/^(?:(?:(?:f|ht)tps?|sftp|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i;

export const ATTRIBUTE_EXPRESSION_WHITESPACE: RegExp =
	// oxlint-disable-next-line no-control-regex
	/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g;

//

/**
 * List of boolean attributes
 */
export const booleanAttributes: readonly string[] = Object.freeze([
	'async',
	'autofocus',
	'autoplay',
	'checked',
	'controls',
	'default',
	'defer',
	'disabled',
	'formnovalidate',
	'hidden',
	'inert',
	'ismap',
	'itemscope',
	'loop',
	'multiple',
	'muted',
	'nomodule',
	'novalidate',
	'open',
	'playsinline',
	'readonly',
	'required',
	'reversed',
	'selected',
]);

export const booleanAttributesSet: Set<string> = new Set(booleanAttributes);

export const dispatchedAttributes: Set<string> = new Set(['checked', 'open', 'value']);

// #endregion
