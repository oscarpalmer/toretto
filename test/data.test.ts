/** biome-ignore-all lint/style/noMagicNumbers: Testing */
import {expect, test} from 'vitest';
import * as Data from '../src/data';

test('getData & setData', () => {
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

	expect(Data.getData(div, 'test')).toBe('value');
	expect(Data.getData(div, 'noop')).toBe(undefined);
	expect(Data.getData(div, 'badJson')).toBe(undefined);

	expect(Data.getData(div, 'foo')).toEqual(['bar', 1, true]);
	expect(Data.getData(div, 'bar')).toEqual({baz: true});
	expect(Data.getData(div, 'foo', false)).toEqual('["bar",1,true]');
	expect(Data.getData(div, 'bar', false)).toEqual('{"baz":true}');

	let parsed = Data.getData(div, ['foo', 'bar']);
	let raw = Data.getData(div, ['foo', 'bar'], false);

	expect(parsed.foo).toEqual(['bar', 1, true]);
	expect(parsed.bar).toEqual({baz: true});

	expect(raw.foo).toEqual('["bar",1,true]');
	expect(raw.bar).toEqual('{"baz":true}');

	Data.setData(div, {
		foo: undefined,
		bar: undefined,
	});

	expect(Data.getData(div, 'foo')).toBe(undefined);
	expect(Data.getData(div, 'bar')).toBe(undefined);
	expect(Data.getData(div, 'foo', false)).toBe(undefined);
	expect(Data.getData(div, 'bar', false)).toBe(undefined);

	parsed = Data.getData(div, ['foo', 'bar']);
	raw = Data.getData(div, ['foo', 'bar'], false);

	expect(parsed.foo).toEqual(undefined);
	expect(parsed.bar).toEqual(undefined);

	expect(raw.foo).toEqual(undefined);
	expect(raw.bar).toEqual(undefined);
});
