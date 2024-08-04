import {expect, test} from 'bun:test';
import * as Style from '../src/style';

test('setStyles', done => {
	const div = document.createElement('div');

	div.style.display = 'none';

	Style.setStyle(div, 'color', 'red');

	Style.setStyles(div, {
		backgroundColor: 'green',
		position: 'absolute',
	});

	setTimeout(() => {
		expect(
			Style.getStyles(div, ['color', 'display', 'backgroundColor', 'position']),
		).toEqual({
			color: 'red',
			display: 'none',
			backgroundColor: 'green',
			position: 'absolute',
		});

		Style.setStyle(div, 'display');

		setTimeout(() => {
			expect(Style.getStyle(div, 'display')).toBe('');

			done();
		}, 125);
	}, 125);
});
