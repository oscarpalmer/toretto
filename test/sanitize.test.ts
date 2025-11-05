import {afterAll, expect, test} from 'vitest';
import {sanitize} from '../src/sanitize';

function join(nodes: Node[]): string {
	return nodes
		.map(node => (node instanceof Element ? node.outerHTML : node.textContent))
		.join();
}

afterAll(() => {
	document.body.innerHTML = '';
});

test('sanitize', () => {
	const original = `<div hidden="hmm" onclick="alert('!')">
	<p>
		<a href="data:text/html,hmm">One</a>
		<a xlink:href="javascript:console.log">Two</a>
		<img src="javascript:console.log">
	</p>
<script>alert('!')</script></div>`;

	document.body.innerHTML = original;

	let nodes = sanitize(document.body);

	expect(nodes.length).toBe(1);

	expect(join(nodes)).toBe(
		`<body><div hidden="">
	<p>
		<a>One</a>
		<a>Two</a>
		<img>
	</p>
</div></body>`,
	);

	document.body.innerHTML = original;

	nodes = sanitize([document.body], {
		sanitizeBooleanAttributes: false,
	});

	expect(nodes.length).toBe(1);

	expect(join(nodes)).toBe(
		`<body><div hidden="hmm">
	<p>
		<a>One</a>
		<a>Two</a>
		<img>
	</p>
</div></body>`,
	);
});
