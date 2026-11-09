import {beforeEach, expect, test} from 'vite-plus/test';
import {getFocusable, getTabbable} from '../../src/focusable';
import {editableExplicitTabindex, editableValues} from '../.fixtures/focusable.fixture';
import {stubLayout} from '../.helpers/layout';

stubLayout();

beforeEach(() => {
	document.body.innerHTML = '';
});

test('filter editable: only "", "true" (any case) and "plaintext-only" are tabbable', () => {
	document.body.innerHTML = editableValues;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(5);
	expect(tabbable.length).toBe(4);

	expect(focusable.map(el => el.id)).toEqual([
		'empty',
		'true',
		'upper-case',
		'plaintext-only',
		'invalid',
	]);
	expect(tabbable.map(el => el.id)).toEqual(['empty', 'true', 'upper-case', 'plaintext-only']);
});

test('filter editable: an explicit tabindex overrides the editable default', () => {
	document.body.innerHTML = editableExplicitTabindex;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(3);
	expect(tabbable.length).toBe(2);

	expect(focusable.map(el => el.id)).toEqual(['two', 'negative', 'one']);
	expect(tabbable.map(el => el.id)).toEqual(['one', 'two']);
});
