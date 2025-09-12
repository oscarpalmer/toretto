import {isPlainObject} from '@oscarpalmer/atoms/is';
import {type SanitizeOptions, sanitize} from './sanitize';

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

	if (value in templates) {
		return templates[value];
	}

	let template: unknown;

	if (idPattern.test(value)) {
		template = document.querySelector(`#${value}`);
	}

	templates[value] =
		template instanceof HTMLTemplateElement ? template : createTemplate(value);

	return templates[value];
}

/**
 * Create nodes from an HTML string or a template element
 * @param value HTML string or id for a template element
 * @param sanitization Sanitization options
 * @returns Created nodes
 */
export function html(
	value: string,
	sanitization?: boolean | SanitizeOptions,
): Node[];

/**
 * Create nodes from a template element
 * @param template Template element
 * @param sanitization Sanitization options
 * @returns Created nodes
 */
export function html(
	template: HTMLTemplateElement,
	sanitization?: boolean | SanitizeOptions,
): Node[];

export function html(
	value: string | HTMLTemplateElement,
	sanitization?: boolean | SanitizeOptions,
): Node[] {
	if (typeof value !== 'string' && !(value instanceof HTMLTemplateElement)) {
		return [];
	}

	const options =
		sanitization == null || sanitization === true
			? {}
			: isPlainObject(sanitization)
				? {...sanitization}
				: null;

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
}

//

const idPattern = /^[a-z][\w-]*$/i;

const templates: Record<string, HTMLTemplateElement> = {};
