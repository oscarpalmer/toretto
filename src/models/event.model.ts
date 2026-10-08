import type {CustomEventListener} from './index';

// #region Types

export type EventOptions = {
	capture: boolean;
	once: boolean;
	passive: boolean;
	signal?: AbortSignal;
};

export type EventTargetWithListeners = EventTarget &
	Partial<{
		[key: string]: Set<EventListener | CustomEventListener>;
	}>;

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

export const EVENT_DELEGATED: Set<string> = new Set();

export const EVENT_SUFFIX_ACTIVE = ':active';

export const EVENT_SUFFIX_PASSIVE = ':passive';

export const elementEvents: Record<string, Record<string, string>> = {
	DETAILS: {open: 'toggle'},
	INPUT: {checked: 'change', value: 'input'},
	SELECT: {value: 'change'},
	TEXTAREA: {value: 'input'},
};

// #endregion
