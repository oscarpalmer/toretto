import {expect, test} from 'bun:test';
import * as Attribute from '../src/attribute';

const nonBooleanAttributes = [
	'abbr',
	'accept',
	'accept-charset',
	'accesskey',
	'action',
	'allow',
	'alt',
	'as',
	'autocapitalize',
	'autocomplete',
	'blocking',
	'charset',
	'cite',
	'class',
	'color',
	'cols',
	'colspan',
	'content',
	'contenteditable',
	'coords',
	'crossorigin',
	'data',
	'datetime',
	'decoding',
	'dir',
	'dirname',
	'download',
	'draggable',
	'enctype',
	'enterkeyhint',
	'fetchpriority',
	'for',
	'form',
	'formaction',
	'formenctype',
	'formmethod',
	'formtarget',
	'headers',
	'height',
	'high',
	'href',
	'hreflang',
	'http-equiv',
	'id',
	'imagesizes',
	'imagesrcset',
	'inputmode',
	'integrity',
	'is',
	'itemid',
	'itemprop',
	'itemref',
	'itemtype',
	'kind',
	'label',
	'lang',
	'list',
	'loading',
	'low',
	'max',
	'maxlength',
	'media',
	'method',
	'min',
	'minlength',
	'name',
	'nonce',
	'optimum',
	'pattern',
	'ping',
	'placeholder',
	'popover',
	'popovertarget',
	'popovertargetaction',
	'poster',
	'preload',
	'referrerpolicy',
	'rel',
	'rows',
	'rowspan',
	'sandbox',
	'scope',
	'shape',
	'size',
	'sizes',
	'slot',
	'span',
	'spellcheck',
	'src',
	'srcdoc',
	'srclang',
	'srcset',
	'start',
	'step',
	'style',
	'tabindex',
	'target',
	'title',
	'translate',
	'type',
	'usemap',
	'value',
	'width',
	'wrap',
];

test('isBadAttribute', () => {
	const attributes = [
		['onclick', 'alert()'],
		['href', 'data:text/html,'],
		['src', 'javascript:'],
		['xlink:href', 'javascript:'],
		['href', 'https://example.com'],
		['src', 'https://example.com'],
		['xlink:href', 'https://example.com'],
	];

	const {length} = attributes;

	for (let index = 0; index < length; index += 1) {
		const [name, value] = attributes[index];

		expect(Attribute.isBadAttribute({name, value})).toBe(index < 4);
	}
});

test('isBooleanAttribute', () => {
	const attributes = [...Attribute.booleanAttributes, ...nonBooleanAttributes];

	const {length} = attributes;

	for (let index = 0; index < length; index += 1) {
		const attribute = attributes[index];

		expect(Attribute.isBooleanAttribute(attribute)).toBe(
			index < Attribute.booleanAttributes.length,
		);
	}
});

test('isEmptyNonBooleanAttribute', () => {
	let {length} = Attribute.booleanAttributes;

	for (let index = 0; index < length; index += 1) {
		expect(
			Attribute.isEmptyNonBooleanAttribute({
				name: Attribute.booleanAttributes[index],
				value: '',
			}),
		).toBe(false);
	}

	length = nonBooleanAttributes.length;

	for (let index = 0; index < length; index += 1) {
		const name = nonBooleanAttributes[index];

		expect(Attribute.isEmptyNonBooleanAttribute({name, value: ''})).toBe(true);

		expect(Attribute.isEmptyNonBooleanAttribute({name, value: '  '})).toBe(
			true,
		);

		expect(Attribute.isEmptyNonBooleanAttribute({name, value: name})).toBe(
			false,
		);
	}
});

test('isInvalidBooleanAttribute', () => {
	let {length} = Attribute.booleanAttributes;

	for (let index = 0; index < length; index += 1) {
		const name = Attribute.booleanAttributes[index];

		expect(Attribute.isInvalidBooleanAttribute({name, value: ''})).toBe(false);

		expect(Attribute.isInvalidBooleanAttribute({name, value: name})).toBe(
			false,
		);

		expect(Attribute.isInvalidBooleanAttribute({name, value: '!'})).toBe(true);
	}

	length = nonBooleanAttributes.length;

	for (let index = 0; index < length; index += 1) {
		const name = nonBooleanAttributes[index];

		expect(Attribute.isInvalidBooleanAttribute({name, value: ''})).toBe(true);
		expect(Attribute.isInvalidBooleanAttribute({name, value: name})).toBe(true);
		expect(Attribute.isInvalidBooleanAttribute({name, value: '!'})).toBe(true);
	}
});

test('setAttribute', () => {
	const element = document.createElement('div');

	Attribute.setAttribute(element, 'id', 'test');

	Attribute.setAttribute(element, {
		name: 'keyed',
		value: 'keyed',
	});

	expect(element.getAttribute('id')).toBe('test');
	expect(element.getAttribute('keyed')).toBe('keyed');

	Attribute.setAttribute(element, 'id');
	Attribute.setAttribute(element, {name: 'keyed', value: null});

	expect(element.getAttribute('id')).toBe(null);

	Attribute.setAttributes(element, {
		alpha: 123,
		beta: 'hello',
		gamma: true,
	});

	expect(element.getAttribute('alpha')).toBe('123');
	expect(element.getAttribute('beta')).toBe('hello');
	expect(element.getAttribute('gamma')).toBe('true');

	Attribute.setAttributes(element, [{name: 'beta', value: null}]);

	expect(element.getAttribute('beta')).toBe(null);

	Attribute.setAttributes(element, [
		{name: 'alpha', value: 456},
		{name: 'gamma', value: false},
	]);

	expect(element.getAttribute('alpha')).toBe('456');
	expect(element.getAttribute('gamma')).toBe('false');

	Attribute.setAttributes(element, [{name: 'alpha', value: null}]);

	expect(element.getAttribute('alpha')).toBe(null);
});
