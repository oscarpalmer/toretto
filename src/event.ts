import {noop} from '@oscarpalmer/atoms/function';
import {isPlainObject} from '@oscarpalmer/atoms/is';
import {getBoolean} from './internal/get-value';
import {isEventTarget} from './is';
import type {
	CustomEventListener,
	EventPosition,
	RemovableEventListener,
} from './models';

function createDispatchOptions(options: EventInit): EventInit {
	return {
		bubbles: getBoolean(options?.bubbles),
		cancelable: getBoolean(options?.cancelable),
		composed: getBoolean(options?.composed),
	};
}

function createEvent(type: string, options?: CustomEventInit): Event {
	const hasOptions = isPlainObject(options);

	if (hasOptions && 'detail' in (options as CustomEventInit)) {
		return new CustomEvent(type, {
			...createDispatchOptions(options as CustomEventInit),
			detail: options?.detail,
		});
	}

	return new Event(type, createDispatchOptions(hasOptions ? options : {}));
}

function createEventOptions(
	options?: AddEventListenerOptions,
): AddEventListenerOptions {
	return {
		capture: getBoolean(options?.capture),
		once: getBoolean(options?.once),
		passive: getBoolean(options?.passive, true),
		signal: options?.signal,
	};
}

/**
 * Dispatch an event for a target
 * @param target Event target
 * @param type Type of event
 * @param options Options for event
 */
export function dispatch<Type extends keyof HTMLElementEventMap>(
	target: EventTarget,
	type: Type,
	options?: CustomEventInit,
): void;

/**
 * Dispatch an event for a target
 * @param target Event target
 * @param type Type of event
 * @param options Options for event
 */
export function dispatch(
	target: EventTarget,
	type: string,
	options?: CustomEventInit,
): void;

export function dispatch<Type extends keyof HTMLElementEventMap>(
	target: EventTarget,
	type: Type | string,
	options?: CustomEventInit,
): void {
	if (isEventTarget(target) && typeof type === 'string') {
		target.dispatchEvent(createEvent(type, options));
	}
}

/**
 * Get the X- and Y-coordinates from a pointer event
 * @param event Pointer event
 * @returns X- and Y-coordinates
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
 * @param target Event target
 * @param type Type of event
 * @param listener Event listener
 * @param options Options for event
 */
export function off(
	target: EventTarget,
	type: string,
	listener: EventListener | CustomEventListener,
	options?: EventListenerOptions,
): void {
	if (
		isEventTarget(target) &&
		typeof type === 'string' &&
		typeof listener === 'function'
	) {
		target.removeEventListener(
			type,
			listener as EventListener,
			createEventOptions(options),
		);
	}
}

/**
 * Add an event listener
 * @param target Event target
 * @param type Type of event
 * @param listener Event listener
 * @param options Options for event
 */
export function on<Type extends keyof HTMLElementEventMap>(
	target: EventTarget,
	type: Type,
	listener: (event: HTMLElementEventMap[Type]) => void,
	options?: AddEventListenerOptions,
): RemovableEventListener;

/**
 * Add an event listener
 * @param target Event target
 * @param type Type of event
 * @param listener Event listener
 * @param options Options for event
 */
export function on(
	target: EventTarget,
	type: string,
	listener: EventListener | CustomEventListener,
	options?: AddEventListenerOptions,
): RemovableEventListener;

export function on(
	target: EventTarget,
	type: string,
	listener: EventListener | CustomEventListener,
	options?: AddEventListenerOptions,
): RemovableEventListener {
	if (
		!isEventTarget(target) ||
		typeof type !== 'string' ||
		typeof listener !== 'function'
	) {
		return noop;
	}

	const extended = createEventOptions(options);

	target.addEventListener(type, listener as EventListener, extended);

	return () => {
		target.removeEventListener(type, listener as EventListener, extended);
	};
}
