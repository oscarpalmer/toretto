import {noop} from '@oscarpalmer/atoms/function';
import {afterEach, expect, test} from 'vitest';
import * as Evt from '../src/event/index';
import type {RemovableEventListener} from '../src/models';

class FakeTouch {
	clientX: number;
	clientY: number;
	identifier: number;
	target: EventTarget;

	constructor(init: FakeTouchInit) {
		this.clientX = init.clientX;
		this.clientY = init.clientY;
		this.identifier = init.identifier;
		this.target = init.target;
	}
}

type FakeTouchInit = {
	clientX: number;
	clientY: number;
	identifier: number;
	target: EventTarget;
};

afterEach(() => {
	document.body.innerHTML = '';
});

test('dispatch', () => {
	let value = 0;

	function custom(event: Event): void {
		value += 1;

		expect(event).toBeInstanceOf(value === 3 ? CustomEvent : Event);
		expect(event.type).toBe(value === 3 ? 'dblclick' : 'hello');
		expect(event.bubbles).toBe(true);
		expect(event.cancelable).toBe(true);
		expect(event.composed).toBe(value === 3);

		expect((event as unknown as CustomEvent).detail).toEqual(
			value === 3 ? {a: {b: 'c'}} : undefined,
		);

		target.textContent = String(value);
	}

	function native(event: Event): void {
		value += 1;

		expect(event).toBeInstanceOf(Event);
		expect(event.type).toBe(value === 1 ? 'click' : 'focus');
		expect(event.bubbles).toBe(value === 1);
		expect(event.cancelable).toBe(value === 1);
		expect(event.composed).toBe(value !== 1);

		target.textContent = String(value);
	}

	const target = document.createElement('div');

	target.textContent = 'Hello, world!';

	document.body.append(target);

	Evt.on(target, 'click', native, {capture: true});
	Evt.on(target, 'focus', native);
	Evt.on(target, 'dblclick', custom);
	Evt.on(target, 'hello', custom);

	expect(target.textContent).toBe('Hello, world!');

	Evt.dispatch(target, 'click');
	Evt.dispatch(123 as never, 'click');
	Evt.dispatch(target, 123 as never);

	expect(target.textContent).toBe('1');

	Evt.dispatch(target, 'focus', {
		bubbles: false,
		cancelable: false,
		composed: true,
	});

	expect(target.textContent).toBe('2');

	Evt.dispatch(target, 'dblclick', {
		composed: true,
		detail: {a: {b: 'c'}},
	});

	expect(target.textContent).toBe('3');

	Evt.dispatch(target, 'hello');

	expect(target.textContent).toBe('4');
});

test('dispatch:global', () =>
	new Promise<void>(done => {
		let fromDocument: string | undefined;
		let fromWindow: string | undefined;

		Evt.on(document, 'fromDocument', () => {
			fromDocument = 'fromDocument';
		});

		Evt.on(window, 'fromWindow', (event: CustomEvent) => {
			fromWindow = event.detail;
		});

		Evt.dispatch(document, 'fromDocument', {
			detail: 'fromDocument',
		});

		Evt.dispatch(window, 'fromWindow', {
			detail: 'fromWindow',
		});

		setTimeout(() => {
			expect(fromDocument).toBe('fromDocument');
			expect(fromWindow).toBe('fromWindow');

			done();
		}, 125);
	}));

test('getPosition', () => {
	const event = new MouseEvent('click', {
		clientX: 10,
		clientY: 20,
	});

	const touchEvent = new TouchEvent('touchstart', {
		touches: [
			new FakeTouch({
				clientX: 20,
				clientY: 10,
				identifier: -1,
				target: document.body,
			}) as unknown as Touch,
		],
	});

	const position = Evt.getPosition(event);
	const touchPosition = Evt.getPosition(touchEvent);

	expect(position?.x).toBe(10);
	expect(position?.y).toBe(20);

	expect(touchPosition?.x).toBe(20);
	expect(touchPosition?.y).toBe(10);

	// @ts-expect-error Testing invalid input
	expect(Evt.getPosition(123)).toBeUndefined();

	// @ts-expect-error Testing invalid input
	expect(Evt.getPosition([])).toBeUndefined();
});

test('on & off (direct)', () => {
	const abortController = new AbortController();
	const values = [0, 0, 0, 0];

	function onOnce(): void {
		values[0] += 1;
	}

	function onOne(): void {
		values[1] += 1;
	}

	const target = document.createElement('div');

	Evt.on(target, 'click', onOnce, {once: true});
	Evt.on(target, 'click', onOne, {capture: true});

	Evt.on(
		target,
		'click',
		() => {
			if (!abortController.signal.aborted) {
				values[3] += 1;
			}
		},
		{signal: abortController.signal},
	);

	const remove = Evt.on(
		target,
		'click',
		() => {
			values[2] += 1;
		},
		{capture: true},
	);

	for (let index = 0; index < 10; index += 1) {
		Evt.dispatch(target, 'click');
	}

	expect(values).toEqual([1, 10, 10, 10]);

	abortController.abort();

	Evt.off(target, 'click', onOne, {capture: true});

	remove();

	for (let index = 0; index < 10; index += 1) {
		Evt.dispatch(target, 'click');
	}

	expect(values).toEqual([1, 10, 10, 10]);

	const fail = Evt.on(123 as never, 'click', () => {});

	expect(fail).toBe(noop);

	Evt.off(123 as never, 'click', onOnce);
	Evt.off(target, 123 as never, onOnce);
	Evt.off(target, 'click', 123 as never);
});

test('on & off (delegated)', () => {
	const target = document.createElement('div');

	target.id = 'one';
	target.innerHTML = `<div id="two"><div id="three"><div id="four"></div></div></div>`;

	document.body.append(target);

	function handler(event: Event): void {
		const div = event.currentTarget as HTMLDivElement;
		const {id} = div;

		if (id === 'three' && stop) {
			event.stopPropagation();
		}

		expect((event.currentTarget as Element).id).toBe(id);
		expect((event.target as Element).id).toBe('four');

		values.push(id);
	}

	const listeners: RemovableEventListener[] = [];
	const values: string[] = [];

	let stop = false;

	const divs = [...document.querySelectorAll('div[id]')] as HTMLDivElement[];

	const remove = Evt.on(document, 'click', () => {
		values.push('document');
	});

	for (const div of divs) {
		listeners.push(
			Evt.on(div, 'click', handler, {
				passive: div.id !== 'two',
			}),
		);

		const handlers = (div as any)[`@click:${div.id === 'two' ? 'active' : 'passive'}`];

		expect(handlers).toBeInstanceOf(Set);
		expect(handlers.size).toBe(1);
	}

	let handlers = (document as any)['@click:passive'];

	expect(handlers).toBeInstanceOf(Set);
	expect(handlers.size).toBe(1);

	expect((document as any)['@click:active.count']).toBe(1);
	expect((document as any)['@click:passive.count']).toBe(4);

	const last = divs.at(-1);

	last?.click();

	expect(values).toEqual(['four', 'three', 'one', 'document', 'two']);

	stop = true;

	last?.click();

	expect(values).toEqual(['four', 'three', 'one', 'document', 'two', 'four', 'three', 'two']);

	if (last != null) {
		Evt.off(last, 'click', handler);
	}

	handlers = (document as any)['@click:passive'];

	expect(handlers).toBeInstanceOf(Set);
	expect(handlers.size).toBe(1);

	expect((document as any)['@click:active.count']).toBe(1);
	expect((document as any)['@click:passive.count']).toBe(3);

	for (const listener of listeners) {
		listener();
	}

	for (const div of divs) {
		const handlers = (div as any)[`@click:${div.id === 'two' ? 'active' : 'passive'}`];

		expect(handlers).toBeUndefined();
	}

	handlers = (document as any)['@click:passive'];

	expect(handlers).toBeInstanceOf(Set);
	expect(handlers.size).toBe(1);

	expect((document as any)['@click:active.count']).toBeUndefined();
	expect((document as any)['@click:passive.count']).toBe(1);

	last?.click();

	expect(values).toEqual([
		'four',
		'three',
		'one',
		'document',
		'two',
		'four',
		'three',
		'two',
		'document',
	]);

	remove();

	handlers = (document as any)['@click:passive'];

	expect(handlers).toBeUndefined();

	expect((document as any)['@click:active.count']).toBeUndefined();
	expect((document as any)['@click:passive.count']).toBeUndefined();

	expect(values).toEqual([
		'four',
		'three',
		'one',
		'document',
		'two',
		'four',
		'three',
		'two',
		'document',
	]);
});

test('on & off (delegated, multiple on single element)', () => {
	const div = document.createElement('div');

	document.body.append(div);

	const listeners = {
		first: Evt.on(div, 'click', () => {
			values.first += 1;
		}),
		second: Evt.on(div, 'click', () => {
			values.second += 1;
		}),
	};

	const values = {
		first: 0,
		second: 0,
	};

	expect((div as any)['@click:passive']).toBeInstanceOf(Set);
	expect((div as any)['@click:passive'].size).toBe(2);
	expect((document as any)['@click:passive.count']).toBe(2);

	div.click();

	expect(values).toEqual({
		first: 1,
		second: 1,
	});

	listeners.first();

	expect((div as any)['@click:passive']).toBeInstanceOf(Set);
	expect((div as any)['@click:passive'].size).toBe(1);
	expect((document as any)['@click:passive.count']).toBe(1);

	div.click();

	expect(values).toEqual({
		first: 1,
		second: 2,
	});

	listeners.second();

	expect((div as any)['@click:passive']).toBeUndefined();
	expect((document as any)['@click:passive.count']).toBeUndefined();

	div.click();

	expect(values).toEqual({
		first: 1,
		second: 2,
	});
});
