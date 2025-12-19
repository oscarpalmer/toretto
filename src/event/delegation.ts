import {isEventTarget} from '../internal/is';
import type {CustomEventListener, RemovableEventListener} from '../models';

//

type DocumentWithListenerCounts = Document &
	Partial<{
		[key: string]: number;
	}>;

export type EventTargetWithListeners = EventTarget &
	Partial<{
		[key: string]: Set<EventListener | CustomEventListener>;
	}>;

function addDelegatedHandler(
	doc: DocumentWithListenerCounts,
	type: string,
	name: string,
	passive: boolean,
): void {
	const count = `${name}${COUNT_SUFFIX}`;

	if (doc[count] != null) {
		(doc[count] as number) += 1;

		return;
	}

	doc[count] = 1;

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

	target[name]?.add(listener);

	addDelegatedHandler(document as DocumentWithListenerCounts, type, name, passive);

	return () => {
		removeDelegatedListener(target, type, name, listener, passive);
	};
}

function delegatedEventHandler(this: boolean, event: Event): void {
	const key = `${EVENT_PREFIX}${event.type}${this ? EVENT_SUFFIX_PASSIVE : EVENT_SUFFIX_ACTIVE}`;

	const items = event.composedPath();
	const {length} = items;

	Object.defineProperty(event, 'target', {
		configurable: true,
		value: items[0],
	});

	for (let index = 0; index < length; index += 1) {
		const item = items[index] as EventTargetWithListeners;
		const listeners = item[key];

		if ((item as unknown as HTMLButtonElement).disabled || listeners == null) {
			continue;
		}

		Object.defineProperty(event, 'currentTarget', {
			configurable: true,
			value: item,
		});

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

function removeDelegatedHandler(
	doc: DocumentWithListenerCounts,
	type: string,
	name: string,
	passive: boolean,
): void {
	const count = `${name}${COUNT_SUFFIX}`;

	(doc[count] as number) -= 1;

	if ((doc[count] as number) < 1) {
		doc[count] = undefined;

		doc.removeEventListener(type, passive ? HANDLER_PASSIVE : HANDLER_ACTIVE);
	}
}

export function removeDelegatedListener(
	target: EventTargetWithListeners,
	type: string,
	name: string,
	listener: EventListener | CustomEventListener,
	passive: boolean,
): boolean {
	const handlers = target[name];

	if (handlers == null || !handlers.has(listener)) {
		return false;
	}

	handlers.delete(listener);

	if (handlers.size === 0) {
		target[name] = undefined;
	}

	removeDelegatedHandler(document as DocumentWithListenerCounts, type, name, passive);

	return true;
}

//

const COUNT_SUFFIX = '.count';

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

const HANDLER_ACTIVE: EventListener = delegatedEventHandler.bind(false);

const HANDLER_PASSIVE: EventListener = delegatedEventHandler.bind(true);
