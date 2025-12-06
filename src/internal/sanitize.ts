import {isBadAttribute, isEmptyNonBooleanAttribute, isInvalidBooleanAttribute} from './attribute';

export function sanitizeAttributes(element: Element, attributes: Attr[]): void {
	const {length} = attributes;

	for (let index = 0; index < length; index += 1) {
		const attribute = attributes[index];

		if (isBadAttribute(attribute) || isEmptyNonBooleanAttribute(attribute)) {
			element.removeAttribute(attribute.name);
		} else if (isInvalidBooleanAttribute(attribute)) {
			element.setAttribute(attribute.name, '');
		}
	}
}

export function sanitizeNodes(nodes: Node[]): Node[] {
	const actual = nodes.filter(node => node instanceof Node);
	const {length} = nodes;

	for (let index = 0; index < length; index += 1) {
		const node = actual[index];

		if (node instanceof Element) {
			const scripts = node.querySelectorAll('script');

			for (const script of scripts) {
				script.remove();
			}

			sanitizeAttributes(node, [...node.attributes]);
		}

		if (node.hasChildNodes()) {
			sanitizeNodes([...node.childNodes]);
		}
	}

	return nodes;
}
