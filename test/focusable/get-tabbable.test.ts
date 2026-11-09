import {beforeEach, expect, test} from 'vite-plus/test';
import {getTabbable} from '../../src/focusable';
import {
	tabindexInvalid,
	tabindexNegative,
	tabindexOrder,
	tabindexSpecial,
} from '../.fixtures/focusable.fixture';
import {miscFixture} from '../.fixtures/misc.fixture';
import {stubLayout} from '../.helpers/layout';

stubLayout();

beforeEach(() => {
	document.body.innerHTML = '';
});

test('getTabbable: returns [] for a non-element parent', () => {
	for (let index = 0; index < miscFixture.length; index += 1) {
		expect(getTabbable(miscFixture.values[index] as never)).toEqual([]);
	}
});

test('getTabbable: returns [] for an empty parent', () => {
	const empty = document.createElement('div');

	expect(getTabbable(empty)).toEqual([]);
});

test('getTabbable: orders positive tabindex ascending before zero, keeping document order for ties', () => {
	document.body.innerHTML = tabindexOrder;

	const tabbable = getTabbable(document.body);

	expect(tabbable.length).toBe(5);

	expect(tabbable.map(element => element.id)).toEqual([
		'one-first',
		'one-second',
		'two',
		'zero-first',
		'zero-second',
	]);
});

test('getTabbable: excludes negative tabindex, unlike getFocusable', () => {
	document.body.innerHTML = tabindexNegative;

	const tabbable = getTabbable(document.body);

	expect(tabbable.length).toBe(1);

	expect(tabbable[0].id).toBe('default');
});

test('getTabbable: treats a non-numeric tabindex as the default', () => {
	document.body.innerHTML = tabindexInvalid;

	const tabbable = getTabbable(document.body);

	expect(tabbable.length).toBe(2);

	expect(tabbable.map(element => element.id)).toEqual(['invalid', 'button']);
});

test('getTabbable: gives details, audio and video a base tabindex unless explicit', () => {
	document.body.innerHTML = tabindexSpecial;

	const tabbable = getTabbable(document.body);

	expect(tabbable.length).toBe(3);

	expect(tabbable.map(element => element.id)).toEqual(['details', 'audio', 'video']);
});
