import {isEventTarget} from '../internal/is';
import {
	EVENT_DELEGATED,
	EVENT_SUFFIX_ACTIVE,
	EVENT_SUFFIX_PASSIVE,
	EVENT_DELEGATABLE,
	type EventTargetWithListeners,
} from '../models/event.model';
import type {CustomEventListener, RemovableEventListener} from '../models/index';

// #region Functions

function addDelegatedHandler(doc: Document, type: string, name: string, passive: boolean): void {
	if (EVENT_DELEGATED.has(name)) {
		return;
	}

	EVENT_DELEGATED.add(name);

	doc.addEventListener(type, passive ? HANDLER_PASSIVE : HANDLER_ACTIVE, {
		passive,
	});
}

export function addDelegatedListener(
	target: EventTargetWithListeners,
	type: string,
	name: string,
	listener: EventListener | CustomEventListener,
	passive: boolean,
): RemovableEventListener {
	target[name] ??= new Set();

	target[name].add(listener);

	addDelegatedHandler(document, type, name, passive);

	return () => {
		removeDelegatedListener(target, name, listener);
	};
}

function delegatedEventHandler(this: boolean, event: Event): void {
	const key = `@${event.type}${this ? EVENT_SUFFIX_PASSIVE : EVENT_SUFFIX_ACTIVE}`;

	const items = event.composedPath();
	const {length} = items;

	let cancelled = false;
	let target = items[0];

	// Using `.call` to ensure correct `this` context
	// oxlint-disable-next-line typescript/unbound-method
	const originalStopPropagation = event.stopPropagation;

	event.stopPropagation = function () {
		cancelled = true;

		originalStopPropagation.call(event);
	};

	// Event is one and the same for all listeners, so stopping propagation should work the same, regardless of stop type
	event.stopImmediatePropagation = event.stopPropagation.bind(event);

	Object.defineProperties(event, {
		currentTarget: {
			configurable: true,
			get() {
				return target;
			},
		},
		target: {
			configurable: true,
			value: target,
		},
	});

	for (let index = 0; index < length; index += 1) {
		const item = items[index] as EventTargetWithListeners;
		const listeners = item[key];

		if ((item as unknown as HTMLButtonElement).disabled || listeners == null) {
			continue;
		}

		target = item;

		for (const listener of listeners) {
			(listener as EventListener).call(item, event);

			if (cancelled) {
				return;
			}
		}
	}
}

export function getDelegatedName(
	target: EventTarget,
	type: string,
	options: AddEventListenerOptions,
): string | undefined {
	return isEventTarget(target) &&
		EVENT_DELEGATABLE.has(type) &&
		!options.capture &&
		!options.once &&
		options.signal == null
		? `@${type}${options.passive ? EVENT_SUFFIX_PASSIVE : EVENT_SUFFIX_ACTIVE}`
		: undefined;
}

export function removeDelegatedListener(
	target: EventTargetWithListeners,
	name: string,
	listener: EventListener | CustomEventListener,
): boolean {
	const handlers = target[name];

	if (handlers == null || !handlers.has(listener)) {
		return false;
	}

	handlers.delete(listener);

	if (handlers.size === 0) {
		target[name] = undefined;
	}

	return true;
}

// #endregion

// #region Variables

const HANDLER_ACTIVE = delegatedEventHandler.bind(false);

const HANDLER_PASSIVE = delegatedEventHandler.bind(true);

// #endregion
