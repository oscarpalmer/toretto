import {expect, test} from 'vitest';
import * as Is from '../src/is';

const values = [
	null,
	undefined,
	123,
	'abc',
	true,
	[],
	{},
	document.createDocumentFragment(),
	document.implementation.createDocumentType(
		'qualifiedName',
		'publicId',
		'systemId',
	),
	document.createComment(''),
	document.createProcessingInstruction('target', 'data'),
	document.createTextNode(''),
	document.createElement('div'),
	document.createElementNS('http://www.w3.org/2000/svg', 'rect'),
];

const {length} = values;

test('isChildNode', () => {
	for (let index = 0; index < length; index += 1) {
		expect(Is.isChildNode(values[index])).toBe(index >= 8);
		expect(Is.isChildNode(values[index], true)).toBe(index >= 9);
	}
});

test('isHTMLOrSVGElement', () => {
	for (let index = 0; index < length; index += 1) {
		expect(Is.isHTMLOrSVGElement(values[index])).toBe(index >= 12);
	}
});

test('isInDocument', () =>
	new Promise<void>(done => {
		const nodes = values.slice(7) as Node[];
		const {length} = nodes;

		for (let index = 0; index < length; index += 1) {
			const node = nodes[index];

			expect(Is.isInDocument(node)).toBe(false);

			document.append(nodes[index]);
		}

		expect(Is.isInDocument(document)).toBe(true);
		expect(Is.isInDocument(document, document)).toBe(true);

		setTimeout(() => {
			for (let index = 0; index < length; index += 1) {
				const node = nodes[index];

				expect(Is.isInDocument(node)).toBe(index >= 1);
				expect(Is.isInDocument(node, document)).toBe(index >= 1);

				node.parentNode?.removeChild(node);
			}

			done();
		}, 125);
	}));
