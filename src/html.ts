import {type SanitizeOptions, sanitize} from './sanitize';

//

type Html = {
	/**
	 * Create nodes from an HTML string or a template element
	 * @param value HTML string or id for a template element
	 * @param sanitization Sanitization options
	 * @returns Created nodes
	 */
	(value: string, sanitization?: boolean | SanitizeOptions): Node[];

	/**
	 * Create nodes from a template element
	 * @param template Template element
	 * @param sanitization Sanitization options
	 * @returns Created nodes
	 */
	(
		template: HTMLTemplateElement,
		sanitization?: boolean | SanitizeOptions,
	): Node[];

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

//

function createTemplate(html: string): HTMLTemplateElement {
	const template = document.createElement('template');

	template.innerHTML = html;

	templates[html] = template;

	return template;
}

function getTemplate(value: string): HTMLTemplateElement | undefined {
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
		element instanceof HTMLTemplateElement ? element : createTemplate(value);

	templates[value] = template;

	return template;
}

const html = ((
	value: string | HTMLTemplateElement,
	sanitization?: boolean | SanitizeOptions,
): Node[] => {
	if (typeof value !== 'string' && !(value instanceof HTMLTemplateElement)) {
		return [];
	}

	let options: SanitizeOptions | undefined;

	if (sanitization == null || sanitization === true) {
		options = {};
	} else {
		options = sanitization === false ? undefined : sanitization;
	}

	const template =
		value instanceof HTMLTemplateElement ? value : getTemplate(value);

	if (template == null) {
		return [];
	}

	const cloned = template.content.cloneNode(true) as DocumentFragment;
	const scripts = cloned.querySelectorAll('script');
	const {length} = scripts;

	for (let index = 0; index < length; index += 1) {
		scripts[index].remove();
	}

	cloned.normalize();

	return options != null
		? sanitize([...cloned.childNodes], options)
		: [...cloned.childNodes];
}) as Html;

html.clear = (): void => {
	templates = {};
};

html.remove = (template: string): void => {
	if (typeof template === 'string') {
		templates[template] = undefined;
	}
};

//

const EXPRESSION_ID = /^[a-z][\w-]*$/i;

let templates: Record<string, HTMLTemplateElement | undefined> = {};

//

export {html};
