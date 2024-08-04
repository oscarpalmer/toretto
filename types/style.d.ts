/**
 * Get a style from an element
 */
export declare function getStyle(element: HTMLElement, property: keyof CSSStyleDeclaration): string;
/**
 * Get styles from an element
 */
export declare function getStyles<Property extends keyof CSSStyleDeclaration>(element: HTMLElement, properties: Property[]): Pick<CSSStyleDeclaration, Property>;
/**
 * Set a style on an element
 */
export declare function setStyle(element: HTMLElement, property: keyof CSSStyleDeclaration, value?: string): void;
/**
 * Set styles on an element
 */
export declare function setStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void;
