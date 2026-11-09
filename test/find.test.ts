import {afterAll, afterEach, expect, test, vi} from 'vite-plus/test';
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

afterEach(() => {
	vi.restoreAllMocks();
});

test('getElementFromPosition', () => {
	// jsdom has no `elementFromPoint`
	expect(Find.getElementFromPosition({x: 0, y: 0})).toEqual([]);

	const original = document.elementFromPoint;

	const outer = document.createElement('div');
	const middle = document.createElement('p');
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	const inner = document.createElement('span');

	// Pre-existing inline value and priority should be restored
	middle.style.setProperty('pointer-events', 'auto', 'important');

	const stack = (...elements: (Element | null)[]) => {
		const queue = [...elements];

		document.elementFromPoint = vi.fn(() => queue.shift() ?? null);
	};

	try {
		expect(Find.getElementFromPosition({x: 'a', y: 0} as never)).toEqual([]);

		stack(inner, svg, middle, outer, null);

		expect(Find.getElementFromPosition({x: 1, y: 2})).toEqual([inner, svg, middle, outer]);
		expect(document.elementFromPoint).toHaveBeenCalledWith(1, 2);

		// Restored
		expect(inner.style.getPropertyValue('pointer-events')).toBe('');
		expect(svg.style.getPropertyValue('pointer-events')).toBe('');
		expect(middle.style.getPropertyValue('pointer-events')).toBe('auto');
		expect(middle.style.getPropertyPriority('pointer-events')).toBe('important');

		// Same element twice, i.e., hiding did not work
		stack(inner, inner);

		expect(Find.getElementFromPosition({x: 0, y: 0})).toEqual([inner]);

		// Nothing found
		stack(null);

		expect(Find.getElementFromPosition({x: 0, y: 0})).toEqual([]);

		// Elements without inline styles cannot be hidden, so the search ends
		const plain = document.createElementNS('urn:test', 'plain');

		stack(inner, plain, outer);

		expect(Find.getElementFromPosition({x: 0, y: 0})).toEqual([inner]);
	} finally {
		document.elementFromPoint = original;
	}
});

test('getElementUnderPointer', () => {
	// jsdom never matches `:hover`, so the list of hovered elements is stubbed
	const origin = document.getElementById('origin') as HTMLElement;
	const ignored = document.getElementById('hover') as HTMLElement;

	const hidden = document.createElement('span');

	hidden.style.visibility = 'hidden';

	const stub = (...elements: Element[]) =>
		vi
			.spyOn(document, 'querySelectorAll')
			.mockReturnValue(elements as unknown as NodeListOf<Element>);

	expect(Find.getElementUnderPointer()).toBe(null);

	stub();

	expect(Find.getElementUnderPointer()).toBe(null);

	// `head` is always skipped
	stub(document.head);

	expect(Find.getElementUnderPointer(true)).toBe(null);

	// `pointer-events: none` is ignored by default...
	stub(document.documentElement, origin, ignored);

	expect(Find.getElementUnderPointer()).toBe(origin);
	expect(Find.getElementUnderPointer(false)).toBe(origin);

	// ...unless skipping ignore
	expect(Find.getElementUnderPointer(true)).toBe(ignored);

	// `visibility: hidden` is ignored by default
	stub(document.head, origin, hidden);

	expect(Find.getElementUnderPointer()).toBe(origin);
	expect(Find.getElementUnderPointer(true)).toBe(hidden);

	// Everything ignored
	stub(ignored, hidden);

	expect(Find.getElementUnderPointer()).toBe(null);
});

test('getDistance', () => {
	const root = document.createElement('div');

	root.innerHTML = `<div id="a">
	<div id="a1">
		<span id="a1x"></span>
	</div>
	<div id="a2"></div>
</div>
<div id="b">
	<div id="b1"></div>
</div>
<p id="c"></p>`;

	const get = (id: string) => root.querySelector(`#${id}`) as Element;

	const [a, a1, a1x, a2, b, b1, c] = ['a', 'a1', 'a1x', 'a2', 'b', 'b1', 'c'].map(get);

	// Same element
	expect(Find.getDistance(a, a)).toBe(0);

	// Parent and child
	expect(Find.getDistance(a, a1)).toBe(1);
	expect(Find.getDistance(a1, a)).toBe(1);

	// Siblings
	expect(Find.getDistance(a1, a2)).toBe(1);
	expect(Find.getDistance(a, b)).toBe(1);
	expect(Find.getDistance(a, c)).toBe(2);

	// Further apart
	expect(Find.getDistance(a1x, a)).toBe(2);
	expect(Find.getDistance(a1x, a2)).toBe(2);
	expect(Find.getDistance(a1x, b)).toBe(3);
	expect(Find.getDistance(a1x, b1)).toBe(4);
	expect(Find.getDistance(a1x, c)).toBe(4);
	expect(Find.getDistance(b1, c)).toBe(2);

	// Distance is the same in both directions
	for (const from of [a, a1, a1x, a2, b, b1, c]) {
		for (const to of [a, a1, a1x, a2, b, b1, c]) {
			expect(Find.getDistance(from, to)).toBe(Find.getDistance(to, from));
		}
	}

	// Not in the same tree
	expect(Find.getDistance(a, document.createElement('div'))).toBe(-1);
	expect(Find.getDistance(a1x, document.createElement('div'))).toBe(-1);

	// Same tree, but no shared ancestor element
	const fragment = document.createDocumentFragment();
	const first = document.createElement('div');
	const second = document.createElement('div');

	first.innerHTML = '<span></span>';
	fragment.append(first, second);

	expect(Find.getDistance(first, second)).toBe(-1);
	expect(Find.getDistance(first.firstElementChild as Element, second)).toBe(-1);
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

	expect(Find.findAncestor(origin, element => (element as HTMLElement).hidden === true)).toBe(
		hidden,
	);
	expect(Find.findAncestor(event, element => (element as HTMLElement).hidden === true)).toBe(
		hidden,
	);
	expect(
		Find.findAncestor(event.target!, element => (element as HTMLElement).hidden === true),
	).toBe(hidden);

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

	// Documents resolve to their body, other nodes are ignored, and duplicates are removed
	const text = document.createTextNode('text');
	const comment = document.createComment('comment');

	expect(Find.findElements([document, document.body, text, comment] as never)).toEqual([
		document.body,
	]);

	// Elements outside of the context are removed
	expect(Find.findElements([document.body, origin[0]] as never, origin[0])).toEqual([origin[0]]);

	expect(Find.findElements(document.querySelectorAll('span')).length).toBe(1);
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

	liTargets = Find.findRelatives(targetsOrigin, '.target', element) as HTMLLIElement[];

	expect(liTargets.length).toBe(6);
	expect(liTargets.map(t => t.textContent?.trim())).toEqual(['L1', 'L2', 'L3', 'L5', 'L6', 'L7']);

	liTargets = Find.findRelatives(targetsOrigin, '.origin', element) as HTMLLIElement[];

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
