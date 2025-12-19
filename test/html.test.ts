import {expect, test} from 'vitest';
import {html, sanitize} from '../src/html';

const cases = [
	// Basic sanitization

	{
		original: '<p>Hello, world!</p>',
		sanitized: '<p>Hello, world!</p>',
	},
	{
		original: '<button disabled="blah">Click me</button>',
		sanitized: '<button disabled="">Click me</button>',
	},
	{
		original: '<script>alert(1);</script><p>Text</p>',
		sanitized: '<p>Text</p>',
	},
	{
		original: '<div><script>alert(1);</script></div>',
		sanitized: '<div></div>',
	},
	{
		original: '<!-- A regular comment -->',
		sanitized: '<!-- A regular comment -->',
	},
	{
		original: '<textarea>@shafigullin</textarea><!--</textarea><img src=x onerror=alert(1)>-->',
		sanitized: '<textarea>@shafigullin</textarea>',
	},

	// DOM clobbering (Thanks, DOMPurify)

	{
		original: '<form onmouseover=\'alert(1)\'><input name="attributes"><input name="attributes">',
		sanitized: '<form><input><input></form>',
	},
	{
		original: '<img src=x name=getElementById>',
		sanitized: '<img src="x">',
	},
	{
		original: '<a href="#some-code-here" id="location">invisible',
		sanitized: '<a href="#some-code-here">invisible</a>',
	},
	{
		original:
			'<div onclick=alert(0)><form onsubmit=alert(1)><input onfocus=alert(2) name=parentNode>123</form></div>',
		sanitized: '<div><form><input>123</form></div>',
	},
	{
		original: '<form onsubmit=alert(1)><input onfocus=alert(2) name=nodeName>123</form>',
		sanitized: '<form><input>123</form>',
	},
	{
		original: '<form onsubmit=alert(1)><input onfocus=alert(2) name=nodeType>123</form>',
		sanitized: '<form><input>123</form>',
	},
	{
		original: '<form onsubmit=alert(1)><input onfocus=alert(2) name=children>123</form>',
		sanitized: '<form><input>123</form>',
	},
	{
		original: '<form onsubmit=alert(1)><input onfocus=alert(2) name=attributes>123</form>',
		sanitized: '<form><input>123</form>',
	},
	{
		original: '<form onsubmit=alert(1)><input onfocus=alert(2) name=removeChild>123</form>',
		sanitized: '<form><input>123</form>',
	},
	{
		original: '<form onsubmit=alert(1)><input onfocus=alert(2) name=removeAttributeNode>123</form>',
		sanitized: '<form><input>123</form>',
	},
	{
		original: '<form onsubmit=alert(1)><input onfocus=alert(2) name=setAttribute>123</form>',
		sanitized: '<form><input>123</form>',
	},
	{
		original:
			'<image name=body><image name=adoptNode>@mmrupp<image name=firstElementChild><svg onload=alert(1)>',
		sanitized: '<img><img>@mmrupp<img><svg></svg>',
	},
	{
		original: '<image name=activeElement><svg onload=alert(1)>',
		sanitized: '<img><svg></svg>',
	},
	// Toretto doesn't disallow tags, so result is different from DOMPurify
	{
		original:
			'<image name=body><img src=x><svg onload=alert(1); autofocus>, <keygen onfocus=alert(1); autofocus>',
		sanitized: '<img><img src="x"><svg autofocus="">, <keygen autofocus=""></keygen></svg>',
	},
	{
		original: '<input name=submit>123',
		sanitized: '<input>123',
	},
	{
		original: '<input name=acceptCharset>123',
		sanitized: '<input>123',
	},
	{
		original: '<form><input name=hasChildNodes>',
		sanitized: '<form><input></form>',
	},

	// JS attributes (Thanks, DOMPurify)

	{
		original: '<a href="javascript:123" onclick="alert(1)">CLICK ME</a>',
		sanitized: '<a>CLICK ME</a>',
	},
	{
		original: '<form action="javasc\nript:alert(1)"><button>XXX</button></form>',
		sanitized: '<form><button>XXX</button></form>',
	},
];

function join(nodes: Node[]): string {
	return nodes
		.map(node =>
			node instanceof Comment
				? `<!--${node.data}-->`
				: node instanceof Element
					? node.outerHTML
					: (node.nodeValue ?? ''),
		)
		.join('');
}

test('html: cases', () => {
	const {length} = cases;

	for (let index = 0; index < length; index += 1) {
		const {original, sanitized} = cases[index];

		const first = join(html(original));
		const second = join(html(original));

		// console.log(index, result === sanitized ? '✓' : '✗', result);

		expect(first).toBe(sanitized);
		expect(second).toBe(sanitized);
		expect(first).toBe(second);
	}

	for (let index = 0; index < length; index += 1) {
		html.remove(cases[index].original);
	}

	html.clear();
});

test('html: templates', () => {
	const first = document.createElement('template');
	const second = document.createElement('template');

	first.innerHTML = '<p>Test</p><script>alert(1);</script>';

	second.id = 'test-template';
	second.innerHTML = '<p>Test</p><script>alert(1);</script>';

	document.body.append(second);

	expect(join(html(first, {cache: false}))).toBe('<p>Test</p>');
	expect(join(html('test-template'))).toBe('<p>Test</p>');
});

test('html: error handling', () => {
	expect(html('   ', {cache: 123 as never})).toEqual([]);
	expect(html(123 as never, 456 as never)).toEqual([]);

	html.remove('non-existent-template');
	html.remove(123 as never);
});

test('sanitize', () => {
	function getElement() {
		const element = document.createElement('div');

		element.setAttribute('onclick', 'alert(1)');
		element.innerHTML = '<p>Hello, world!<script>alert(2);</script></p>';

		return element;
	}

	const firstElement = getElement();
	const secondElement = getElement();

	const firstSanitized = sanitize([firstElement]);
	const secondSanitized = sanitize(secondElement);

	const firstHtml = join(firstSanitized);
	const secondHtml = join(secondSanitized);

	expect(firstHtml).toBe('<div><p>Hello, world!</p></div>');
	expect(secondHtml).toBe('<div><p>Hello, world!</p></div>');
	expect(firstHtml).toBe(secondHtml);
});
