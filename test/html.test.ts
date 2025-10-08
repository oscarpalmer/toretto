/** biome-ignore-all lint/style/noMagicNumbers: Testing */
import {expect, test} from 'vitest';
import {html} from '../src/html';

function join(nodes: Node[]): string {
	return nodes
		.map(node => (node instanceof Element ? node.outerHTML : node.textContent))
		.join();
}

test('html', () => {
	const original = `<div onclick="alert('!')">
	<p>
		<a href="data:text/html,hmm">One</a>
		<a xlink:href="javascript:console.log">Two</a>
		<img src="javascript:console.log" />
	</p>
</div><script>alert('!')</script>`;

	let sanitized = `<div onclick="alert('!')">
	<p>
		<a href="data:text/html,hmm">One</a>
		<a xlink:href="javascript:console.log">Two</a>
		<img src="javascript:console.log">
	</p>
</div>`;

	const expectedNodes = html(original, false);

	expect(expectedNodes.length).toBe(1);
	expect(join(expectedNodes)).toBe(sanitized);

	//

	sanitized = `<div>
	<p>
		<a>One</a>
		<a>Two</a>
		<img>
	</p>
</div>`;

	const sanitizedOne = html(original);
	const sanitizedTwo = html(original, true);
	const sanitizedThree = html(original, {});

	expect(sanitizedOne.length).toBe(1);
	expect(join(sanitizedOne)).toBe(sanitized);
	expect(sanitizedTwo.length).toBe(1);
	expect(join(sanitizedTwo)).toBe(sanitized);
	expect(sanitizedThree.length).toBe(1);
	expect(join(sanitizedThree)).toBe(sanitized);

	//

	const template = document.createElement('template');

	template.id = 'tpl';
	template.innerHTML = '<p>Hello</p>';

	document.body.append(template);

	let external = html('tpl');

	template.remove();

	expect(external.length).toBe(1);
	expect(join(external)).toBe('<p>Hello</p>');

	external = html(template);

	expect(external.length).toBe(1);
	expect(join(external)).toBe('<p>Hello</p>');

	//

	expect(html('')).toEqual([]);

	const values = [
		null,
		undefined,
		0,
		1,
		true,
		false,
		{},
		[],
		(): void => {},
		document.createElement('div'),
	];

	for (let index = 0; index < values.length; index += 1) {
		expect(html(values[index] as never)).toEqual([]);
	}

	html.remove(original);
	html.remove(123 as never);
	html.clear();
});
