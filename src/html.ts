import {isPlainObject} from '@oscarpalmer/atoms/is';
import {type SanitiseOptions, sanitise} from './sanitise';

const idPattern = /^[a-z][\w-]*$/i;
const templates: Record<string, HTMLTemplateElement> = {};

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
 * - Create nodes from a string of _HTML_ or a template element
 * - If `value` looks like an _ID_, it will be treated as an _ID_ before falling back to being treated as _HTML_
 * - If `sanitisation` is not provided, `true`, or an options object, bad markup will be sanitised or removed
 * - Regardless of the value of `sanitisation`, script tags will always be removed
 */
export function html(
	value: string,
	sanitisation?: boolean | SanitiseOptions,
): Node[];

/**
 * - Create nodes from a template element
 * - If `sanitisation` is not provided, `true`, or an options object, bad markup will be sanitised or removed
 * - Regardless of the value of `sanitisation`, script tags will always be removed
 */
export function html(
	value: HTMLTemplateElement,
	sanitisation?: boolean | SanitiseOptions,
): Node[];

export function html(
	value: string | HTMLTemplateElement,
	sanitisation?: boolean | SanitiseOptions,
): Node[] {
	if (typeof value !== 'string' && !(value instanceof HTMLTemplateElement)) {
		return [];
	}

	const options =
		sanitisation == null || sanitisation === true
			? {}
			: isPlainObject(sanitisation)
				? {...sanitisation}
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
		? sanitise([...cloned.childNodes], options)
		: [...cloned.childNodes];
}
