import {isPlainObject} from '@oscarpalmer/atoms/is';
import type {DispatchOptions, EventPosition} from './models';

/**
 * Remove the current event listener
 */
type RemoveEventListener = () => void;

function createDispatchOptions(options: DispatchOptions): DispatchOptions {
	return {
		bubbles: getBoolean(options?.bubbles),
		cancelable: getBoolean(options?.cancelable),
		composed: getBoolean(options?.composed),
	};
}

function createEvent(type: string, options?: DispatchOptions): Event {
	const hasOptions = isPlainObject(options);

	if (hasOptions && 'detail' in options) {
		return new CustomEvent(type, {
			...createDispatchOptions(options),
			detail: options?.detail,
		});
	}

	return new Event(type, createDispatchOptions(hasOptions ? options : {}));
}

function createEventOptions(
	options?: boolean | AddEventListenerOptions,
): AddEventListenerOptions {
	if (isPlainObject(options)) {
		return {
			capture: getBoolean(options.capture),
			once: getBoolean(options.once),
			passive: getBoolean(options.passive, true),
		};
	}

	return {
		capture: getBoolean(options),
		once: false,
		passive: true,
	};
}

/**
 * Dispatch an event for a target
 */
export function dispatch<Type extends keyof HTMLElementEventMap>(
	target: EventTarget,
	type: Type,
	options?: DispatchOptions,
): void;

/**
 * Dispatch an event for a target
 */
export function dispatch(
	target: EventTarget,
	type: string,
	options?: DispatchOptions,
): void;

export function dispatch<Type extends keyof HTMLElementEventMap>(
	target: EventTarget,
	type: Type | string,
	options?: DispatchOptions,
): void {
	target.dispatchEvent(createEvent(type, options));
}

function getBoolean(value: unknown, defaultValue?: boolean): boolean {
	return typeof value === 'boolean' ? value : defaultValue ?? false;
}

/**
 * Get the X- and Y-coordinates from a pointer event
 */
export function getPosition(
	event: MouseEvent | TouchEvent,
): EventPosition | undefined {
	let x: number | undefined;
	let y: number | undefined;

	if (event instanceof MouseEvent) {
		x = event.clientX;
		y = event.clientY;
	} else if (event instanceof TouchEvent) {
		x = event.touches[0]?.clientX;
		y = event.touches[0]?.clientY;
	}

	return typeof x === 'number' && typeof y === 'number' ? {x, y} : undefined;
}

/**
 * Remove an event listener
 */
export function off(
	target: EventTarget,
	type: string,
	listener: EventListener,
	options?: boolean | EventListenerOptions,
): void {
	target.removeEventListener(type, listener, createEventOptions(options));
}

/**
 * Add an event listener
 */
export function on<Type extends keyof HTMLElementEventMap>(
	target: EventTarget,
	type: Type,
	listener: (event: HTMLElementEventMap[Type]) => void,
	options?: boolean | AddEventListenerOptions,
): RemoveEventListener;

/**
 * Add an event listener
 */
export function on(
	target: EventTarget,
	type: string,
	listener: EventListener,
	options?: boolean | AddEventListenerOptions,
): RemoveEventListener;

export function on(
	target: EventTarget,
	type: string,
	listener: EventListener,
	options?: boolean | AddEventListenerOptions,
): RemoveEventListener {
	const extended = createEventOptions(options);

	target.addEventListener(type, listener, extended);

	return () => {
		target.removeEventListener(type, listener, extended);
	};
}
