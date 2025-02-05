import {afterAll, expect, test} from 'vitest';
import {sanitise} from '../src/sanitise';

afterAll(() => {
	document.body.innerHTML = '';
});

test('sanitise', () => {
	const original = `<div hidden="hmm" onclick="alert('!')">
	<p>
		<a href="data:text/html,hmm">One</a>
		<a xlink:href="javascript:console.log">Two</a>
		<img src="javascript:console.log">
	</p>
</div>`;

	document.body.innerHTML = original;

	let nodes = sanitise(document.body);

	expect(nodes.length).toBe(1);

	expect(nodes.join()).toBe(`<body><div hidden="">
	<p>
		<a>One</a>
		<a>Two</a>
		<img>
	</p>
</div></body>`);

	document.body.innerHTML = original;

	nodes = sanitise(document.body, {sanitiseBooleanAttributes: false});

	expect(nodes.length).toBe(1);

	expect(nodes.join()).toBe(`<body><div hidden="hmm">
	<p>
		<a>One</a>
		<a>Two</a>
		<img>
	</p>
</div></body>`);
});
