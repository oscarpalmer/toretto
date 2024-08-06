export type Attribute<Value = unknown> = {
	name: string;
	value: Value;
};

export type Selector = string | Document | Element | Element[] | NodeList;
