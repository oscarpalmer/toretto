import {expect, test} from 'vitest';
import {getAria, getRole, setAria, setRole} from '../src/aria';

test('getAria + setAria', () => {
	const element = document.createElement('div');

	expect(getAria(element, 'label')).toBeUndefined();

	setAria(element, 'label', 'Name');

	expect(getAria(element, 'label')).toBe('Name');

	expect(getAria(element, ['label'])).toEqual({
		label: 'Name',
	});

	setAria(element, {
		label: 'Name (updated)',
		hidden: true,
	});

	expect(getAria(element, [123 as never, 'aria-label', 'hidden'])).toEqual({
		label: 'Name (updated)',
		hidden: 'true',
	});

	expect(getAria(123 as never, 'label')).toBeUndefined();
	expect(getAria(123 as never, [])).toEqual({});
	expect(getAria(element, 123 as never)).toBeUndefined();
});

test('getRole + setRole', () => {
	const element = document.createElement('div');

	expect(getRole(element)).toBeUndefined();

	setRole(element, 'button');

	expect(getRole(element)).toBe('button');

	setRole(element);

	expect(getRole(element)).toBeUndefined();

	expect(getRole(null as never)).toBeUndefined();

	setRole(123 as never, 'button');
	setRole(element, 123 as never);
});
