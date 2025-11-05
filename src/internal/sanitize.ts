import {isPlainObject} from '@oscarpalmer/atoms/is';
import {
	isBadAttribute,
	isEmptyNonBooleanAttribute,
	isInvalidBooleanAttribute,
} from '../attribute';

//

type Options = Required<SanitizeOptions>;

export type SanitizeOptions = {
	/**
	 * Sanitize boolean attributes? _(Defaults to `true`)_
	 *
	 * E.g. `checked="abc"` => `checked=""`
	 */
	sanitizeBooleanAttributes?: boolean;
};

//

export function getSanitizeOptions(input?: SanitizeOptions): Options {
	const options = isPlainObject(input) ? input : {};

	options.sanitizeBooleanAttributes =
		typeof options.sanitizeBooleanAttributes === 'boolean'
			? options.sanitizeBooleanAttributes
			: true;

	return options as Options;
}

export function sanitizeAttributes(
	element: Element,
	attributes: Attr[],
	options: Options,
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

export function sanitizeNodes(nodes: Node[], options: Options): Node[] {
	const actual = nodes.filter(node => node instanceof Node);
	const {length} = nodes;

	for (let index = 0; index < length; index += 1) {
		const node = actual[index];

		if (node instanceof Element) {
			const scripts = node.querySelectorAll('script');

			for (const script of scripts) {
				script.remove();
			}

			sanitizeAttributes(node, [...node.attributes], options);
		}

		if (node.hasChildNodes()) {
			sanitizeNodes([...node.childNodes], options);
		}
	}

	return nodes;
}
