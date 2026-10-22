import type {CustomEventListener} from './index';
import type {TORETTO_SYMBOL} from './misc.model';

// #region Types

export type EventOptions = {
	capture: boolean;
	once: boolean;
	passive: boolean;
	signal?: AbortSignal;
};

export type EventStore = 'active' | 'passive';

export type EventTargetWithListeners = EventTarget & {
	[TORETTO_SYMBOL]?: EventTargetWithListenersItems;
};

type EventTargetWithListenersItems = Record<
	EventStore,
	Map<string, Set<EventListener | CustomEventListener>>
>;

// #endregion

// #region Variables

export const EVENT_DELEGATABLE: Set<string> = new Set([
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

export const EVENT_DELEGATED_ACTIVE: Set<string> = new Set();

export const EVENT_DELEGATED_PASSIVE: Set<string> = new Set();

export const EVENT_STORE_ACTIVE: EventStore = 'active';

export const EVENT_STORE_PASSIVE: EventStore = 'passive';

export const elementEvents: Record<string, Record<string, string>> = {
	DETAILS: {open: 'toggle'},
	INPUT: {checked: 'change', value: 'input'},
	SELECT: {value: 'change'},
	TEXTAREA: {value: 'input'},
};

// #endregion
