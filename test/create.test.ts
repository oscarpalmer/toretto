import {expect, test} from 'vitest';
import {createElement} from '../src/create';

test('', () => {
	const div = createElement('div');

	expect(div).toBeInstanceOf(HTMLDivElement);
	expect(div.outerHTML).toBe('<div></div>');

	const span = createElement('span', {});

	expect(span).toBeInstanceOf(HTMLSpanElement);
	expect(span.outerHTML).toBe('<span></span>');

	const input = createElement('input', {
		aria: {
			selected: true,
		},
		attribute: {
			'aria-label': 'testing aria label',
			dataFoo: 'testing data value',
		},
		data: {
			bar: 123,
		},
		property: {
			checked: true,
			notAProperty: 'should be ignored',
			type: 'checkbox',
		} as never,
		style: {
			color: 'red',
			opacity: 0,
		},
	});

	expect(input).toBeInstanceOf(HTMLInputElement);

	expect(input.checked).toBe(true);
	expect(input.type).toBe('checkbox');

	expect((input as any).notAProperty).toBeUndefined();
	expect(input.getAttribute('not-a-property')).toBeNull();

	expect(input.dataset.foo).toBe('testing data value');
	expect(input.getAttribute('data-foo')).toBe('testing data value');
	expect(input.dataset.bar).toBe('123');
	expect(input.getAttribute('data-bar')).toBe('123');

	expect(input.ariaLabel).toBe('testing aria label');
	expect(input.getAttribute('aria-label')).toBe('testing aria label');
	expect(input.ariaSelected).toBe('true');
	expect(input.getAttribute('aria-selected')).toBe('true');

	expect(input.style.color).toBe('red');
	expect(input.style.opacity).toBe('0');

	expect(() => createElement(123 as never)).toThrow('Tag name must be a string');
});
