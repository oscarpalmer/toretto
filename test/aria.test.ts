import {expect, test} from 'vitest';
import {getAria, getRole, setAria, setRole} from '../src/aria';

test('getAria + setAria', () => {
	const element = document.createElement('div');

	expect(getAria(element, 'label')).toBeUndefined();

	expect(getAria(element)).toEqual({});

	setAria(element, 'label', 'Name');

	expect(getAria(element, 'label')).toBe('Name');

	expect(getAria(element, ['label'])).toEqual({
		label: 'Name',
	});

	expect(getAria(element)).toEqual({
		label: 'Name',
	});

	setAria(element, {
		label: 'Name (updated)',
		hidden: true,
		selected: 'FALSE',
		valuenow: 123,
	});

	expect(getAria(element, [123 as never, 'aria-label', 'hidden', 'selected', 'valuenow'])).toEqual({
		label: 'Name (updated)',
		hidden: true,
		selected: false,
		valuenow: 123,
	});

	expect(getAria(element)).toEqual({
		label: 'Name (updated)',
		hidden: true,
		selected: false,
		valuenow: 123,
	});

	setAria(element, {
		label: 'Name (updated, again)',
		hidden: undefined,
		selected: 'tRuE',
		valuenow: 'hmm',
	});

	expect(getAria(element, ['label', 'hidden', 'selected', 'valuenow'])).toEqual({
		label: 'Name (updated, again)',
		hidden: undefined,
		selected: true,
		valuenow: 'hmm',
	});

	expect(getAria(element)).toEqual({
		label: 'Name (updated, again)',
		hidden: undefined,
		selected: true,
		valuenow: 'hmm',
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
