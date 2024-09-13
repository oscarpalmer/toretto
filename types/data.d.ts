import type { PlainObject } from '@oscarpalmer/atoms/models';
import type { HTMLOrSVGElement } from './models';
/**
 * Get data values from an element
 */
export declare function getData<Value extends PlainObject>(element: HTMLOrSVGElement, keys: string[]): Value;
/**
 * Get a data value from an element
 */
export declare function getData(element: HTMLOrSVGElement, key: string): unknown;
/**
 * Set data values on an element
 */
export declare function setData(element: HTMLOrSVGElement, data: PlainObject): void;
/**
 * Set a data value on an element
 */
export declare function setData(element: HTMLOrSVGElement, key: string, value: unknown): void;
