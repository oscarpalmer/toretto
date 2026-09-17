import {expect, test} from 'vitest';
import {createElement, html, sanitize} from '../src';
import {htmlCases} from './html.fixture';

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

test('cases', () => {
	const {length} = htmlCases;

	for (let index = 0; index < length; index += 1) {
		const {original, sanitized} = htmlCases[index];

		const first = join(html(original));
		const second = join(html(original));

		expect(first).toBe(sanitized);
		expect(second).toBe(sanitized);
		expect(first).toBe(second);
	}

	for (let index = 0; index < length; index += 1) {
		html.remove(htmlCases[index].original);
	}

	html.clear();
});

test('tagged', () => {
	document.body.append(
		createElement('img', {
			property: {
				src: 'https://example.com/image_1.jpg',
				alt: 'Example image #1',
			},
		}),
		createElement('img', {
			property: {
				src: 'https://example.com/image_2.jpg',
				alt: 'Example image #2',
			},
		}),
	);

	const paragraph = createElement('p', {
		property: {
			innerHTML: 'Hello, world!',
		},
	});

	const items = Array.from({length: 5}, (_, index) =>
		index === 1 || index === 3
			? index
			: createElement('li', {
					property: {
						innerHTML: `#${index + 1}`,
					},
				}),
	);

	const nodes = html`<div>
		<!-- a comment ignored by temporary comment usage -->
		${[null, undefined, false, true, 123, 123n, 'abc', [1, 2, 3], {foo: 'bar'}]}
		<hr />
		${paragraph}
		<hr />
		<ul>
			${items}
		</ul>
		<hr />
		${document.querySelectorAll('img')}
	</div>`;

	expect(join(nodes)).toBe(`<div>
		<!-- a comment ignored by temporary comment usage -->
		falsetrue123123abc1,2,3{"foo":"bar"}
		<hr>
		<p>Hello, world!</p>
		<hr>
		<ul>
			<li>#1</li>1<li>#3</li>3<li>#5</li>
		</ul>
		<hr>
		<img src="https://example.com/image_1.jpg" alt="Example image #1"><img src="https://example.com/image_2.jpg" alt="Example image #2">
	</div>`);
});

test('templates', () => {
	const first = document.createElement('template');
	const second = document.createElement('template');

	first.innerHTML = '<p>Test</p><script>alert(1);</script>';

	second.id = 'test-template';
	second.innerHTML = '<p>Test</p><script>alert(1);</script>';

	document.body.append(second);

	expect(join(html(first, {cache: false}))).toBe('<p>Test</p>');
	expect(join(html('test-template'))).toBe('<p>Test</p>');
});

test('error handling', () => {
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
