/** biome-ignore-all lint/style/noMagicNumbers: Testing */
import {afterAll, expect, test} from 'vitest';
import * as Find from '../src/find/index';

document.body.innerHTML = `<div>
	<div class="target">
		<div hidden>
			<div id="origin">
				<span id="hover" style="pointer-events: none">hello</span>
				<!-- This is a comment -->
			</div>
		</div>
	</div>
</div>`;

afterAll(() => {
	document.body.innerHTML = '';
});

test('getElementUnderPointer', () => {
	// TODO: find a way to test hover, etc.
});

test('findAncestor', () => {
	const hidden = document.querySelector('[hidden]');
	const origin = document.getElementById('origin');
	const target = document.querySelector('.target');

	if (origin == null) {
		return;
	}

	expect(Find.findAncestor(origin, '#origin')).toBe(origin);
	expect(Find.findAncestor(origin, '.target')).toBe(target);

	expect(Find.findAncestor(origin, element => element.id === 'origin')).toBe(
		origin,
	);

	expect(
		Find.findAncestor(origin, element => (element as HTMLElement).hidden),
	).toBe(hidden);

	expect(Find.findAncestor(origin, 'noop')).toBe(null);

	expect(Find.findAncestor(origin, element => element.tagName === 'noop')).toBe(
		null,
	);

	expect(Find.findAncestor(123 as never, 'span')).toBe(null);
	expect(Find.findAncestor(origin, 123 as never)).toBe(null);
});

test('findElement', () => {
	const target = Find.findElement('.target');

	expect(target).toBeInstanceOf(HTMLDivElement);
	expect(target?.classList.contains('target') ?? false).toBe(true);

	const origin = Find.findElement('#origin', '.target');

	expect(origin).toBeInstanceOf(HTMLDivElement);
	expect(origin?.id).toBe('origin');

	const child = Find.$('*', origin);
	const notFound = Find.$('not-found', origin);

	expect(child).toBeInstanceOf(HTMLSpanElement);
	expect(child?.id).toBe('hover');
	expect(child?.textContent).toBe('hello');

	expect(notFound).toBe(null);
});

test('findElements', () => {
	const elements = Find.findElements('.target');

	expect(elements.length).toBe(1);
	expect(elements[0].classList.contains('target')).toBe(true);

	let origin = Find.findElements('#origin', '.target');

	expect(origin.length).toBe(1);
	expect(origin[0].id).toBe('origin');

	origin = Find.findElements(origin, Find.findElement('.target'));

	expect(origin.length).toBe(1);
	expect(origin[0].id).toBe('origin');

	const children = Find.$$('*', origin);

	expect(children.length).toBe(1);
	expect(children[0].id).toBe('hover');
	expect(children[0].textContent).toBe('hello');

	expect(
		Find.findElements(
			[123, 'a', document.body, ...origin, ...children] as never,
			document,
		).length,
	).toBe(3);
});

test('findRelatives', () => {
	const template = `
<div>
	<div>
		<div>
			<div class="target">bad</div>
		</div>
	</div>
	<div>
		<div class="target">good</div>
	</div>
	<div>
		<div class="origin">
			<p>origin</p>
			<div>
				<div>
					<div class="target">
						<p>good</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<ul>
	<li class="target">1</li>
	<li class="target">2</li>
	<li class="target">3</li>
	<li class="origin">4</li>
	<li class="target">5</li>
	<li class="target">6</li>
	<li class="target">7</li>
</ul>

<ul>
<li class="target"><button></button></li>
<li class="target"><button></button></li>
<li class="target"><button class="origin">good</button></li>
<li class="target"><button></button></li>
<li class="target"><button></button></li>
</ul>
`;

	const element = document.createElement('div');

	element.innerHTML = template;

	const divOrigin = Find.$('div.origin', element);
	const liOrigin = Find.$('li.origin', element);
	const buttonOrigin = Find.$('button.origin', element);

	if (divOrigin == null || liOrigin == null || buttonOrigin == null) {
		return;
	}

	const divTargets = Find.findRelatives(divOrigin, 'div.target', element);
	const liTargets = Find.findRelatives(liOrigin, 'li.target', element);
	const buttonTargets = Find.findRelatives(buttonOrigin, 'li.target', element);

	expect(divTargets.length).toBe(2);
	expect(divTargets.map(target => target.textContent?.trim())).toEqual([
		'good',
		'good',
	]);

	expect(liTargets.length).toBe(2);
	expect(liTargets.map(target => target.textContent?.trim())).toEqual([
		'3',
		'5',
	]);

	expect(buttonTargets.length).toBe(1);
	expect(buttonTargets[0].textContent?.trim()).toBe('good');

	expect(Find.findRelatives(buttonOrigin, 'button.origin', element)[0]).toBe(
		buttonOrigin,
	);

	expect(Find.findRelatives(liOrigin, '.not-found').length).toBe(0);

	expect(Find.findRelatives(123 as never, 'blah')).toEqual([]);
	expect(Find.findRelatives(divOrigin, 123 as never)).toEqual([]);
});
