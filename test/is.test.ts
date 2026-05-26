import {expect, test} from 'vitest';
import * as Is from '../src/is';

const values: unknown[] = [
	null,
	undefined,
	123,
	'abc',
	true,
	[],
	{},
	document.createDocumentFragment(),
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
	}
});

test('isEventPosition', () => {
	const position = {x: 0, y: 0};

	expect(Is.isEventPosition(position)).toBe(true);
	expect(Is.isEventPosition({x: '0', y: 0})).toBe(false);
	expect(Is.isEventPosition({x: 0, y: '0'})).toBe(false);
	expect(Is.isEventPosition({x: 0})).toBe(false);
	expect(Is.isEventPosition({y: 0})).toBe(false);
	expect(Is.isEventPosition({})).toBe(false);
});

test('isHTMLOrSVGElement', () => {
	for (let index = 0; index < length; index += 1) {
		expect(Is.isHTMLOrSVGElement(values[index])).toBe(index >= 11);
	}
});

test('isInDocument', () =>
	new Promise<void>(done => {
		const nodes = values.slice(7) as Node[];
		const {length} = nodes;

		for (let index = 0; index < length; index += 1) {
			const node = nodes[index];

			expect(Is.isInDocument(node)).toBe(false);

			document.body.append(nodes[index]);
		}

		expect(Is.isInDocument(document)).toBe(true);
		expect(Is.isInDocument(document, document)).toBe(true);

		expect(Is.isInDocument(123 as never)).toBe(false);
		expect(Is.isInDocument(document, 123 as never)).toBe(true);

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

test('isInputElement', () => {
	for (let index = 0; index < length; index += 1) {
		expect(Is.isInputElement(values[index])).toBe(false);
	}

	expect(Is.isInputElement(document.createElement('input'))).toBe(true);
	expect(Is.isInputElement(document.createElement('select'))).toBe(true);
	expect(Is.isInputElement(document.createElement('textarea'))).toBe(true);
});
