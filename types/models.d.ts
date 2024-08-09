export type Attribute<Value = unknown> = {
    name: string;
    value: Value;
};
export type DispatchOptions = {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
    detail?: unknown;
};
export type EventPosition = {
    x: number;
    y: number;
};
export type Selector = string | Document | Element | Element[] | NodeList;
export type TextDirection = 'ltr' | 'rtl';
