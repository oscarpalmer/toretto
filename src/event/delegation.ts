import {isEventTarget} from '../internal/is';
import type {CustomEventListener, RemovableEventListener} from '../models';

//

type DocumentWithListeners = Document &
	Partial<{
		[key: string]: number;
	}>;

export type EventTargetWithListeners = EventTarget &
	Partial<{
		[key: string]: Set<EventListener | CustomEventListener>;
	}>;

function addDelegatedHandler(
	document: DocumentWithListeners,
	type: string,
	name: string,
	passive: boolean,
): void {
	const listeners = `${name}${LISTENERS_SUFFIX}`;

	if (document[listeners] != null) {
		(document[listeners] as number) += 1;

		return;
	}

	document[listeners] = 1;

	document.addEventListener(type, passive ? HANDLER_PASSIVE : HANDLER_ACTIVE, {
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

	addDelegatedHandler(document as DocumentWithListeners, type, name, passive);

	return () => {
		removeDelegatedListener(target, type, name, listener, passive);
	};
}

function delegatedEventHandler(this: boolean, event: Event): void {
	const key = `${EVENT_PREFIX}${event.type}${this ? EVENT_SUFFIX_PASSIVE : EVENT_SUFFIX_ACTIVE}`;

	let target: EventTarget | Node | null = event.target;

	const items = event.composedPath();
	const {length} = items;

	for (let index = 0; index < length; index += 1) {
		target = items[index];

		const listeners = (target as EventTargetWithListeners)[key];

		if (!(target as HTMLButtonElement).disabled && listeners != null) {
			Object.defineProperties(event, {
				currentTarget: {
					configurable: true,
					value: target,
				},
				target: {
					configurable: true,
					value: target,
				},
			});

			for (const listener of listeners) {
				(listener as EventListener).call(target, event);

				if (event.cancelBubble) {
					return;
				}
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
	document: DocumentWithListeners,
	type: string,
	name: string,
	passive: boolean,
): void {
	const listeners = `${name}${LISTENERS_SUFFIX}`;

	(document[listeners] as number) -= 1;

	if ((document[listeners] as number) < 1) {
		document[listeners] = undefined;

		document.removeEventListener(
			type,
			passive ? HANDLER_PASSIVE : HANDLER_ACTIVE,
		);
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

	if (handlers?.size === 0) {
		target[name] = undefined;
	}

	removeDelegatedHandler(
		document as DocumentWithListeners,
		type,
		name,
		passive,
	);

	return true;
}

//

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

const LISTENERS_SUFFIX = ':listeners';
