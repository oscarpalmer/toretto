import {beforeEach, expect, test} from 'vite-plus/test';
import {getFocusable, getTabbable} from '../../src/focusable';
import {
	hiddenAttribute,
	hiddenDetails,
	hiddenDetailsNested,
	hiddenDisplay,
	hiddenInputType,
	hiddenVisibility,
	hiddenVisibilityInherited,
	hiddenZeroSize,
} from '../.fixtures/focusable.fixture';
import {stubLayout} from '../.helpers/layout';

stubLayout();

beforeEach(() => {
	document.body.innerHTML = '';
});

test('filter hidden: excludes elements with the hidden attribute', () => {
	document.body.innerHTML = hiddenAttribute;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(1);
	expect(tabbable.length).toBe(1);

	expect(focusable[0].id).toBe('visible');
	expect(tabbable[0].id).toBe('visible');
});

test('filter hidden: input[type=hidden]', () => {
	document.body.innerHTML = hiddenInputType;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(1);
	expect(tabbable.length).toBe(1);

	expect(focusable[0].id).toBe('visible');
	expect(tabbable[0].id).toBe('visible');
});

test('filter hidden: excludes display: none', () => {
	document.body.innerHTML = hiddenDisplay;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(1);
	expect(tabbable.length).toBe(1);

	expect(focusable[0].id).toBe('visible');
	expect(tabbable[0].id).toBe('visible');
});

test('filter hidden: excludes visibility: hidden', () => {
	document.body.innerHTML = hiddenVisibility;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(1);
	expect(tabbable.length).toBe(1);

	expect(focusable[0].id).toBe('visible');
	expect(tabbable[0].id).toBe('visible');
});

test('filter hidden: excludes inherited visibility: hidden unless overridden', () => {
	document.body.innerHTML = hiddenVisibilityInherited;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(1);
	expect(tabbable.length).toBe(1);

	expect(focusable[0].id).toBe('visible');
	expect(tabbable[0].id).toBe('visible');
});

test('filter hidden: a closed details excludes its children but keeps its summary', () => {
	document.body.innerHTML = hiddenDetails;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(3);
	expect(tabbable.length).toBe(3);

	expect(focusable.map(element => element.id)).toEqual([
		'closed-summary',
		'open-summary',
		'open-child',
	]);
	expect(tabbable.map(element => element.id)).toEqual([
		'closed-summary',
		'open-summary',
		'open-child',
	]);
});

test('filter hidden: everything inside a closed details is excluded, even an open nested details', () => {
	document.body.innerHTML = hiddenDetailsNested;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(1);
	expect(tabbable.length).toBe(1);

	expect(focusable.map(element => element.id)).toEqual(['outer-summary']);
	expect(tabbable.map(element => element.id)).toEqual(['outer-summary']);
});

test('filter hidden: excludes elements with a 0×0 rect', () => {
	document.body.innerHTML = hiddenZeroSize;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(1);
	expect(tabbable.length).toBe(1);

	expect(focusable[0].id).toBe('sized');
	expect(tabbable[0].id).toBe('sized');
});
