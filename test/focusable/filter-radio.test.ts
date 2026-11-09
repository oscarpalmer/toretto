import {beforeEach, expect, test} from 'vite-plus/test';
import {getFocusable, getTabbable} from '../../src/focusable';
import {stubLayout} from '../.helpers/layout';
import {
	radioEscapedName,
	radioForms,
	radioNameless,
	radioNoneChecked,
	radioOneChecked,
} from '../.fixtures/focusable.fixture';

stubLayout();

beforeEach(() => {
	document.body.innerHTML = '';
});

test('filter radio: all radios are tabbable when none is checked', () => {
	document.body.innerHTML = radioNoneChecked;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(2);
	expect(tabbable.length).toBe(2);

	expect(focusable.map(element => element.id)).toEqual(['first', 'second']);
	expect(tabbable.map(element => element.id)).toEqual(['first', 'second']);
});

test('filter radio: only the checked radio is tabbable', () => {
	document.body.innerHTML = radioOneChecked;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(3);
	expect(tabbable.length).toBe(1);

	expect(focusable.map(element => element.id)).toEqual(['first', 'second', 'third']);
	expect(tabbable[0].id).toBe('second');
});

test('filter radio: radios in different forms are separate groups', () => {
	document.body.innerHTML = radioForms;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(4);
	expect(tabbable.length).toBe(3);

	expect(focusable.map(element => element.id)).toEqual([
		'first-checked',
		'first-unchecked',
		'second-a',
		'second-b',
	]);
	expect(tabbable.map(element => element.id)).toEqual(['first-checked', 'second-a', 'second-b']);
});

test('filter radio: a radio without a name is always tabbable', () => {
	document.body.innerHTML = radioNameless;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(2);
	expect(tabbable.length).toBe(2);

	expect(focusable.map(element => element.id)).toEqual(['nameless', 'named']);
	expect(tabbable.map(element => element.id)).toEqual(['nameless', 'named']);
});

test('filter radio: handles names that need CSS escaping', () => {
	document.body.innerHTML = radioEscapedName;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(6);
	expect(tabbable.length).toBe(3);

	expect(focusable.map(element => element.id)).toEqual([
		'dot-checked',
		'dot-unchecked',
		'quote-checked',
		'quote-unchecked',
		'bracket-checked',
		'bracket-unchecked',
	]);

	expect(tabbable.map(element => element.id)).toEqual([
		'dot-checked',
		'quote-checked',
		'bracket-checked',
	]);
});
