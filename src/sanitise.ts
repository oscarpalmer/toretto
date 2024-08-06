import {
	isBadAttribute,
	isEmptyNonBooleanAttribute,
	isInvalidBooleanAttribute,
} from './attribute';

export type SanitiseOptions = {
	/**
	 * - Sanitise boolean attributes? _(Defaults to `true`)_
	 * - E.g. `checked="abc"` => `checked=""`
	 */
	sanitiseBooleanAttributes?: boolean;
};

/**
 * - Sanitise one or more nodes _(as well as all their children)_:
 * - Removes or sanitises bad attributes
 */
export function sanitise(
	value: Node | Node[],
	options?: Partial<SanitiseOptions>,
): Node[] {
	return sanitiseNodes(Array.isArray(value) ? value : [value], {
		sanitiseBooleanAttributes: options?.sanitiseBooleanAttributes ?? true,
	});
}

function sanitiseAttributes(
	element: Element,
	attributes: Attr[],
	options: SanitiseOptions,
): void {
	const {length} = attributes;

	for (let index = 0; index < length; index += 1) {
		const attribute = attributes[index];

		if (isBadAttribute(attribute) || isEmptyNonBooleanAttribute(attribute)) {
			element.removeAttribute(attribute.name);
		} else if (
			options.sanitiseBooleanAttributes &&
			isInvalidBooleanAttribute(attribute)
		) {
			element.setAttribute(attribute.name, '');
		}
	}
}

function sanitiseNodes(nodes: Node[], options: SanitiseOptions): Node[] {
	const {length} = nodes;

	for (let index = 0; index < length; index += 1) {
		const node = nodes[index];

		if (node instanceof Element) {
			sanitiseAttributes(node, [...node.attributes], options);
		}

		sanitiseNodes([...node.childNodes], options);
	}

	return nodes;
}