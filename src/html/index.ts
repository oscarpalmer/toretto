import {isPlainObject} from '@oscarpalmer/atoms/is';
import {sanitizeNodes} from './sanitize';
import {SizedMap} from '@oscarpalmer/atoms/sized/map';
import {getString} from '@oscarpalmer/atoms/string';

//

type HtmlOptions = {
	/**
	 * Cache template element for the HTML string? _(defaults to `true`)_
	 */
	cache?: boolean;
};

type Options = Required<HtmlOptions>;

type Tagged = {
	nodes: Node[];
	template: string;
};

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
		templates.set(value, template);
	}

	return template;
}

function getComment(index: number): string {
	return COMMENT_TEMPLATE.replace(COMMENT_INDEX, String(index));
}

function getHtml(value: string | HTMLTemplateElement): string {
	return `${TEMPORARY_ELEMENT}${typeof value === 'string' ? value : value.innerHTML}${TEMPORARY_ELEMENT}`;
}

function getNodes(value: unknown, options: Options, nodes?: Node[]): Node[] {
	if (typeof value !== 'string' && !(value instanceof HTMLTemplateElement)) {
		return [];
	}

	const template = getTemplate(value, options);

	if (template == null) {
		return [];
	}

	const cloned = [...template.content.cloneNode(true).childNodes];

	if (nodes != null) {
		replaceComments(cloned, nodes);
	}

	return cloned;
}

function getOptions(input?: unknown): Options {
	const options = isPlainObject(input) ? input : {};

	options.cache = typeof options.cache === 'boolean' ? options.cache : true;

	return options as Options;
}

function getParser(): DOMParser {
	parser ??= new DOMParser();

	return parser;
}

function getTagged(strings: TemplateStringsArray, values: unknown[]): Tagged {
	const tagged: Tagged = {
		nodes: [],
		template: '',
	};

	const stringsLength = strings.length;

	let nodeIndex = 0;

	for (let stringIndex = 0; stringIndex < stringsLength; stringIndex += 1) {
		const value = values[stringIndex];

		tagged.template += strings[stringIndex];

		if (value instanceof Node) {
			tagged.nodes.push(value);

			tagged.template += getComment(nodeIndex);

			nodeIndex += 1;
		} else if (hasNodes(value)) {
			const items = [...value];
			const itemsLength = items.length;

			for (let itemIndex = 0; itemIndex < itemsLength; itemIndex += 1) {
				const item = items[itemIndex];

				if (item instanceof Node) {
					tagged.nodes.push(item);

					tagged.template += getComment(nodeIndex);

					nodeIndex += 1;
				} else {
					tagged.template += getString(item);
				}
			}
		} else {
			tagged.template += getString(value);
		}
	}

	return tagged;
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

	let template = templates.get(value);

	if (template != null) {
		return template;
	}

	const element = EXPRESSION_ID.test(value) ? document.querySelector(`#${value}`) : null;

	return createTemplate(element instanceof HTMLTemplateElement ? element : value, options);
}

function hasNodes(value: unknown): value is HTMLCollection | NodeList | Node[] {
	if (value instanceof HTMLCollection || value instanceof NodeList) {
		return true;
	}

	return Array.isArray(value) && value.some(item => item instanceof Node);
}

/**
 * Create nodes from a template string
 * @returns Created nodes
 */
export function html(strings: TemplateStringsArray, ...values: unknown[]): Node[];

/**
 * Create nodes from an HTML string or a template element
 * @param value HTML string or id for a template element
 * @param options Options for creating nodes
 * @returns Created nodes
 */
export function html(value: string, options?: HtmlOptions): Node[];

/**
 * Create nodes from a template element
 * @param template Template element
 * @param options Options for creating nodes
 * @returns Created nodes
 */
export function html(template: HTMLTemplateElement, options?: HtmlOptions): Node[];

export function html(first: unknown, ...second: unknown[]): Node[] {
	if (isTagged(first)) {
		const tagged = getTagged(first, second);

		return getNodes(tagged.template, getOptions(), tagged.nodes);
	}

	return getNodes(first, getOptions(second[0]));
}

/**
 * Clear cache of template elements
 */
html.clear = (): void => {
	templates.clear();
};

/**
 * Remove cached template element for an HTML string or id
 * @param template HTML string or id for a template element
 */
html.remove = (template: string): void => {
	templates.delete(template);
};

function isTagged(value: unknown): value is TemplateStringsArray {
	return Array.isArray(value) && Array.isArray((value as unknown as TemplateStringsArray).raw);
}

function replaceComments(origin: NodeList | Node[], replacements: Node[]): void {
	const nodes = [...origin];
	const {length} = nodes;

	for (let nodeIndex = 0; nodeIndex < length; nodeIndex += 1) {
		const node = nodes[nodeIndex];

		if (node instanceof Comment) {
			const [, index] = EXPRESSION_COMMENT.exec(node.textContent ?? '') ?? [];

			if (index != null) {
				node.replaceWith(replacements[Number(index)]);
			}

			continue;
		}

		if (node.hasChildNodes()) {
			replaceComments(node.childNodes, replacements);
		}
	}
}

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

const COMMENT_INDEX = '<index>';

const COMMENT_TEMPLATE = `<!--toretto.node:${COMMENT_INDEX}-->`;

const EXPRESSION_COMMENT = /^toretto\.node:(\d+)$/;

const EXPRESSION_ID = /^[a-z][\w-]*$/i;

const PARSE_TYPE_HTML = 'text/html';

const TEMPLATE_TAG = 'template';

const TEMPORARY_ELEMENT = '<toretto-temporary></toretto-temporary>';

const templates = new SizedMap<string, HTMLTemplateElement>(128);

let parser: DOMParser;

// @ts-expect-error debug
window.templates = templates;
