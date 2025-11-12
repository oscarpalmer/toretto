import type {PlainObject} from '@oscarpalmer/atoms';
import {isPlainObject} from '@oscarpalmer/atoms/is';
import type {Property} from '../models';

export function isProperty(value: unknown): value is Property {
	return (
		isPlainObject(value) && typeof (value as PlainObject).name === 'string'
	);
}
