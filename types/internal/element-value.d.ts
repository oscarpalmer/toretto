import type { PlainObject } from '@oscarpalmer/atoms/models';
export declare function setElementValues(element: HTMLElement, first: PlainObject | string, second: unknown, callback: (element: HTMLElement, key: string, value: unknown) => void): void;
export declare function updateElementValue(element: HTMLElement, key: string, value: unknown, set: (key: string, value: string) => void, remove: (key: string) => void, json: boolean): void;
