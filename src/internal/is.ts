import type {EventPosition} from '@oscarpalmer/atoms/models';

// #region Functions

/**
 * Is the value an event position?
 *
 * @param value Value to check
 * @returns `true` if it's an event position, otherwise `false`
 */
export function isEventPosition(value: unknown): value is EventPosition {
	return (
		typeof value === 'object' &&
		value != null &&
		typeof (value as EventPosition).x === 'number' &&
		typeof (value as EventPosition).y === 'number'
	);
}

/**
 * Is the value an event target?
 *
 * @param value Value to check
 * @returns `true` if it's an event target, otherwise `false`
 */
export function isEventTarget(value: unknown): value is EventTarget {
	return (
		typeof value === 'object' &&
		value != null &&
		typeof (value as EventTarget).addEventListener === 'function' &&
		typeof (value as EventTarget).removeEventListener === 'function' &&
		typeof (value as EventTarget).dispatchEvent === 'function'
	);
}

/**
 * Is the value an _HTML_ or _SVG_ element?
 *
 * @param value Value to check
 * @returns `true` if it's an _HTML_ or _SVG_ element, otherwise `false`
 */
export function isHTMLOrSVGElement(value: unknown): value is HTMLElement | SVGElement {
	return value instanceof HTMLElement || value instanceof SVGElement;
}

/**
 * Is the value an input element? _(`<input>`, `<select>`, or `<textarea>`)_
 *
 * @param value Value to check
 * @returns `true` if it's an input element, otherwise `false`
 */
export function isInputElement(
	value: unknown,
): value is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
	return (
		value instanceof HTMLInputElement ||
		value instanceof HTMLSelectElement ||
		value instanceof HTMLTextAreaElement
	);
}

// #endregion
