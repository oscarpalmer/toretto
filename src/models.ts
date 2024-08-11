export type Attribute<Value = unknown> = {
	name: string;
	value: Value;
};

export type EventPosition = {
	x: number;
	y: number;
};

export type Selector = string | Document | Element | Element[] | NodeList;

export type TextDirection = 'ltr' | 'rtl';
