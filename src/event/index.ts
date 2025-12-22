import {noop} from '@oscarpalmer/atoms/function';
import {isPlainObject} from '@oscarpalmer/atoms/is';
import {getBoolean} from '../internal/get-value';
import {isEventTarget} from '../internal/is';
import type {CustomEventListener, EventPosition, RemovableEventListener} from '../models';
import {
	addDelegatedListener,
	type EventTargetWithListeners,
	getDelegatedName,
	removeDelegatedListener,
} from './delegation';

//

type EventOptions = {
	capture: boolean;
	once: boolean;
	passive: boolean;
	signal?: AbortSignal;
};

//

function createDispatchOptions(options: EventInit): EventInit {
	return {
		bubbles: getBoolean(options?.bubbles, true),
		cancelable: getBoolean(options?.cancelable, true),
		composed: getBoolean(options?.composed),
	};
}

function createEvent(type: string, options?: CustomEventInit): Event {
	const hasOptions = isPlainObject(options);

	if (hasOptions && PROPERTY_DETAIL in (options as CustomEventInit)) {
		return new CustomEvent(type, {
			...createDispatchOptions(options as CustomEventInit),
			detail: options?.detail,
		});
	}

	return new Event(type, createDispatchOptions(hasOptions ? options : {}));
}

function createEventOptions(options?: AddEventListenerOptions): EventOptions {
	return {
		capture: getBoolean(options?.capture),
		once: getBoolean(options?.once),
		passive: getBoolean(options?.passive, true),
		signal: options?.signal instanceof AbortSignal ? options.signal : undefined,
	};
}

/**
 * Dispatch an event for a target
 * @param target Event target
 * @param type Type of event
 * @param options Options for event _(bubbles and is cancelable by default)_
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
 * @param options Options for event _(bubbles and is cancelable by default)_
 */
export function dispatch(target: EventTarget, type: string, options?: CustomEventInit): void;

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
export function getPosition(event: MouseEvent | TouchEvent): EventPosition | undefined {
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
	type: keyof HTMLElementEventMap,
	listener: EventListener | CustomEventListener,
	options?: EventListenerOptions,
): void;

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
): void;

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
	if (!isEventTarget(target) || typeof type !== 'string' || typeof listener !== 'function') {
		return;
	}

	const extended = createEventOptions(options);
	const delegated = getDelegatedName(target, type, extended);

	if (
		delegated == null ||
		!removeDelegatedListener(target as EventTargetWithListeners, delegated, listener)
	) {
		target.removeEventListener(type, listener as EventListener, extended);
	}
}

/**
 * Add an event listener
 * @param target Event target
 * @param type Type of event
 * @param listener Event listener
 * @param options Options for event _(passive by default)_
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
 * @param options Options for event _(passive by default)_
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
	if (!isEventTarget(target) || typeof type !== 'string' || typeof listener !== 'function') {
		return noop;
	}

	const extended = createEventOptions(options);
	const delegated = getDelegatedName(target, type, extended);

	if (delegated != null) {
		return addDelegatedListener(
			target as EventTargetWithListeners,
			type,
			delegated,
			listener,
			extended.passive,
		);
	}

	target.addEventListener(type, listener as EventListener, extended);

	if (extended.once) {
		return noop;
	}

	return () => {
		target.removeEventListener(type, listener as EventListener, extended);
	};
}

//

const PROPERTY_DETAIL = 'detail';
