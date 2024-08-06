import {expect, test} from 'bun:test';
import {
	$,
	$$,
	findAncestor,
	findElement,
	findElements,
	findRelatives,
} from '../src/find';

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

test('findAncestor', () => {
	const hidden = document.querySelector('[hidden]');
	const origin = document.getElementById('origin');
	const target = document.querySelector('.target');

	if (origin === null) {
		return;
	}

	expect(findAncestor(origin, '#origin')).toBe(origin);
	expect(findAncestor(origin, '.target')).toBe(target);

	expect(findAncestor(origin, element => element.id === 'origin')).toBe(origin);

	expect(findAncestor(origin, element => (element as HTMLElement).hidden)).toBe(
		hidden,
	);

	expect(findAncestor(origin, 'noop')).toBe(null);

	expect(findAncestor(origin, element => element.tagName === 'noop')).toBe(
		null,
	);

	// @ts-expect-error Testing invalid input
	expect(findAncestor(null, 'span')).toBe(null);
});

test('findElement', () => {
	const target = findElement('.target');

	expect(target).toBeInstanceOf(HTMLDivElement);
	expect(target?.classList.contains('target') ?? false).toBe(true);

	const origin = findElement('#origin', '.target');

	expect(origin).toBeInstanceOf(HTMLDivElement);
	expect(origin?.id).toBe('origin');

	const child = $('*', origin);

	expect(child).toBeInstanceOf(HTMLSpanElement);
	expect(child?.id).toBe('hover');
	expect(child?.textContent).toBe('hello');
});

test('findElements', () => {
	const elements = findElements('.target');

	expect(elements.length).toBe(1);
	expect(elements[0].classList.contains('target')).toBe(true);

	let origin = findElements('#origin', '.target');

	expect(origin.length).toBe(1);
	expect(origin[0].id).toBe('origin');

	origin = findElements(origin, findElement('.target'));

	expect(origin.length).toBe(1);
	expect(origin[0].id).toBe('origin');

	const children = $$('*', origin);

	expect(children.length).toBe(1);
	expect(children[0].id).toBe('hover');
	expect(children[0].textContent).toBe('hello');

	expect(
		// @ts-expect-error Testing invalid input
		findElements([123, 'a', document.body, ...origin, ...children], document)
			.length,
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

	const divOrigin = $('div.origin', element);
	const liOrigin = $('li.origin', element);
	const buttonOrigin = $('button.origin', element);

	if (divOrigin == null || liOrigin == null || buttonOrigin == null) {
		return;
	}

	const divTargets = findRelatives(divOrigin, 'div.target', element);
	const liTargets = findRelatives(liOrigin, 'li.target', element);
	const buttonTargets = findRelatives(buttonOrigin, 'li.target', element);

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

	expect(findRelatives(buttonOrigin, 'button.origin', element)[0]).toBe(
		buttonOrigin,
	);

	expect(findRelatives(liOrigin, '.not-found').length).toBe(0);
});
