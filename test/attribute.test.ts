import {expect, test} from 'bun:test';
import * as Attribute from '../src/attribute';

test('setAttribute', () => {
	const element = document.createElement('div');

	Attribute.setAttribute(element, 'id', 'test');

	expect(element.getAttribute('id')).toBe('test');

	Attribute.setAttribute(element, 'id', null);

	expect(element.getAttribute('id')).toBe(null);

	Attribute.setAttributes(element, {
		alpha: 123,
		beta: 'hello',
		gamma: true,
	});

	expect(element.getAttribute('alpha')).toBe('123');
	expect(element.getAttribute('beta')).toBe('hello');
	expect(element.getAttribute('gamma')).toBe('true');

	Attribute.setAttributes(element, [{name: 'beta', value: null}]);

	expect(element.getAttribute('beta')).toBe(null);

	Attribute.setAttributes(element, [
		{name: 'alpha', value: 456},
		{name: 'gamma', value: false},
	]);

	expect(element.getAttribute('alpha')).toBe('456');
	expect(element.getAttribute('gamma')).toBe('false');

	Attribute.setAttributes(element, [{name: 'alpha', value: null}]);

	expect(element.getAttribute('alpha')).toBe(null);
});
