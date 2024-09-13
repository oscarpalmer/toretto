import type { PlainObject } from '@oscarpalmer/atoms/models';
import type { HTMLOrSVGElement } from '../models';
export declare function setElementValues(element: HTMLOrSVGElement, first: PlainObject | string, second: unknown, callback: (element: HTMLOrSVGElement, key: string, value: unknown) => void): void;
export declare function updateElementValue(element: HTMLOrSVGElement, key: string, value: unknown, set: (key: string, value: string) => void, remove: (key: string) => void, json: boolean): void;
