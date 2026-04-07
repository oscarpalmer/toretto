import {expect, test} from 'vitest';
import {createElement} from '../src/create';

test('', () => {
	const div = createElement('div');

	expect(div).toBeInstanceOf(HTMLDivElement);
	expect(div.outerHTML).toBe('<div></div>');

	const input = createElement(
		'input',
		{
			checked: true,
			notAProperty: 'should be ignored',
			type: 'checkbox',
		} as never,
		{
			dataTest: 'testing data value',
		},
		{
			color: 'red',
			opacity: 0,
		},
	);

	expect(input).toBeInstanceOf(HTMLInputElement);
	// expect(input.outerHTML).toBe('<input checked="" type="checkbox" data-test="testing data value" style="color: red; opacity: 0;">');

	expect(input.checked).toBe(true);
	expect(input.type).toBe('checkbox');

	expect((input as any).notAProperty).toBeUndefined();
	expect(input.getAttribute('not-a-property')).toBeNull();

	expect(input.dataset.test).toBe('testing data value');
	expect(input.getAttribute('data-test')).toBe('testing data value');

	expect(input.style.color).toBe('red');
	expect(input.style.opacity).toBe('0');

	expect(() => createElement(123 as never)).toThrow('Tag name must be a string');
});
