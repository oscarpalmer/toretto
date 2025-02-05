import {expect, test} from 'vitest';
import {html} from '../src/html';

test('html', () => {
	const original = `<div onclick="alert('!')">
	<p>
		<a href="data:text/html,hmm">One</a>
		<a xlink:href="javascript:console.log">Two</a>
		<img src="javascript:console.log" />
	</p>
</div><script>alert('!')</script>`;

	let sanitised = `<div onclick="alert('!')">
	<p>
		<a href="data:text/html,hmm">One</a>
		<a xlink:href="javascript:console.log">Two</a>
		<img src="javascript:console.log">
	</p>
</div>`;

	const expectedNodes = html(original, false);

	expect(expectedNodes.length).toBe(1);
	expect(expectedNodes.join()).toBe(sanitised);

	//

	sanitised = `<div>
	<p>
		<a>One</a>
		<a>Two</a>
		<img>
	</p>
</div>`;

	const sanitisedOne = html(original);
	const sanitisedTwo = html(original, true);
	const sanitisedThree = html(original, {});

	expect(sanitisedOne.length).toBe(1);
	expect(sanitisedOne.join()).toBe(sanitised);
	expect(sanitisedTwo.length).toBe(1);
	expect(sanitisedTwo.join()).toBe(sanitised);
	expect(sanitisedThree.length).toBe(1);
	expect(sanitisedThree.join()).toBe(sanitised);

	//

	const template = document.createElement('template');

	template.id = 'tpl';
	template.innerHTML = '<p>Hello</p>';

	document.body.append(template);

	let external = html('tpl');

	template.remove();

	expect(external.length).toBe(1);
	expect(external.join()).toBe('<p>Hello</p>');

	external = html(template);

	expect(external.length).toBe(1);
	expect(external.join()).toBe('<p>Hello</p>');

	//

	expect(html('')).toEqual([]);
});
