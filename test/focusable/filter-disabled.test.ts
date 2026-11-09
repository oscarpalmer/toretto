import {beforeEach, expect, test} from 'vite-plus/test';
import {getFocusable, getTabbable} from '../../src/focusable';
import {
	disabledControls,
	disabledFieldset,
	disabledFieldsetLegend,
	disabledFieldsetLegendNested,
	disabledFieldsetNested,
} from '../.fixtures/focusable.fixture';
import {stubLayout} from '../.helpers/layout';

stubLayout();

beforeEach(() => {
	document.body.innerHTML = '';
});

test('filter disabled: excludes disabled button, input, select and textarea', () => {
	document.body.innerHTML = disabledControls;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(1);
	expect(tabbable.length).toBe(1);

	expect(focusable[0].id).toBe('enabled');
	expect(tabbable[0].id).toBe('enabled');
});

test('filter disabled: a disabled fieldset excludes its controls but not links or tabindex elements', () => {
	document.body.innerHTML = disabledFieldset;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(2);
	expect(tabbable.length).toBe(2);

	expect(focusable[0].id).toBe('link');
	expect(focusable[1].id).toBe('tabindex');

	expect(tabbable[0].id).toBe('link');
	expect(tabbable[1].id).toBe('tabindex');
});

test('filter disabled: only the first legend of a disabled fieldset stays enabled', () => {
	document.body.innerHTML = disabledFieldsetLegend;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(1);
	expect(tabbable.length).toBe(1);

	expect(focusable[0].id).toBe('first-legend');
	expect(tabbable[0].id).toBe('first-legend');
});

test('filter disabled: excludes controls in nested fieldsets', () => {
	document.body.innerHTML = disabledFieldsetNested;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(1);
	expect(tabbable.length).toBe(1);

	expect(focusable[0].id).toBe('enabled');
	expect(tabbable[0].id).toBe('enabled');
});

test('filter disabled: excludes the legend of a nested fieldset inside a disabled fieldset', () => {
	document.body.innerHTML = disabledFieldsetLegendNested;

	const focusable = getFocusable(document.body);
	const tabbable = getTabbable(document.body);

	expect(focusable.length).toBe(0);
	expect(tabbable.length).toBe(0);
});
