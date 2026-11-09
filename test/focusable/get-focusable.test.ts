import {beforeEach, expect, test} from 'vite-plus/test';
import {getFocusable} from '../../src/focusable';
import {
	htmlAnchor,
	htmlAudio,
	htmlDetails,
	htmlDocumentOrder,
	htmlFormControls,
	htmlNonFocusable,
	htmlSlot,
	htmlTabindex,
	htmlVideo,
} from '../.fixtures/focusable.fixture';
import {miscFixture} from '../.fixtures/misc.fixture';
import {stubLayout} from '../.helpers/layout';

stubLayout();

beforeEach(() => {
	document.body.innerHTML = '';
});

test('getFocusable: returns [] for a non-element parent', () => {
	for (let index = 0; index < miscFixture.length; index += 1) {
		expect(getFocusable(miscFixture.values[index] as never)).toEqual([]);
	}
});

test('getFocusable: returns [] for an empty parent', () => {
	const empty = document.createElement('div');

	expect(getFocusable(empty)).toEqual([]);
});

test('getFocusable: returns elements in document order', () => {
	document.body.innerHTML = htmlDocumentOrder;

	const focusable = getFocusable(document.body);

	expect(focusable.length).toBe(3);

	expect(focusable.map(element => element.id)).toEqual(['first', 'second', 'third']);
});

test('getFocusable: includes anchors with href only', () => {
	document.body.innerHTML = htmlAnchor;

	const focusable = getFocusable(document.body);

	expect(focusable.length).toBe(1);

	expect(focusable[0].id).toBe('with-href');
});

test('getFocusable: includes audio and video with controls only', () => {
	document.body.innerHTML = `${htmlAudio}${htmlVideo}`;

	const focusable = getFocusable(document.body);

	expect(focusable.length).toBe(2);

	expect(focusable.map(element => element.id)).toEqual([
		'audio-with-controls',
		'video-with-controls',
	]);
});

test('getFocusable: includes form controls', () => {
	document.body.innerHTML = htmlFormControls;

	const focusable = getFocusable(document.body);

	expect(focusable.length).toBe(4);

	expect(focusable.map(element => element.id)).toEqual(['button', 'input', 'select', 'textarea']);
});

test('getFocusable: includes only the first summary of a details, and a details without a summary', () => {
	document.body.innerHTML = htmlDetails;

	const focusable = getFocusable(document.body);

	expect(focusable.length).toBe(2);

	expect(focusable.map(element => element.id)).toEqual(['first-summary', 'empty-details']);
});

test('getFocusable: includes elements with a tabindex, except slot', () => {
	document.body.innerHTML = `${htmlTabindex}${htmlSlot}`;

	const focusable = getFocusable(document.body);

	expect(focusable.length).toBe(3);

	expect(focusable.map(element => element.id)).toEqual(['positive', 'zero', 'negative']);
});

test('getFocusable: ignores non-focusable elements', () => {
	document.body.innerHTML = htmlNonFocusable;

	const focusable = getFocusable(document.body);

	expect(focusable.length).toBe(0);
});
