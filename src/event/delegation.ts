import {isEventTarget} from '../internal/is';
import type {CustomEventListener, RemovableEventListener} from '../models';

//

export type EventTargetWithListeners = EventTarget &
	Partial<{
		[key: string]: Set<EventListener | CustomEventListener>;
	}>;

function addDelegatedHandler(doc: Document, type: string, name: string, passive: boolean): void {
	if (DELEGATED.has(name)) {
		return;
	}

	DELEGATED.add(name);

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
	const key = `${EVENT_PREFIX}${event.type}${this ? EVENT_SUFFIX_PASSIVE : EVENT_SUFFIX_ACTIVE}`;

	const items = event.composedPath();
	const {length} = items;

	let target = items[0];

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

			if (event.cancelBubble) {
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
	if (
		isEventTarget(target) &&
		EVENT_TYPES.has(type) &&
		!options.capture &&
		!options.once &&
		options.signal == null
	) {
		return `${EVENT_PREFIX}${type}${options.passive ? EVENT_SUFFIX_PASSIVE : EVENT_SUFFIX_ACTIVE}`;
	}
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

//

const DELEGATED = new Set<string>();

const EVENT_PREFIX = '@';

const EVENT_SUFFIX_ACTIVE = ':active';

const EVENT_SUFFIX_PASSIVE = ':passive';

const EVENT_TYPES: Set<string> = new Set([
	'beforeinput',
	'click',
	'dblclick',
	'contextmenu',
	'focusin',
	'focusout',
	'input',
	'keydown',
	'keyup',
	'mousedown',
	'mousemove',
	'mouseout',
	'mouseover',
	'mouseup',
	'pointerdown',
	'pointermove',
	'pointerout',
	'pointerover',
	'pointerup',
	'touchend',
	'touchmove',
	'touchstart',
]);

const HANDLER_ACTIVE = delegatedEventHandler.bind(false);

const HANDLER_PASSIVE = delegatedEventHandler.bind(true);
