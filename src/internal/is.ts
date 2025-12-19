/**
 * Is the value an event target?
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
 * Is the value an HTML or SVG element?
 * @param value Value to check
 * @returns `true` if it's an HTML or SVG element, otherwise `false`
 */
export function isHTMLOrSVGElement(value: unknown): value is HTMLElement | SVGElement {
	return value instanceof HTMLElement || value instanceof SVGElement;
}
