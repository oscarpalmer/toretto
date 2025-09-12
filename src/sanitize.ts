import {isPlainObject} from '@oscarpalmer/atoms/is';
import {
	isBadAttribute,
	isEmptyNonBooleanAttribute,
	isInvalidBooleanAttribute,
} from './attribute';

type Options = Required<SanitizeOptions>;

export type SanitizeOptions = {
	/**
	 * - Sanitize boolean attributes? _(Defaults to `true`)_
	 * - E.g. `checked="abc"` => `checked=""`
	 */
	sanitizeBooleanAttributes?: boolean;
};

function getOptions(input?: SanitizeOptions): Options {
	const options = isPlainObject(input) ? input : {};

	options.sanitizeBooleanAttributes =
		typeof options.sanitizeBooleanAttributes === 'boolean'
			? options.sanitizeBooleanAttributes
			: true;

	return options as Options;
}

/**
 * Sanitize one or more nodes, recursively
 * @param value Node or nodes to sanitize
 * @param options Sanitization options
 * @returns Sanitized nodes
 */
export function sanitize(
	value: Node | Node[],
	options?: Partial<SanitizeOptions>,
): Node[] {
	return sanitizeNodes(
		Array.isArray(value) ? value : [value],
		getOptions(options),
	);
}

function sanitizeAttributes(
	element: Element,
	attributes: Attr[],
	options: SanitizeOptions,
): void {
	const {length} = attributes;

	for (let index = 0; index < length; index += 1) {
		const attribute = attributes[index];

		if (isBadAttribute(attribute) || isEmptyNonBooleanAttribute(attribute)) {
			element.removeAttribute(attribute.name);
		} else if (
			options.sanitizeBooleanAttributes &&
			isInvalidBooleanAttribute(attribute)
		) {
			element.setAttribute(attribute.name, '');
		}
	}
}

function sanitizeNodes(nodes: Node[], options: SanitizeOptions): Node[] {
	const actual = nodes.filter(node => node instanceof Node);
	const {length} = nodes;

	for (let index = 0; index < length; index += 1) {
		const node = actual[index];

		if (node instanceof Element) {
			sanitizeAttributes(node, [...node.attributes], options);
		}

		if (node.hasChildNodes()) {
			sanitizeNodes([...node.childNodes], options);
		}
	}

	return nodes;
}
