/**
 * Attribute for an element
 */
export type Attribute<Value = unknown> = {
	name: string;
	value: Value;
};

/**
 * Event listener for custom events
 */
export type CustomEventListener = (event: CustomEvent) => void;

/**
 * The position of an event
 */
export type EventPosition = {
	x: number;
	y: number;
};

/**
 * Property for an element
 */
export type Property = Attribute<unknown>;

/**
 * Event listener that can be removed
 */
export type RemovableEventListener = () => void;

/**
 * Selector that be searched for
 */
export type Selector = string | Node | Node[] | NodeList;

/**
 * Text direction for an element
 */
export type TextDirection = 'ltr' | 'rtl';
