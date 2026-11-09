import {beforeEach, expect, test} from 'vite-plus/test';
import {getFocusable, getTabbable, isFocusable, isTabbable} from '../../src/focusable';
import {isFocusableTabbable} from '../.fixtures/focusable.fixture';
import {miscFixture} from '../.fixtures/misc.fixture';
import {stubLayout} from '../.helpers/layout';

stubLayout();

beforeEach(() => {
	document.body.innerHTML = '';
});

test('isFocusable: false for non-elements', () => {
	for (let index = 0; index < miscFixture.length; index += 1) {
		expect(isFocusable(miscFixture.values[index])).toBe(false);
	}
});

test('isTabbable: false for non-elements', () => {
	for (let index = 0; index < miscFixture.length; index += 1) {
		expect(isTabbable(miscFixture.values[index])).toBe(false);
	}
});

test('isFocusable: true for every element getFocusable returns', () => {
	document.body.innerHTML = isFocusableTabbable;

	const focusable = getFocusable(document.body);

	expect(focusable.length).toBe(4);

	expect(focusable.map(element => element.id)).toEqual(['link', 'enabled', 'checked', 'unchecked']);
	expect(focusable.every(isFocusable)).toBe(true);
});

test('isTabbable: true for every element getTabbable returns', () => {
	document.body.innerHTML = isFocusableTabbable;

	const tabbable = getTabbable(document.body);

	expect(tabbable.length).toBe(3);

	expect(tabbable.map(element => element.id)).toEqual(['link', 'enabled', 'checked']);
	expect(tabbable.every(isTabbable)).toBe(true);
});
