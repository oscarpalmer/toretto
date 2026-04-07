import {expect, test} from 'vitest';
import {createElement, getProperties, getProperty, on, setProperties, setProperty} from '../src';

test('', () => {
	const div = createElement('div');
	const input = createElement('input');

	expect(getProperty(div, 'type' as never)).toBeUndefined();
	expect(getProperty(input, 'type')).toBe('text');

	setProperty(div, 'type' as never, 'should be ignored' as never);
	setProperty(input, 'type', 'number');

	expect(getProperty(div, 'type' as never)).toBeUndefined();
	expect(getProperty(input, 'type')).toBe('number');

	setProperties(div, {
		[123 as never]: 'should be ignored' as never,
		hidden: true,
		['type' as never]: 'should be ignored' as never,
	});

	setProperties(input, {
		disabled: true,
		type: 'email',
	});

	expect(getProperties(div, [123 as never, 'hidden', 'type' as never])).toEqual({
		hidden: true,
	});

	expect(getProperties(input, ['disabled', 'type'])).toEqual({
		disabled: true,
		type: 'email',
	});

	const checkbox = createElement('input', {
		type: 'checkbox',
	});

	let count = 0;

	const listener = on(checkbox, 'change', () => {
		count += 1;
	});

	expect(count).toBe(0);

	setProperty(checkbox, 'checked', true);

	expect(count).toBe(1);

	setProperty(checkbox, 'checked', false, false);

	expect(count).toBe(1);

	listener();

	setProperty('blah' as never, 'should be ignored' as never, 'ignored' as never);

	expect(getProperty('blah' as never, 'should be ignored' as never)).toBeUndefined();

	setProperties('blah' as never, {} as never);

	expect(getProperties('blah' as never, [] as never)).toEqual({});
});
