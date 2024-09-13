import type { EventPosition, RemovableEventListener } from './models';
/**
 * Dispatch an event for a target
 */
export declare function dispatch<Type extends keyof HTMLElementEventMap>(target: EventTarget, type: Type, options?: CustomEventInit): void;
/**
 * Dispatch an event for a target
 */
export declare function dispatch(target: EventTarget, type: string, options?: CustomEventInit): void;
/**
 * Get the X- and Y-coordinates from a pointer event
 */
export declare function getPosition(event: MouseEvent | TouchEvent): EventPosition | undefined;
/**
 * Remove an event listener
 */
export declare function off(target: EventTarget, type: string, listener: EventListener, options?: EventListenerOptions): void;
/**
 * Add an event listener
 */
export declare function on<Type extends keyof HTMLElementEventMap>(target: EventTarget, type: Type, listener: (event: HTMLElementEventMap[Type]) => void, options?: AddEventListenerOptions): RemovableEventListener;
/**
 * Add an event listener
 */
export declare function on(target: EventTarget, type: string, listener: EventListener, options?: AddEventListenerOptions): RemovableEventListener;
