import {expect, test} from 'vitest';
import * as Attribute from '../src/attribute/index';

const nonBooleanAttributes: string[] = [
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

const testableAttributes = [
	// Standard attributes
	{name: 'class', value: 'button primary', valid: true},
	{name: 'id', value: 'submit-btn', valid: true},
	{name: 'title', value: 'Click to submit', valid: true},
	{name: 'alt', value: 'Profile picture', valid: true},
	{name: 'src', value: 'https://example.com/image.jpg', valid: true},
	{name: 'href', value: 'https://example.com', valid: true},
	{name: 'href', value: '/relative/path', valid: true},
	{name: 'type', value: 'text', valid: true},
	{name: 'name', value: 'username', valid: true},
	{name: 'value', value: 'Default text', valid: true},
	{name: 'placeholder', value: 'Enter your name', valid: true},
	{name: 'disabled', value: '', valid: true},

	// ARIA attributes
	{name: 'aria-label', value: 'Close dialog', valid: true},
	{name: 'aria-labelledby', value: 'heading-1', valid: true},
	{name: 'aria-describedby', value: 'description-1', valid: true},
	{name: 'aria-hidden', value: 'true', valid: true},

	// Data attributes
	{name: 'data-id', value: '12345', valid: true},
	{name: 'data-user-role', value: 'admin', valid: true},
	{name: 'data-index', value: '0', valid: true},
	{name: 'data-config', value: '{"theme":"dark"}', valid: true},
	{name: 'data-tooltip', value: 'Click here', valid: true},

	// Event handlers
	{name: 'onclick', value: "alert('XSS')", valid: false},
	{name: 'onload', value: 'malicious()', valid: false},
	{name: 'onerror', value: 'steal()', valid: false},
	{name: 'onmouseover', value: 'exploit()', valid: false},
	{name: 'onmouseout', value: 'track()', valid: false},

	// JavaScript URLs
	{name: 'href', value: "javascript:alert('XSS')", valid: false},
	{name: 'href', value: 'javascript:void(0)', valid: false},
	{name: 'href', value: '  javascript:exploit()', valid: false},
	{name: 'href', value: 'JAVASCRIPT:malicious()', valid: false},
	{name: 'src', value: 'javascript:alert(1)', valid: false},
	{name: 'action', value: 'javascript:submit()', valid: false},
	{name: 'formaction', value: 'javascript:hack()', valid: false},
	{name: 'xlink:href', value: 'javascript:alert(1)', valid: false},

	// Data URLs
	{name: 'src', value: 'data:image/png;base64,iVBORw0KG...', valid: true},
	{name: 'href', value: 'data:text/html,<script>alert(1)</script>', valid: false},
	// {name: 'src', value: "data:text/javascript,alert('XSS')", valid: false},
	{name: 'href', value: 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==', valid: false},

	// Edge cases and encoding
	{name: 'href', value: '&#106;avascript:alert(1)', valid: false},
	{name: 'href', value: 'jav&#x09;ascript:alert(1)', valid: false},
	{name: 'src', value: '\u006Aavascript:alert(1)', valid: false},

	// XML namespaced attributes
	{name: 'xmlns', value: 'http://www.w3.org/2000/svg', valid: true},
	{name: 'xml:lang', value: 'en', valid: true},
	{name: 'xml:space', value: 'preserve', valid: true},

	// Custom element attributes
	{name: 'is', value: 'custom-button', valid: true},
	{name: 'part', value: 'button', valid: true},
	{name: 'exportparts', value: 'button: custom-button', valid: true},
	{name: 'slot', value: 'header', valid: true},
];

test('getAttribute + setAttribute', () => {
	const element = document.createElement('div');

	Attribute.setAttribute(element, 'id', 'test');

	Attribute.setAttribute(element, {
		name: 'keyed',
		value: 'keyed',
	});

	Attribute.setAttribute(element, 'data-a', 123);
	Attribute.setAttribute(element, 'data-b', 'hello, world!');

	expect(Attribute.getAttribute(element, 'id')).toBe('test');
	expect(Attribute.getAttribute(element, 'keyed')).toBe('keyed');

	expect(Attribute.getAttribute(element, 'data-a')).toBe(123);
	expect(Attribute.getAttribute(element, 'data-a', false)).toBe('123');
	expect(Attribute.getAttribute(element, 'data-b')).toBe('hello, world!');
	expect(Attribute.getAttribute(element, 'data-b', false)).toBe('hello, world!');

	let first = Attribute.getAttributes(element, [
		'data-a',
		'data-b',
		'id',
		'keyed',
		123 as never,
		[] as never,
		(() => {}) as never,
	]);

	expect(Object.keys(first).length).toBe(4);
	expect(first['data-a']).toBe(123);
	expect(first['data-b']).toBe('hello, world!');
	expect(first.id).toBe('test');
	expect(first.keyed).toBe('keyed');

	Attribute.setAttribute(element, 'id');
	Attribute.setAttribute(element, {name: 'keyed', value: null});

	expect(Attribute.getAttribute(element, 'id')).toBe(undefined);
	expect(Attribute.getAttribute(element, 'keyed')).toBe(undefined);

	first = Attribute.getAttributes(element, ['data-a', 'data-b', 'id', 'keyed'], false);

	expect(first['data-a']).toBe('123');
	expect(first['data-b']).toBe('hello, world!');
	expect(first.id).toBe(undefined);
	expect(first.keyed).toBe(undefined);

	Attribute.setAttributes(element, {
		alpha: 123,
		beta: 'hello',
		gamma: true,
	});

	expect(Attribute.getAttribute(element, 'alpha')).toBe('123');
	expect(Attribute.getAttribute(element, 'beta')).toBe('hello');
	expect(Attribute.getAttribute(element, 'gamma')).toBe('true');

	let second = Attribute.getAttributes(element, ['alpha', 'beta', 'gamma']);

	expect(second.alpha).toBe('123');
	expect(second.beta).toBe('hello');
	expect(second.gamma).toBe('true');

	Attribute.setAttributes(element, [{name: 'beta', value: null}]);

	expect(Attribute.getAttribute(element, 'alpha')).toBe('123');
	expect(Attribute.getAttribute(element, 'beta')).toBe(undefined);
	expect(Attribute.getAttribute(element, 'gamma')).toBe('true');

	second = Attribute.getAttributes(element, ['alpha', 'beta', 'gamma']);

	expect(second.alpha).toBe('123');
	expect(second.beta).toBe(undefined);
	expect(second.gamma).toBe('true');

	Attribute.setAttributes(element, [
		{name: 'alpha', value: 456},
		{name: 'gamma', value: false},
	]);

	expect(Attribute.getAttribute(element, 'alpha')).toBe('456');
	expect(Attribute.getAttribute(element, 'beta')).toBe(undefined);
	expect(Attribute.getAttribute(element, 'gamma')).toBe('false');

	second = Attribute.getAttributes(element, ['alpha', 'beta', 'gamma']);

	expect(second.alpha).toBe('456');
	expect(second.beta).toBe(undefined);
	expect(second.gamma).toBe('false');

	Attribute.setAttributes(element, [{name: 'alpha', value: null}]);

	expect(Attribute.getAttribute(element, 'alpha')).toBe(undefined);
	expect(Attribute.getAttribute(element, 'beta')).toBe(undefined);
	expect(Attribute.getAttribute(element, 'gamma')).toBe('false');

	second = Attribute.getAttributes(element, ['alpha', 'beta', 'gamma']);

	expect(second.alpha).toBe(undefined);
	expect(second.beta).toBe(undefined);
	expect(second.gamma).toBe('false');

	const properties = [
		{name: 'hidden', value: true},
		{name: 'multiple', value: ''},
		{name: 'notreal', value: true},
		{name: 'readonly', value: 'readonly'},
		{name: 'selected', value: false},
	];

	const {length} = properties;

	for (let index = 0; index < length; index += 1) {
		if (index % 2 === 0) {
			Attribute.setAttribute(element, properties[index]);
		} else {
			Attribute.setProperty(element, properties[index]);
		}
	}

	expect(element.hidden).toBe(true);
	expect((element as any).multiple).toBe(true);
	expect((element as any).notreal == null).toBe(true);
	expect((element as any).readonly).toBe(true);
	expect((element as any).selected).toBe(false);

	expect(Attribute.getAttribute('blah' as never, '')).toBe(undefined);
	expect(Attribute.getAttribute(element, [] as never)).toBe(undefined);
	expect(Attribute.getAttributes('blah' as never, [])).toEqual({});
	expect(Attribute.getAttributes(element, 'blah' as never)).toEqual({});

	expect(Attribute.setAttribute(123 as never, {name: 'x', value: 'y'})).toBe(undefined);

	expect(Attribute.setAttribute(element, 123 as never, 'blah')).toBe(undefined);

	expect(Attribute.setAttributes(123 as never, [])).toBe(undefined);
});

test('isBadAttribute', () => {
	const {length} = testableAttributes;

	for (let index = 0; index < length; index += 1) {
		const {name, valid, value} = testableAttributes[index];

		expect(Attribute.isBadAttribute({name, value})).toBe(!valid);
	}

	expect(Attribute.isBadAttribute(123 as never)).toBe(true);
	expect(Attribute.isBadAttribute({name: 123 as never, value: ''})).toBe(true);
	expect(Attribute.isBadAttribute({name: '', value: 123 as never})).toBe(true);
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

	expect(Attribute.isBooleanAttribute(123 as never)).toBe(false);
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

		expect(Attribute.isEmptyNonBooleanAttribute({name, value: '  '})).toBe(true);

		expect(Attribute.isEmptyNonBooleanAttribute({name, value: name})).toBe(false);
	}

	expect(Attribute.isEmptyNonBooleanAttribute(123 as never)).toBe(false);

	expect(Attribute.isEmptyNonBooleanAttribute({name: 123 as never, value: ''})).toBe(false);

	expect(Attribute.isEmptyNonBooleanAttribute({name: '', value: 123 as never})).toBe(false);
});

test('isInvalidBooleanAttribute', () => {
	let {length} = Attribute.booleanAttributes;

	for (let index = 0; index < length; index += 1) {
		const name = Attribute.booleanAttributes[index];

		expect(Attribute.isInvalidBooleanAttribute({name, value: ''})).toBe(false);

		expect(Attribute.isInvalidBooleanAttribute({name, value: name})).toBe(false);

		expect(Attribute.isInvalidBooleanAttribute({name, value: '!'})).toBe(true);
	}

	length = nonBooleanAttributes.length;

	for (let index = 0; index < length; index += 1) {
		const name = nonBooleanAttributes[index];

		expect(Attribute.isInvalidBooleanAttribute({name, value: name})).toBe(false);
	}

	expect(Attribute.isInvalidBooleanAttribute(123 as never)).toBe(true);

	expect(Attribute.isInvalidBooleanAttribute({name: 123 as never, value: ''})).toBe(true);

	expect(Attribute.isInvalidBooleanAttribute({name: '', value: 123 as never})).toBe(true);
});

test('setProperty', () => {
	const element = document.createElement('option');

	Attribute.setProperty(element, 'hidden', true);

	expect(element.hidden).toBe(true);
	expect(element.getAttribute('hidden')).toBe('');

	Attribute.setProperty(element, 'hidden', false);

	expect(element.hidden).toBe(false);
	expect(element.getAttribute('hidden')).toBe(null);

	Attribute.setProperty(element, 'hidden', 'abc123');

	expect(element.hidden).toBe(false);
	expect(element.getAttribute('hidden')).toBe(null);

	Attribute.setProperties(element, {
		selected: true,
	});

	expect(element.selected).toBe(true);
	expect(element.getAttribute('selected')).toBe('');

	Attribute.setProperties(element, {
		selected: false,
	});

	expect(element.selected).toBe(false);
	expect(element.getAttribute('selected')).toBe(null);
});
