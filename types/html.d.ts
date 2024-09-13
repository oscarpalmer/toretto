import { type SanitiseOptions } from './sanitise';
/**
 * - Create nodes from a string of _HTML_ or a template element
 * - If `value` looks like an _ID_, it will be treated as an _ID_ before falling back to being treated as _HTML_
 * - If `sanitisation` is not provided, `true`, or an options object, bad markup will be sanitised or removed
 * - Regardless of the value of `sanitisation`, script tags will always be removed
 */
export declare function html(value: string, sanitisation?: boolean | SanitiseOptions): Node[];
/**
 * - Create nodes from a template element
 * - If `sanitisation` is not provided, `true`, or an options object, bad markup will be sanitised or removed
 * - Regardless of the value of `sanitisation`, script tags will always be removed
 */
export declare function html(value: HTMLTemplateElement, sanitisation?: boolean | SanitiseOptions): Node[];
