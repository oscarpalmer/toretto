import {expect, test} from 'vitest';
import * as Data from '../src/data';

test('getData & setData', () =>
	new Promise<void>(done => {
		const div = document.createElement('div');

		Data.setData(div, 'test', 'value');

		Data.setData(div, {
			foo: ['bar', 1, true],
			bar: {baz: true},
		});

		expect(Data.getData(123 as never, 'blah')).toBe(undefined);

		Data.setData(123 as never, 'noop', undefined);
		Data.setData(div, 123 as never, 'noop');

		div.dataset.badJson = '""?""';

		setTimeout(() => {
			expect(Data.getData(div, 'test')).toBe('value');
			expect(Data.getData(div, 'noop')).toBe(undefined);
			expect(Data.getData(div, 'badJson')).toBe(undefined);

			const data = Data.getData(div, ['foo', 'bar']);

			expect(data.foo).toEqual(['bar', 1, true]);
			expect(data.bar).toEqual({baz: true});

			done();
		}, 125);
	}));
