import type { CustomDispatchOptions, DispatchOptions, EventPosition } from './models';
/**
 * Remove the current event listener
 */
type RemoveEventListener = () => void;
/**
 * Dispatch an event for a target
 */
export declare function dispatch<Type extends keyof HTMLElementEventMap>(target: EventTarget, type: Type, options?: DispatchOptions): void;
/**
 * Dispatch an event for a target
 */
export declare function dispatch<Type extends keyof HTMLElementEventMap>(target: EventTarget, type: Type, options?: CustomDispatchOptions): void;
/**
 * Dispatch an event for a target
 */
export declare function dispatch(target: EventTarget, type: string, options?: DispatchOptions): void;
/**
 * Dispatch an event for a target
 */
export declare function dispatch(target: EventTarget, type: string, options?: CustomDispatchOptions): void;
/**
 * Get the X- and Y-coordinates from a pointer event
 */
export declare function getPosition(event: MouseEvent | TouchEvent): EventPosition | undefined;
/**
 * Remove an event listener
 */
export declare function off(target: EventTarget, type: string, listener: EventListener, options?: boolean | EventListenerOptions): void;
/**
 * Add an event listener
 */
export declare function on<Type extends keyof HTMLElementEventMap>(target: EventTarget, type: Type, listener: (event: HTMLElementEventMap[Type]) => void, options?: boolean | AddEventListenerOptions): RemoveEventListener;
/**
 * Add an event listener
 */
export declare function on(target: EventTarget, type: string, listener: EventListener, options?: boolean | AddEventListenerOptions): RemoveEventListener;
export {};
