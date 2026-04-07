import {expect, test} from 'vitest';
import * as Style from '../src/style';

test('getStyle(s) & setStyle(s)', () =>
	new Promise<void>(done => {
		const div = document.createElement('div');

		div.style.display = 'none';

		Style.setStyle(div, 'color', 'red');

		Style.setStyles(div, {
			backgroundColor: 'green',
			position: 'absolute',
		});

		expect(Style.getStyle(123 as never, 'color')).toBeUndefined();
		expect(Style.getStyles(123 as never, ['color'])).toEqual({});

		setTimeout(() => {
			expect(
				Style.getStyles(div, [
					'color',
					'display',
					'backgroundColor',
					'position',
					123 as never,
					(() => {}) as never,
				]),
			).toEqual({
				color: 'red',
				display: 'none',
				backgroundColor: 'green',
				position: 'absolute',
			});

			expect(
				Style.getStyles(
					div,
					['color', 'display', 'backgroundColor', 'position', 123 as never, (() => {}) as never],
					true,
				),
			).toEqual({
				color: 'rgb(255, 0, 0)',
				display: 'none',
				backgroundColor: 'rgb(0, 128, 0)',
				position: 'absolute',
			});

			Style.setStyle(div, 'display');
		}, 125);

		setTimeout(() => {
			expect(Style.getStyle(div, 'display')).toBe('');

			done();
		}, 250);
	}));

test('getTextDirection', () => {
	const fragment = document.createDocumentFragment();
	const parent = document.createElement('div');

	fragment.appendChild(parent);

	parent.id = 'parent';

	parent.innerHTML = `<div id="outer" dir="rtl">
	<div id="inner">
		<span id="text" style="direction: ltr">A little bit of text</span>
	</div>
</div>`;

	const parentElement = fragment.getElementById('parent');
	const outerElement = fragment.getElementById('outer');
	const innerElement = fragment.getElementById('inner');
	const textElement = fragment.getElementById('text');
	const textNode = textElement?.firstChild;

	if (
		parentElement == null ||
		outerElement == null ||
		innerElement == null ||
		textElement == null ||
		textNode == null
	) {
		return;
	}

	expect(Style.getTextDirection(parentElement)).toBe('ltr');
	expect(Style.getTextDirection(outerElement)).toBe('rtl');
	expect(Style.getTextDirection(textElement)).toBe('ltr');
	expect(Style.getTextDirection(innerElement)).toBe('rtl');

	expect(Style.getTextDirection(textNode as never)).toBe('ltr');

	expect(Style.getTextDirection(123 as never)).toBe('ltr');
	expect(Style.getTextDirection()).toBe('ltr');

	parentElement.ownerDocument.documentElement.setAttribute('dir', 'rtl');

	expect(Style.getTextDirection()).toBe('rtl');

	parentElement.ownerDocument.documentElement.style.direction = 'ltr';

	expect(Style.getTextDirection()).toBe('ltr');
});

test('toggleStyles', () => {
	const div = document.createElement('div');

	const toggler = Style.toggleStyles(div, {
		color: 'red',
		backgroundColor: 'green',
		position: 'absolute',
	});

	expect(toggler).toHaveProperty('set');
	expect(toggler.set).toBeInstanceOf(Function);
	expect(toggler).toHaveProperty('remove');
	expect(toggler.remove).toBeInstanceOf(Function);

	expect(Style.getStyles(div, ['color', 'backgroundColor', 'position'])).toEqual({
		color: '',
		backgroundColor: '',
		position: '',
	});

	toggler.set();
	toggler.set();

	expect(Style.getStyles(div, ['color', 'backgroundColor', 'position'])).toEqual({
		color: 'red',
		backgroundColor: 'green',
		position: 'absolute',
	});

	toggler.remove();
	toggler.remove();

	expect(Style.getStyles(div, ['color', 'backgroundColor', 'position'])).toEqual({
		color: '',
		backgroundColor: '',
		position: '',
	});
});
