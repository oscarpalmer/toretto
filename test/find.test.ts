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

	const event = new Event('click');

	Object.defineProperty(event, 'target', {
		value: origin,
		writable: false,
	});

	expect(Find.findAncestor(origin, '#origin')).toBe(origin);
	expect(Find.findAncestor(event, '#origin')).toBe(origin);
	expect(Find.findAncestor(event.target!, '#origin')).toBe(origin);

	expect(Find.findAncestor(origin, '.target')).toBe(target);
	expect(Find.findAncestor(event, '.target')).toBe(target);
	expect(Find.findAncestor(event.target!, '.target')).toBe(target);

	expect(Find.findAncestor(origin, element => element.id === 'origin')).toBe(origin);
	expect(Find.findAncestor(event, element => element.id === 'origin')).toBe(origin);
	expect(Find.findAncestor(event.target!, element => element.id === 'origin')).toBe(origin);

	expect(Find.findAncestor(origin, element => (element as HTMLElement).hidden)).toBe(hidden);
	expect(Find.findAncestor(event, element => (element as HTMLElement).hidden)).toBe(hidden);
	expect(Find.findAncestor(event.target!, element => (element as HTMLElement).hidden)).toBe(hidden);

	expect(Find.findAncestor(origin, 'noop')).toBe(null);
	expect(Find.findAncestor(event, 'noop')).toBe(null);
	expect(Find.findAncestor(event.target!, 'noop')).toBe(null);

	expect(Find.findAncestor(origin, element => element.tagName === 'noop')).toBe(null);
	expect(Find.findAncestor(event, element => element.tagName === 'noop')).toBe(null);
	expect(Find.findAncestor(event.target!, element => element.tagName === 'noop')).toBe(null);

	const globalEvent = new Event('click');

	Object.defineProperty(globalEvent, 'target', {
		value: globalThis,
		writable: false,
	});

	expect(Find.findAncestor(globalEvent, 'div')).toBe(null);

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
		Find.findElements([123, 'a', document.body, ...origin, ...children] as never, document).length,
	).toBe(3);
});

test('findRelatives', () => {
	const template = `<div>
	<div>
		<div>
			<div class="target">D1</div>
		</div>
	</div>
	<div>
		<div class="target">D2</div>
	</div>
	<div>
		<div class="origin">
			<p>P1</p>
			<div>
				<div>
					<div class="target">
						<p>P2</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<ul class="targets">
	<li class="target">L1</li>
	<li class="target">L2</li>
	<li class="target">L3</li>
	<li class="origin" id="four">L4</li>
	<li class="target">L5</li>
	<li class="target">L6</li>
	<li class="target">L7</li>
</ul>

<ul>
	<li class="target"><button>B1</button></li>
	<li class="target"><button>B2</button></li>
	<li class="target"><button class="origin">B3</button></li>
	<li class="target"><button>B4</button></li>
	<li class="target"><button>B5</button></li>
</ul>

<div>
	<span class="origin"></span>
	<div>
		<div>
			<span class="target"></span>
		</div>
	</div>
</div>`;

	const element = document.createElement('div');

	element.innerHTML = template;

	const buttonOrigin = Find.$('button.origin', element);
	const divOrigin = Find.$('div.origin', element);
	const liOrigin = Find.$('li.origin', element);
	const spanOrigin = Find.$('span.origin', element);
	const targetsOrigin = Find.$('.targets', element);

	if (
		buttonOrigin == null ||
		divOrigin == null ||
		liOrigin == null ||
		spanOrigin == null ||
		targetsOrigin == null
	) {
		return;
	}

	const divTargets = Find.findRelatives(divOrigin, 'div.target', element);

	expect(divTargets.length).toBe(2);
	expect(divTargets.map(target => target.textContent?.trim())).toEqual(['D2', 'P2']);

	let liTargets = Find.findRelatives(liOrigin, 'li', element);

	expect(liTargets.length).toBe(2);
	expect(liTargets.map(target => target.textContent?.trim())).toEqual(['L3', 'L5']);

	const buttonTargets = Find.findRelatives(buttonOrigin, 'li.target', element);

	expect(buttonTargets.length).toBe(1);
	expect(buttonTargets[0].textContent?.trim()).toBe('B3');

	liTargets = Find.findRelatives(targetsOrigin, '.target', element);

	expect(liTargets.length).toBe(6);
	expect(liTargets.map(t => t.textContent?.trim())).toEqual(['L1', 'L2', 'L3', 'L5', 'L6', 'L7']);

	liTargets = Find.findRelatives(targetsOrigin, '.origin', element);

	expect(liTargets.length).toBe(1);
	expect(liTargets.map(t => t.textContent?.trim())).toEqual(['L4']);

	expect(Find.findRelatives(buttonOrigin, 'button.origin', element)).toEqual([]);
	expect(Find.findRelatives(liOrigin, '.not-found')).toEqual([]);

	const floatingOne = document.createElement('div');
	const floatingTwo = document.createElement('div');

	expect(Find.findRelatives(floatingOne, 'div', element)).toEqual([]);
	expect(Find.findRelatives(divOrigin, 'div', floatingTwo)).toEqual([]);
	expect(Find.findRelatives(floatingOne, 'div', floatingTwo)).toEqual([]);

	expect(Find.findRelatives(123 as never, 'blah')).toEqual([]);
	expect(Find.findRelatives(divOrigin, 123 as never)).toEqual([]);
});
