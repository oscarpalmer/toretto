export type Attribute<Value = unknown> = {
	name: string;
	value: Value;
};

export type EventPosition = {
	x: number;
	y: number;
};

export type HTMLOrSVGElement = HTMLElement | SVGElement;

export type Property = Attribute;

/**
 * Event listener that can be removed
 */
export type RemovableEventListener = () => void;

export type Selector = string | Node | Node[] | NodeList;

export type TextDirection = 'ltr' | 'rtl';
