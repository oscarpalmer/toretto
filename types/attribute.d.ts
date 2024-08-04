type Attribute<Value = unknown> = {
    name: string;
    value: Value;
};
/**
 * Set an attribute on an element  _(or remove it, if the value is `null` or `undefined`)_
 */
export declare function setAttribute(element: Element, name: string, value: unknown): void;
/**
 * Set one or more attributes on an element  _(or remove them, if their value is `null` or `undefined`)_
 */
export declare function setAttributes(element: Element, attributes: Attribute[]): void;
/**
 * Set one or more attributes on an element  _(or remove them, if their value is `null` or `undefined`)_
 */
export declare function setAttributes(element: Element, attributes: Record<string, unknown>): void;
export {};
