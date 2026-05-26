/**
 * Attribute for an element
 */
export type Attribute = {
	name: string;
	value: unknown;
};

/**
 * Event listener for custom events
 */
export type CustomEventListener = (event: CustomEvent) => void;

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
