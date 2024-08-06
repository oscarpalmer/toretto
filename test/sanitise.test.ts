import {afterAll, expect, test} from 'bun:test';
import {sanitise} from '../src/sanitise';

afterAll(() => {
	document.body.innerHTML = '';
});

test('sanitise', () => {
	const original = `<div hidden="hmm" onclick="alert('!')">
	<p href="data:text/html,hmm" src="javascript:console.log" xlink:href="javascript:console.log">Hello</p>
</div>`;

	document.body.innerHTML = original;

	let nodes = sanitise(document.body);

	expect(nodes.length).toBe(1);

	expect(nodes.join()).toBe(`<body><div hidden="">
	<p>Hello</p>
</div></body>`);

	document.body.innerHTML = original;

	nodes = sanitise(document.body, {sanitiseBooleanAttributes: false});

	expect(nodes.length).toBe(1);

	expect(nodes.join()).toBe(`<body><div hidden="hmm">
	<p>Hello</p>
</div></body>`);
});