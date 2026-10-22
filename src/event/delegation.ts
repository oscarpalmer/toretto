import {isEventTarget} from '../internal/is';
import {
	EVENT_DELEGATABLE,
	EVENT_DELEGATED_ACTIVE,
	EVENT_DELEGATED_PASSIVE,
	EVENT_STORE_ACTIVE,
	EVENT_STORE_PASSIVE,
	type EventStore,
	type EventTargetWithListeners,
} from '../models/event.model';
import type {CustomEventListener, RemovableEventListener} from '../models/index';
import {TORETTO_SYMBOL} from '../models/misc.model';

// #region Functions

function addDelegatedHandler(doc: Document, name: string, passive: boolean): void {
	const handlers = passive ? EVENT_DELEGATED_PASSIVE : EVENT_DELEGATED_ACTIVE;

	if (handlers.has(name)) {
		return;
	}

	handlers.add(name);

	doc.addEventListener(name, passive ? HANDLER_PASSIVE : HANDLER_ACTIVE, {
		passive,
	});
}

export function addDelegatedListener(
	target: EventTargetWithListeners,
	store: EventStore,
	name: string,
	listener: EventListener | CustomEventListener,
	passive: boolean,
): RemovableEventListener {
	target[TORETTO_SYMBOL] ??= {active: new Map(), passive: new Map()};

	let stored = target[TORETTO_SYMBOL][store].get(name);

	if (stored == null) {
		stored = new Set();

		target[TORETTO_SYMBOL][store].set(name, stored);
	}

	stored.add(listener);

	addDelegatedHandler(document, name, passive);

	return () => {
		removeDelegatedListener(target, store, name, listener);
	};
}

function delegatedEventHandler(this: boolean, event: Event): void {
	const store = this ? EVENT_STORE_PASSIVE : EVENT_STORE_ACTIVE;

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
		const listeners = item[TORETTO_SYMBOL]?.[store].get(event.type);

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

export function getDelegatedStore(
	target: EventTarget,
	type: string,
	options: AddEventListenerOptions,
): EventStore | undefined {
	if (
		isEventTarget(target) &&
		EVENT_DELEGATABLE.has(type) &&
		!options.capture &&
		!options.once &&
		options.signal == null
	) {
		return options.passive ? EVENT_STORE_PASSIVE : EVENT_STORE_ACTIVE;
	}

	return undefined;
}

export function removeDelegatedListener(
	target: EventTargetWithListeners,
	store: EventStore,
	name: string,
	listener: EventListener | CustomEventListener,
): boolean {
	const handlers = target[TORETTO_SYMBOL]?.[store].get(name);

	if (!handlers?.has(listener)) {
		return false;
	}

	handlers.delete(listener);

	if (handlers.size === 0) {
		target[TORETTO_SYMBOL]![store].delete(name);
	}

	return true;
}

// #endregion

// #region Variables

const HANDLER_ACTIVE = delegatedEventHandler.bind(false);

const HANDLER_PASSIVE = delegatedEventHandler.bind(true);

// #endregion
