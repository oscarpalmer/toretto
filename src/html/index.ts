import {isPlainObject} from '@oscarpalmer/atoms/is';
import {sanitizeNodes} from './sanitize';

//

type Html = {
	/**
	 * Create nodes from an HTML string or a template element
	 * @param value HTML string or id for a template element
	 * @param options Options for creating nodes
	 * @returns Created nodes
	 */
	(value: string, options?: HtmlOptions): Node[];

	/**
	 * Create nodes from a template element
	 * @param template Template element
	 * @param options Options for creating nodes
	 * @returns Created nodes
	 */
	(template: HTMLTemplateElement, options?: HtmlOptions): Node[];

	/**
	 * Clear cache of template elements
	 */
	clear(): void;

	/**
	 * Remove cached template element for an HTML string or id
	 * @param template HTML string or id for a template element
	 */
	remove(template: string): void;
};

type HtmlOptions = {
	/**
	 * Cache template element for the HTML string? _(defaults to `true`)_
	 */
	cache?: boolean;
};

type Options = Required<HtmlOptions>;

//

function createHtml(value: string | HTMLTemplateElement): string {
	const parsed = getParser().parseFromString(getHtml(value), PARSE_TYPE_HTML);

	parsed.body.normalize();

	sanitizeNodes([parsed.body], 0);

	return parsed.body.innerHTML;
}

function createTemplate(
	value: string | HTMLTemplateElement,
	options: Options,
): HTMLTemplateElement {
	const template = document.createElement(TEMPLATE_TAG);

	template.innerHTML = createHtml(value);

	if (typeof value === 'string' && options.cache) {
		templates[value] = template;
	}

	return template;
}

function getHtml(value: string | HTMLTemplateElement): string {
	return `${TEMPORARY_ELEMENT}${typeof value === 'string' ? value : value.innerHTML}${TEMPORARY_ELEMENT}`;
}

function getNodes(value: string | HTMLTemplateElement, options: Options): Node[] {
	if (typeof value !== 'string' && !(value instanceof HTMLTemplateElement)) {
		return [];
	}

	const template = getTemplate(value, options);

	return template == null ? [] : [...template.content.cloneNode(true).childNodes];
}

function getOptions(input?: HtmlOptions): Options {
	const options = isPlainObject(input) ? input : {};

	options.cache = typeof options.cache === 'boolean' ? options.cache : true;

	return options as Options;
}

function getParser(): DOMParser {
	parser ??= new DOMParser();

	return parser;
}

function getTemplate(
	value: string | HTMLTemplateElement,
	options: Options,
): HTMLTemplateElement | undefined {
	if (value instanceof HTMLTemplateElement) {
		return createTemplate(value, options);
	}

	if (value.trim().length === 0) {
		return;
	}

	let template = templates[value];

	if (template != null) {
		return template;
	}

	const element = EXPRESSION_ID.test(value) ? document.querySelector(`#${value}`) : null;

	return createTemplate(element instanceof HTMLTemplateElement ? element : value, options);
}

const html = ((value: string | HTMLTemplateElement, options?: Options): Node[] => {
	return getNodes(value, getOptions(options));
}) as Html;

html.clear = (): void => {
	templates = {};
};

html.remove = (template: string): void => {
	if (typeof template !== 'string' || templates[template] == null) {
		return;
	}

	const keys = Object.keys(templates);
	const {length} = keys;

	const updated: Record<string, HTMLTemplateElement> = {};

	for (let index = 0; index < length; index += 1) {
		const key = keys[index];

		if (key !== template) {
			updated[key] = templates[key];
		}
	}

	templates = updated;
};

/**
 * Sanitize one or more nodes, recursively
 * @param value Node or nodes to sanitize
 * @param options Sanitization options
 * @returns Sanitized nodes
 */
export function sanitize(value: Node | Node[]): Node[] {
	return sanitizeNodes(Array.isArray(value) ? value : [value], 0);
}

//

const EXPRESSION_ID = /^[a-z][\w-]*$/i;

const PARSE_TYPE_HTML = 'text/html';

const TEMPLATE_TAG = 'template';

const TEMPORARY_ELEMENT = '<toretto-temporary></toretto-temporary>';

let parser: DOMParser;

let templates: Record<string, HTMLTemplateElement> = {};

//

export {html};
