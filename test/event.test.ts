import {expect, test} from 'vitest';
import {dispatch, getPosition, off, on} from '../src/event';

test('dispatch', () => {
	let value = 0;

	function custom(event: Event) {
		value += 1;

		expect(event).toBeInstanceOf(value === 3 ? CustomEvent : Event);
		expect(event.type).toBe(value === 3 ? 'dblclick' : 'hello');
		expect(event.bubbles).toBe(value === 3);
		expect(event.cancelable).toBe(value === 3);
		expect(event.composed).toBe(value === 3);

		expect((event as unknown as CustomEvent).detail).toEqual(
			value === 3 ? {a: {b: 'c'}} : undefined,
		);

		target.textContent = String(value);
	}

	function native(event: Event) {
		value += 1;

		expect(event).toBeInstanceOf(Event);
		expect(event.type).toBe(value === 1 ? 'click' : 'focus');
		expect(event.bubbles).toBe(value !== 1);
		expect(event.cancelable).toBe(value !== 1);
		expect(event.composed).toBe(value !== 1);

		target.textContent = String(value);
	}

	const target = document.createElement('div');

	target.textContent = 'Hello, world!';

	on(target, 'click', native);
	on(target, 'focus', native);
	on(target, 'dblclick', custom);
	on(target, 'hello', custom);

	expect(target.textContent).toBe('Hello, world!');

	dispatch(target, 'click');

	expect(target.textContent).toBe('1');

	dispatch(target, 'focus', {
		bubbles: true,
		cancelable: true,
		composed: true,
	});

	expect(target.textContent).toBe('2');

	dispatch(target, 'dblclick', {
		bubbles: true,
		cancelable: true,
		composed: true,
		detail: {a: {b: 'c'}},
	});

	expect(target.textContent).toBe('3');

	dispatch(target, 'hello');

	expect(target.textContent).toBe('4');
});

test('getPosition', () => {
	const event = new MouseEvent('click', {
		clientX: 10,
		clientY: 20,
	});

	const touchEvent = new TouchEvent('touchstart', {
		touches: [
			new Touch({
				clientX: 20,
				clientY: 10,
				identifier: -1,
				target: document.body,
			}),
		],
	});

	const position = getPosition(event);
	const touchPosition = getPosition(touchEvent);

	expect(position?.x).toBe(10);
	expect(position?.y).toBe(20);

	expect(touchPosition?.x).toBe(20);
	expect(touchPosition?.y).toBe(10);

	// @ts-expect-error Testing invalid input
	expect(getPosition(123)).toBeUndefined();

	// @ts-expect-error Testing invalid input
	expect(getPosition([])).toBeUndefined();
});

test('on & off', () => {
	const abortController = new AbortController();
	const values = [0, 0, 0, 0];

	function onOnce() {
		values[0] += 1;
	}

	function onOne() {
		values[1] += 1;
	}

	const target = document.createElement('div');

	on(target, 'click', onOnce, {once: true});
	on(target, 'click', onOne);

	on(
		target,
		'click',
		() => {
			if (!abortController.signal.aborted) {
				values[3] += 1;
			}
		},
		{signal: abortController.signal},
	);

	const remove = on(target, 'click', () => {
		values[2] += 1;
	});

	for (let index = 0; index < 10; index += 1) {
		dispatch(target, 'click');
	}

	expect(values).toEqual([1, 10, 10, 10]);

	abortController.abort();

	off(target, 'click', onOne);
	remove();

	for (let index = 0; index < 10; index += 1) {
		dispatch(target, 'click');
	}

	expect(values).toEqual([1, 10, 10, 10]);
});
