import {beforeEach, expect, test} from 'vite-plus/test';
import {getFocusable, getTabbable} from '../../src/focusable';
import {
	inertAncestor,
	inertAncestorValues,
	inertAttribute,
	inertProperty,
} from '../.fixtures/focusable.fixture';
import {stubLayout} from '../.helpers/layout';

stubLayout();

beforeEach(() => {
	document.body.innerHTML = '';
});

test('filter inert: excludes an element with the inert attribute', () => {
	document.body.innerHTML = inertAttribute;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(1);
	expect(tabbable.length).toBe(1);

	expect(focusable[0].id).toBe('active');
	expect(tabbable[0].id).toBe('active');
});

test('filter inert: excludes descendants of an inert ancestor', () => {
	document.body.innerHTML = inertAncestor;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(1);
	expect(tabbable.length).toBe(1);

	expect(focusable[0].id).toBe('outside');
	expect(tabbable[0].id).toBe('outside');
});

test('filter inert: any inert attribute value on an ancestor makes descendants inert', () => {
	document.body.innerHTML = inertAncestorValues;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(1);
	expect(tabbable.length).toBe(1);

	expect(focusable[0].id).toEqual('outside');
	expect(tabbable[0].id).toEqual('outside');
});

test('filter inert: excludes an element with the inert property', () => {
	document.body.innerHTML = inertProperty;

	const child = document.getElementById('child');

	if (child != null) {
		child.inert = true;
	}

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(0);
	expect(tabbable.length).toBe(0);
});

test('filter inert: excludes descendants of an ancestor with the inert property', () => {
	document.body.innerHTML = inertProperty;

	const parent = document.getElementById('parent');

	if (parent != null) {
		parent.inert = true;
	}

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(0);
	expect(tabbable.length).toBe(0);
});
