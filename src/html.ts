import {isPlainObject} from '@oscarpalmer/atoms/is';
import {
	type SanitizeOptions,
	getSanitizeOptions,
	sanitizeNodes,
} from './internal/sanitize';

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
	 * Ignore caching the template element for the HTML string? _(defaults to `false`)_
	 */
	ignoreCache?: boolean;
} & SanitizeOptions;

type Options = Required<HtmlOptions>;

//

function createTemplate(html: string, ignore: boolean): HTMLTemplateElement {
	const template = document.createElement('template');

	template.innerHTML = html;

	if (!ignore) {
		templates[html] = template;
	}

	return template;
}

function getHtml(
	value: string | HTMLTemplateElement,
	options: Options,
): Node[] {
	if (typeof value !== 'string' && !(value instanceof HTMLTemplateElement)) {
		return [];
	}

	const template =
		value instanceof HTMLTemplateElement
			? value
			: getTemplate(value, options.ignoreCache);

	if (template == null) {
		return [];
	}

	const cloned = template.content.cloneNode(true) as DocumentFragment;

	const scripts = cloned.querySelectorAll('script');

	for (const script of scripts) {
		script.remove();
	}

	cloned.normalize();

	return sanitizeNodes([...cloned.childNodes], options);
}

function getOptions(input?: HtmlOptions): Options {
	const options = isPlainObject(input) ? input : {};

	options.ignoreCache =
		typeof options.ignoreCache === 'boolean' ? options.ignoreCache : false;

	options.sanitizeBooleanAttributes =
		typeof options.sanitizeBooleanAttributes === 'boolean'
			? options.sanitizeBooleanAttributes
			: true;

	return options as Options;
}

function getTemplate(
	value: string,
	ignore: boolean,
): HTMLTemplateElement | undefined {
	if (typeof value !== 'string' || value.trim().length === 0) {
		return;
	}

	let template = templates[value];

	if (template != null) {
		return template;
	}

	const element = EXPRESSION_ID.test(value)
		? document.querySelector(`#${value}`)
		: null;

	template =
		element instanceof HTMLTemplateElement
			? element
			: createTemplate(value, ignore);

	return template;
}

const html = ((
	value: string | HTMLTemplateElement,
	options?: Options,
): Node[] => {
	return getHtml(value, getOptions(options));
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
export function sanitize(
	value: Node | Node[],
	options?: SanitizeOptions,
): Node[] {
	return sanitizeNodes(
		Array.isArray(value) ? value : [value],
		getSanitizeOptions(options),
	);
}

//

const EXPRESSION_ID = /^[a-z][\w-]*$/i;

let templates: Record<string, HTMLTemplateElement> = {};

//

export {html};
